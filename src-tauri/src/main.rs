#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use reqwest::Client;
use scraper::{Html, Selector};
use selectors::Element;
use serde::Serialize;

const BGM_BASE_URL: &str = "https://api.bgm.tv";
const BGM_APP_ID: &str = "bgm257463f648fa0b307";
const BGM_TOKEN: &str = "75fa4cbbcbfb7e15678be567a7d5b8e9";

async fn search_BGM_anime_by_keyword(keyword: &str) -> Result<(), Box<dyn std::error::Error>> {
    let keyword = if let Some(index) = keyword.find('\n') {
        &keyword[..index]
    } else {
        keyword
    };

    use reqwest::header::{HeaderMap, HeaderValue, AUTHORIZATION, USER_AGENT};
    use reqwest::Url;
    use url::form_urlencoded;

    // 创建一个reqwest客户端
    let client = Client::new();

    // 定义请求的url和参数
    let url_encoded_keywords = form_urlencoded::Serializer::new(String::new())
        .append_key_only(keyword)
        .finish();
    let url = format!(
        "{}/search/subject/{}?{}",
        BGM_BASE_URL, url_encoded_keywords, "type=2&responseGroup=small&start=0&max_results=25"
    );

    // 定义请求头，包括自定义的User-Agent
    let mut headers = HeaderMap::new();
    headers.insert(USER_AGENT, "customua/kayanoai.net".parse().unwrap());
    headers.insert(
        AUTHORIZATION,
        format!("Bearer {}", BGM_TOKEN).parse().unwrap(),
    );

    // 发送GET请求并处理响应
    let response = client
        .get(Url::parse(&url)?)
        .headers(headers)
        .send()
        .await?;
    let status = response.status();
    let body = response.text().await?;

    println!("URL: {}", url);
    println!("Status: {}", status);
    println!("Body: {:?}", body);

    Ok(())
}

// 自定义结构体用于保存响应结果
#[derive(Debug, Serialize)]
#[serde(untagged)]
enum ScraperResult {
    Success(Vec<Season>),
    Error(String),
}

#[derive(Debug, Serialize)]
struct Season {
    title: String,
    data: Vec<BangumiData>,
}

impl Clone for Season {
    fn clone(&self) -> Self {
        Season {
            title: self.title.clone(),
            data: self.data.clone(),
        }
    }
}

#[derive(Debug, Clone, Serialize)]
struct BangumiData {
    date: String,
    title: String,
    #[serde(default)]
    broadcast_station: Vec<String>,
}

#[tauri::command]
async fn get_kansou() -> Result<ScraperResult, ScraperResult> {
    let url = "https://www.kansou.me/";
    let client = Client::new();
    let res = client.get(url).send().await.map_err(|e| {
        let status = e.status().map(|s| s.as_u16()).unwrap_or(0);
        let msg = e.to_string();
        ScraperResult::Error(format!("{}: {}", status, msg))
    })?;

    let body = res
        .text()
        .await
        .map_err(|e| ScraperResult::Error(format!("0, {}", e.to_string())))?;
    let html = Html::parse_document(&body);
    let h2_selector = Selector::parse("h2").unwrap();
    let tbody_selector = Selector::parse("tbody").unwrap();
    let tr_selector = Selector::parse("tr").unwrap();
    let td_selector = Selector::parse("td").unwrap();

    let mut programs = Vec::new();

    for h2_element in html.select(&h2_selector) {
        let mut program = Season {
            title: h2_element.text().collect(),
            data: Vec::new(),
        };

        let table_element = h2_element.next_sibling_element().unwrap();
        if table_element.value().name() != "table" {
            continue;
        }

        let tbody_element = table_element.select(&tbody_selector).next().unwrap();
        for tr_element in tbody_element.select(&tr_selector) {
            let td_elements: Vec<_> = tr_element.select(&td_selector).collect();
            if td_elements.len() >= 3 {
                let date = td_elements[0].text().collect();
                let title = td_elements[1].text().collect();
                let broadcast_station = td_elements[2]
                    .text()
                    .collect::<String>()
                    .split('\n')
                    .map(|s| s.trim().to_owned())
                    .filter(|s| !s.is_empty())
                    .collect();

                let data = BangumiData {
                    date,
                    title,
                    broadcast_station,
                };
                program.data.push(data);
            }
        }

        programs.push(program);
    }

    // println!("{:#?}", ScraperResult::Success(programs.clone()));
    Ok(ScraperResult::Success(programs))
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_kansou])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_search_BGM_anime_by_keyword() {
        let keyword = "夜勤病栋\n张三";
        let result = search_BGM_anime_by_keyword(keyword).await;
        assert!(result.is_ok());

        let keyword = "夜勤病栋";
        let result = search_BGM_anime_by_keyword(keyword).await;
        assert!(result.is_ok());
    }

    #[tokio::test]
    async fn test_get_kansou() {
        let result = get_kansou().await;
        assert!(result.is_ok());
    }
}

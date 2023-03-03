use reqwest::Url;
use scraper::{Html, Selector};
use serde::Serialize;

pub(crate) struct WebsiteData {
    pub(crate) data: String,
    pub(crate) website_type: WebsiteType,
}

pub(crate) enum WebsiteType {
    ArchiveList,
    Archive(String),
}

impl WebsiteData {
    fn from_archive_list() -> Result<Self, Box<dyn std::error::Error>> {
        let url = Url::parse("https://www.kansou.me/archive/archivelist.html")?;
        let data = reqwest::blocking::get(url)?.text()?;
        Ok(Self {
            data,
            website_type: WebsiteType::ArchiveList,
        })
    }

    fn from_archive(url: &str) -> Result<Self, Box<dyn std::error::Error>> {
        let url = Url::parse(url)?;
        let data = reqwest::blocking::get(url.as_str())?.text()?;
        Ok(Self {
            data,
            website_type: WebsiteType::Archive(url.to_string()),
        })
    }

    fn get_data(&self) -> &str {
        &self.data
    }

    fn process_data(&self) -> String {
        match self.website_type {
            WebsiteType::ArchiveList => {
                // Process archive list data
                "Processing archive list data...".to_string()
            }
            WebsiteType::Archive(ref url) => {
                // Process archive data
                format!("Processing archive data from {}...", url)
            }
        }
    }
}

// 自定义结构体用于保存响应结果
#[derive(Debug, Serialize)]
#[serde(untagged)]
pub(crate) enum ScraperResponse {
    Data(Vec<Season>),
    None,
}

#[derive(Debug, Serialize)]
pub(crate) struct Season {
    pub(crate) title: String,
    pub(crate) data: Vec<BangumiData>,
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
pub(crate) struct BangumiData {
    pub(crate) date: String,
    pub(crate) title: String,
    #[serde(default)]
    pub(crate) broadcast_station: Vec<String>,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_archive_list() {
        let archive_list = WebsiteData::from_archive_list().unwrap();
        println!("{}", archive_list.get_data());
        assert_eq!(
            archive_list.process_data(),
            "Processing archive list data..."
        );
    }

    #[test]
    fn test_archive() {
        let archive = WebsiteData::from_archive("https://www.kansou.me/").unwrap();
        println!("{}", archive.get_data());
        assert_eq!(
            archive.process_data(),
            "Processing archive data from https://www.kansou.me/..."
        );
    }
}

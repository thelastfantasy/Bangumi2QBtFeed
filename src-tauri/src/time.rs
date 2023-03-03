use time::macros::offset;
use time::{format_description, OffsetDateTime};

pub fn print_time(time_str: &str) -> Result<String, time::error::Format> {
    let rfc2822_alt = format_description::parse(
        "[day] [month repr:short] [year] [hour]:[minute]:[second] +[offset_hour][offset_minute]",
    )
    .unwrap();

    let input_time = OffsetDateTime::parse(time_str, &rfc2822_alt).unwrap();

    input_time.to_offset(offset!(+9)).format(&rfc2822_alt)
}

trait MyTrait<'a> {
    type Output: Sized + Iterator<Item = &'a Self::Item> + Clone;
    type Item: 'a + Clone;

    fn my_function(&self) -> Self::Output;

    fn to_vec(&self) -> Vec<Self::Item>
    where
        Self: Clone,
        Self::Output: Clone,
    {
        self.clone().my_function().cloned().collect()
    }
}

#[cfg(test)]
mod tests {
    use regex::Regex;

    use super::*;

    #[test]
    fn test_to_vec() {
        let v = vec![1, 2, 3, 4, 5];
        let v2 = v.to_vec();
        assert_eq!(v, v2);
    }

    #[test]
    fn test_time() {
        assert_eq!(
            print_time("03 Dec 2017 18:27:11 +0000").unwrap(),
            "04 Dec 2017 03:27:11 +0900"
        );
    }

    #[test]
    fn test_time2() {
        let re = Regex::new(r"\((日|月|火|水|木|金|土)\)").unwrap();
        let input = "03/09(木) 25:00";
        let year = 2023;
        let time_string = format!("{input}:00 +0900 {year}");

        let time_str = re.replace_all(&time_string.as_str(), "");
        println!("{}", time_str);
        let format = format_description::parse(
            "[month]/[day] [hour]:[minute]:[second] +[offset_hour][offset_minute] [year]",
        )
        .unwrap();

        let input_time = OffsetDateTime::parse(&time_str, &format).unwrap();

        println!(
            "{}",
            input_time.to_offset(offset!(+9)).format(&format).unwrap()
        );
    }
}

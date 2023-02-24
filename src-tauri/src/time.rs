pub(crate) mod my_time {
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

    #[test]
    fn test_time() {
        assert_eq!(
            print_time("03 Dec 2017 18:27:11 +0000").unwrap(),
            "04 Dec 2017 03:27:11 +0900"
        );
    }
}

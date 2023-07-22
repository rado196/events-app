declare interface IParsedEventFrom {
  id: number;
  title: string;
  description: string | null;
  date: string;
  image: string | null;
  venue: string;
  url: string;
  region: string;
  category: string;
  age: number;
  venue_id: number;
  venue_address: string;
  google_address: string;
  venue_alias: string;
  web_tag_groups: string;
  date_type: string;
  min_price: number;
  max_price: number;
}

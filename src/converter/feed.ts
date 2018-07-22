export interface FeedItem {
  title: string,
  link: string,
  description: string,
  date: string,
}

export interface Feed {
  title: string,
  description: string,
  link: string,
  author?: {
    name?: string,
    email?: string,
  },
  items: FeedItem[],
}

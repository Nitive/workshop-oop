import { Feed } from '../feed'

export interface FeedParser {
  parse(fileContent: string): Feed,
}

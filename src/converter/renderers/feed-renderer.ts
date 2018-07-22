import { Feed } from '../feed'

export interface FeedRenderer {
  render(feed: Feed): string,
}

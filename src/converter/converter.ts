import { identity, sortBy } from 'ramda'
import { Feed, FeedItem } from './feed'
import { FeedParser } from './parsers/feed-parser'
import { FeedRenderer } from './renderers/feed-renderer'

export class Converter {
  constructor(private updateFeed: (feed: Feed) => Feed = identity) {}

  private updateItems = (update: (items: FeedItem[]) => FeedItem[]): Converter => {
    return new Converter(
      (prevFeed: Feed) => {
        const feed = this.updateFeed(prevFeed)
        return {
          ...feed,
          items: update(feed.items),
        }
      },
    )
  }

  reverseItems = () => {
    return this.updateItems(items => items.slice().reverse())
  }

  sortByDate = () => {
    return this.updateItems(items => sortBy(item => new Date(item.date).getTime(), items))
  }

  limitItems = (limit: number) => {
    return this.updateItems(items => items.slice(0, limit))
  }

  getFeed = (parser: FeedParser, fileContent: string): Feed => {
    return this.updateFeed(parser.parse(fileContent))
  }

  convert = (parser: FeedParser, render: FeedRenderer, fileContent: string) => {
    const feed = this.updateFeed(parser.parse(fileContent))
    return render.render(feed)
  }
}

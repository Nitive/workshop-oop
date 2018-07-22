import { stringifyXml } from '../../utils/xml'
import { Feed } from '../feed'
import { FeedRenderer } from './feed-renderer'
import { $t } from './helpers'

export class RssFeedRenderer implements FeedRenderer {
  render(feed: Feed): string {
    const { author } = feed

    return stringifyXml({
      rss: {
        version: '2.0',
        'xmlns:atom': 'http://www.w3.org/2005/Atom',
        channel: {
          title: $t(feed.title),
          description: $t(feed.description),
          link: $t(feed.link),
          webMaster: author && author.email && $t(author.email) ,
          item: feed.items.map(item => ({
            title: $t(item.title),
            link: $t(item.link),
            description: $t(item.description),
            pubDate: $t(item.date),
          })),
        },
      },
    })
  }
}

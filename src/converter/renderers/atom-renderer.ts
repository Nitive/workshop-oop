import { stringifyXml } from '../../utils/xml'
import { Feed } from '../feed'
import { FeedRenderer } from './feed-renderer'
import { $t } from './helpers'

export class AtomFeedRenderer implements FeedRenderer {
  render(feed: Feed) {
    const { author } = feed

    return stringifyXml({
      feed: {
        xmlns: 'http://www.w3.org/2005/Atom',
        title: $t(feed.title),
        subtitle: $t(feed.description),
        link: { href: feed.link },
        author: {
          name: author && author.name && $t(author.name),
          email: author && author.email && $t(author.email),
        },
        entry: feed.items.map(item => ({
          title: $t(item.title),
          link: { href: item.link },
          summary: $t(item.description),
          updated: $t(item.date),
        })),
      },
    })
  }
}

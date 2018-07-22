import { parseXml } from '../../utils/xml'
import { FeedParser } from './feed-parser'

export class AtomFeedParser implements FeedParser {
  parse(fileContent: string) {
    const json = parseXml(fileContent)
    const { feed: f } = json// ?
    const items: any[] = [].concat(f.entry)

    return {
      title: f.title,
      description: f.subtitle,
      link: f.link.href,
      author: {
        name: f.author.name,
        email: f.author.email,
      },
      items: items.map(item => ({
        title: item.title,
        link: item.link.href,
        description: item.summary,
        date: item.updated,
      })),
    }
  }
}

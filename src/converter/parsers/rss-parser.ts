import { parseXml } from '../../utils/xml'
import { FeedParser } from './feed-parser'

export class RssFeedParser implements FeedParser {
  parse(fileContent: string) {
    const json = parseXml(fileContent)
    const { rss } = json
    const items: any[] = [].concat(rss.channel.item)

    return {
      title: rss.channel.title,
      description: rss.channel.description,
      link: rss.channel.link,
      author: {
        email: rss.channel.webMaster,
      },
      items: items.map(item => ({
        title: item.title,
        link: item.link,
        description: item.description,
        date: item.pubDate,
      })),
    }
  }
}

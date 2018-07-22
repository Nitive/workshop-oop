import * as xml2json from 'xml2json'
import { sortBy } from 'ramda'

function removeXmlDeclaration(fileContent: string) {
  return fileContent.replace(/<\?xml.*>/, '')
}

function addXmlDeclaration(fileContent: string) {
  return '<?xml version="1.0" encoding="utf-8"?>\n' + fileContent
}

interface FeedItem {
  title: string,
  link: string,
  description: string,
  date: string,
}

interface Feed {
  title: string,
  description: string,
  link: string,
  author?: {
    name?: string,
    email?: string,
  },
  items: FeedItem[],
}

function parseXml(fileContent: string): any {
  return xml2json.toJson(
    removeXmlDeclaration(fileContent),
    { object: true },
  )
}

export interface FeedParser {
  parse(fileContent: string): Feed,
}

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

export interface FeedRenderer {
  renderer(feed: Feed): string,
}

function $t<C>(content: C): { $t: C } {
  return { $t: content }
}

export class RssFeedRenderer implements FeedRenderer {
  renderer(feed: Feed): string {
    const { author } = feed

    return addXmlDeclaration(
      xml2json.toXml({
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
      }),
    )
  }
}

export class AtomFeedRenderer implements FeedRenderer {
  renderer(feed: Feed) {
    const { author } = feed

    return addXmlDeclaration(
      xml2json.toXml({
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
      }),
    )
  }
}

export class Converter {
  constructor(private feed: Feed) {}

  static parse(parser: FeedParser, fileContent: string) {
    return new Converter(parser.parse(fileContent))
  }

  reverseItems = () => {
    const feed = {
      ...this.feed,
      items: this.feed.items.slice().reverse(),
    }

    return new Converter(feed)
  }

  sortByDate = () => {
    const feed = {
      ...this.feed,
      items: sortBy(item => new Date(item.date).getTime(), this.feed.items),
    }

    return new Converter(feed)
  }

  limitItems = (limit: number) => {
    const feed = {
      ...this.feed,
      items: this.feed.items.slice(0, limit),
    }

    return new Converter(feed)
  }

  getFeed = () => {
    return this.feed
  }

  render = (converter: FeedRenderer) => {
    return converter.renderer(this.feed)
  }
}

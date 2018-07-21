import * as xml2json from 'xml2json'

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

function $t<C>(content: C): { $t: C } {
  return { $t: content }
}

export class Converter {
  static createFromAtom(fileContent: string) {
    const json = parseXml(fileContent)
    const { feed: f } = json// ?
    const items: any[] = [].concat(f.entry)

    const feed: Feed = {
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

    return new Converter(feed)
  }

  static createFromRSS(fileContent: string) {
    const json = parseXml(fileContent)
    const { rss } = json
    const items: any[] = [].concat(rss.channel.item)

    const feed: Feed = {
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

    return new Converter(feed)
  }

  constructor(private feed: Feed) {}

  convertToRSS = () => {
    const { feed } = this
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

  convertToAtom = () => {
    const { feed } = this
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

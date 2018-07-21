import 'jest-xml-matcher'
import { Converter } from '../converter'

const rssSource = `
  <?xml version="1.0" encoding="utf-8"?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>Новые уроки на Хекслете</title>
      <description>Практические уроки по программированию</description>
      <link>https://ru.hexlet.io/</link>
      <webMaster>info@hexlet.io</webMaster>
      <item>
        <title>Pipeline challenge / Главные испытания</title>
        <link>https://ru.hexlet.io/courses/main/lessons/pipeline/theory_unit</link>
        <description>Цель: Написать клиент, реализующий передачу сообщений в условиях канала передачи с помехами.</description>
        <pubDate>Wed, 21 Jan 2015 08:59:51 +0000</pubDate>
      </item>
      <item>
        <title>Pipeline challenge / Главные испытания</title>
        <link>https://ru.hexlet.io/courses/main/lessons/pipeline/theory_unit</link>
        <description>Цель: Написать клиент, реализующий передачу сообщений в условиях канала передачи с помехами.</description>
        <pubDate>Wed, 21 Jan 2015 08:59:51 +0000</pubDate>
      </item>
    </channel>
  </rss>
`

const atomSource = `
  <?xml version="1.0" encoding="utf-8"?>
  <feed xmlns="http://www.w3.org/2005/Atom">
    <title>Новые уроки на Хекслете</title>
    <subtitle>Практические уроки по программированию</subtitle>
    <link href="https://ru.hexlet.io/"></link>
    <author>
      <email>info@hexlet.io</email>
    </author>
    <entry>
      <title>Pipeline challenge / Главные испытания</title>
      <link href="https://ru.hexlet.io/courses/main/lessons/pipeline/theory_unit"></link>
      <summary>Цель: Написать клиент, реализующий передачу сообщений в условиях канала передачи с помехами.</summary>
      <updated>Wed, 21 Jan 2015 08:59:51 +0000</updated>
    </entry>
    <entry>
      <title>Pipeline challenge / Главные испытания</title>
      <link href="https://ru.hexlet.io/courses/main/lessons/pipeline/theory_unit"></link>
      <summary>Цель: Написать клиент, реализующий передачу сообщений в условиях канала передачи с помехами.</summary>
      <updated>Wed, 21 Jan 2015 08:59:51 +0000</updated>
    </entry>
  </feed>
`

describe('Converter', () => {
  it('should convert RSS to RSS', () => {
    const converter = Converter.createFromRSS(rssSource)

    expect(converter.convertToRSS()).toEqualXML(rssSource)
  })

  it('should convert RSS to Atom', () => {
    const converter = Converter.createFromRSS(rssSource)

    expect(converter.convertToAtom()).toEqualXML(atomSource)
  })

  it('should convert Atom to Atom', () => {
    const converter = Converter.createFromAtom(atomSource)

    expect(converter.convertToAtom()).toEqualXML(atomSource)
  })

  it('should convert Atom to RSS', () => {
    const converter = Converter.createFromAtom(atomSource)

    expect(converter.convertToRSS()).toEqualXML(rssSource)
  })
})

import 'jest-xml-matcher'
import { AtomFeedParser, AtomFeedRenderer, Converter, Feed, RssFeedParser, RssFeedRenderer } from '../converter'

const rssSource = `
  <?xml version="1.0" encoding="utf-8"?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>Новые уроки на Хекслете</title>
      <description>Практические уроки по программированию</description>
      <link>https://ru.hexlet.io/</link>
      <webMaster>info@hexlet.io</webMaster>
      <item>
        <title>Rails для начинающих / Фреймворки</title>
        <link>https://ru.hexlet.io/courses/frameworks/lessons/rails_getting_started/theory_unit</link>
        <description>Цель: Научиться работать с фреймворком Rails</description>
        <pubDate>Wed, 25 Mar 2015 12:05:14 +0000</pubDate>
      </item>
      <item>
        <title>Ареалы проживания членистоногих. Конкурс по функциональному программированию 03.2015. / Главные испытания</title>
        <link>https://ru.hexlet.io/courses/main/lessons/functional-contest-03-2015/theory_unit</link>
        <description>Цель: Получить сатисфакцию</description>
        <pubDate>Thu, 05 Mar 2015 14:56:47 +0000</pubDate>
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
      <title>Rails для начинающих / Фреймворки</title>
      <link href="https://ru.hexlet.io/courses/frameworks/lessons/rails_getting_started/theory_unit"></link>
      <summary>Цель: Научиться работать с фреймворком Rails</summary>
      <updated>Wed, 25 Mar 2015 12:05:14 +0000</updated>
    </entry>
    <entry>
      <title>Ареалы проживания членистоногих. Конкурс по функциональному программированию 03.2015. / Главные испытания</title>
      <link href="https://ru.hexlet.io/courses/main/lessons/functional-contest-03-2015/theory_unit"></link>
      <summary>Цель: Получить сатисфакцию</summary>
      <updated>Thu, 05 Mar 2015 14:56:47 +0000</updated>
    </entry>
  </feed>
`

const getTitles = (feed: Feed) => feed.items.map(item => item.title)
const firstItemTitle = 'Rails для начинающих / Фреймворки'
const secondItemTitle = 'Ареалы проживания членистоногих. Конкурс по функциональному программированию 03.2015. / Главные испытания'
const rssParser = new RssFeedParser()
const atomParser = new AtomFeedParser()
const rssRenderer = new RssFeedRenderer()
const atomRenderer = new AtomFeedRenderer()

describe('Converter', () => {
  it('should convert RSS to RSS', () => {
    const converter = new Converter()
    expect(converter.convert(rssParser, rssRenderer, rssSource)).toEqualXML(rssSource)
  })

  it('should convert RSS to Atom', () => {
    const converter = new Converter()
    expect(converter.convert(rssParser, atomRenderer, rssSource)).toEqualXML(atomSource)
  })

  it('should convert Atom to Atom', () => {
    const converter = new Converter()
    expect(converter.convert(atomParser, atomRenderer, atomSource)).toEqualXML(atomSource)
  })

  it('should convert Atom to RSS', () => {
    const converter = new Converter()
    expect(converter.convert(atomParser, rssRenderer, atomSource)).toEqualXML(rssSource)
  })

  it('should reverse items', () => {
    const converter = new Converter()
    expect(getTitles(converter.getFeed(rssParser, rssSource))).toEqual([firstItemTitle, secondItemTitle])
    expect(getTitles(converter.reverseItems().getFeed(rssParser, rssSource))).toEqual([secondItemTitle, firstItemTitle])
  })

  it('reverse should be immutable', () => {
    const converter = new Converter()
    const converterWithReversedItems = converter.reverseItems()

    expect(getTitles(converter.getFeed(atomParser, atomSource))).toEqual([firstItemTitle, secondItemTitle])
    expect(getTitles(converterWithReversedItems.getFeed(atomParser, atomSource)))
      .toEqual([secondItemTitle, firstItemTitle])
  })

  it('reverse(reverse(x)) should be equal x', () => {
    const converter = new Converter()
    expect(converter.getFeed(atomParser, atomSource))
      .toEqual(converter.reverseItems().reverseItems().getFeed(atomParser, atomSource))
  })

  it('should sort by date', () => {
    const converter = new Converter()
    const Mar25 = firstItemTitle
    const Mar5 = secondItemTitle

    expect(getTitles(converter.sortByDate().getFeed(atomParser, atomSource))).toEqual([Mar5, Mar25])
  })

  it('sort(x) and reverse(sort(x)) should be equal', () => {
    const converter = new Converter()
    expect(converter.sortByDate().getFeed(atomParser, atomSource))
      .toEqual(converter.reverseItems().sortByDate().getFeed(atomParser, atomSource))
  })

  it('should limit items', () => {
    const converter = new Converter()
    expect(converter.limitItems(1).getFeed(atomParser, atomSource).items).toHaveLength(1)
    expect(converter.limitItems(2).getFeed(atomParser, atomSource).items).toHaveLength(2)
  })
})

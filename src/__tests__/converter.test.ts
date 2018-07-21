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

const getFeedTitles = (converter: Converter) => converter.getFeed().items.map(item => item.title)
const firstItemTitle = 'Rails для начинающих / Фреймворки'
const secondItemTitle = 'Ареалы проживания членистоногих. Конкурс по функциональному программированию 03.2015. / Главные испытания'

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

  it('should reverse items', () => {
    const converter = Converter.createFromAtom(atomSource)
    expect(getFeedTitles(converter)).toEqual([firstItemTitle, secondItemTitle])
    expect(getFeedTitles(converter.reverseItems())).toEqual([secondItemTitle, firstItemTitle])
  })

  it('reverse should be immutable', () => {
    const converter = Converter.createFromAtom(atomSource)
    const converterWithReversedItems = converter.reverseItems()

    expect(getFeedTitles(converter)).toEqual([firstItemTitle, secondItemTitle])
    expect(getFeedTitles(converterWithReversedItems)).toEqual([secondItemTitle, firstItemTitle])
  })

  it('reverse(reverse(x)) should revert result', () => {
    const converter = Converter.createFromAtom(atomSource)
    expect(getFeedTitles(converter)).toEqual(getFeedTitles(converter.reverseItems().reverseItems()))
  })

  it('should sort by date', () => {
    const converter = Converter.createFromAtom(atomSource)
    const Mar25 = firstItemTitle
    const Mar5 = secondItemTitle

    expect(getFeedTitles(converter.sortByDate())).toEqual([Mar5, Mar25])
  })

  it('sort(x) and reverse(sort(x)) should be equal', () => {
    const converter = Converter.createFromAtom(atomSource)
    expect(converter.sortByDate().getFeed()).toEqual(converter.reverseItems().sortByDate().getFeed())
  })

  it('should limit items', () => {
    const converter = Converter.createFromAtom(atomSource)
    expect(converter.limitItems(1).getFeed().items).toHaveLength(1)
    expect(converter.limitItems(2).getFeed().items).toHaveLength(2)
  })
})

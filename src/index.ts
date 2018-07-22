import axios from 'axios'
import { promises as fs } from 'fs'
import { last } from 'ramda'
import { ArgsParser } from './args-parser'
import { Converter, RssFeedParser, AtomFeedParser, AtomFeedRenderer, RssFeedRenderer } from './converter'
import { FileReader } from './readers/file-reader'
import { NetworkReader } from './readers/network-reader'
import { ResourceReader } from './readers/resource-reader'
import { isURL } from './utils'

interface AppOptions {
  out: 'rss' | 'atom',
  reverse?: boolean,
  sort?: 'date',
  limit?: number,
}

const argsSchema = {
  out: {
    shortcut: 'o',
    type: 'string' as 'string',
    help: 'Out file format: rss or atom',
  },
  reverse: {
    shortcut: 'r',
    type: 'boolean' as 'boolean',
    help: 'Reverse items',
  },
  sort: {
    shortcut: 's',
    type: 'string' as 'string',
    help: 'Sort. Currently only sort by date is supported',
  },
  limit: {
    shortcut: 'l',
    type: 'number' as 'number',
    help: 'Limit items',
  },
}

function writeToStdout(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    process.stdout.write(text, (err: Error) => {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  })
}

function applyOptionsToConverter(converter: Converter, options: AppOptions): Converter {
  if (options.sort && options.sort === 'date') {
    const { sort, ...restOptions } = options
    return applyOptionsToConverter(converter.sortByDate(), restOptions)
  }

  if (options.reverse) {
    const { reverse, ...restOptions } = options
    return applyOptionsToConverter(converter.reverseItems(), restOptions)
  }

  if (options.limit) {
    const { limit, ...restOptions } = options
    return applyOptionsToConverter(converter.limitItems(limit), restOptions)
  }

  return converter
}

async function run() {
  const argsParser = new ArgsParser<AppOptions>(argsSchema)

  const appOptions = argsParser.parse(process.argv)

  const targetReader: ResourceReader = isURL(appOptions.target)
    ? new NetworkReader(axios)
    : new FileReader(fs)

  const fileContent = await targetReader.read(appOptions.target)
  const fileExt = last(appOptions.target.split('.'))!
  if (fileExt !== 'rss' && fileExt !== 'atom') {
    throw new Error('Unexpected file extension')
  }

  const FeedParser = {
    rss: RssFeedParser,
    atom: AtomFeedParser,
  }[fileExt]

  const converter = Converter.parse(new FeedParser(), fileContent)

  const { render } = applyOptionsToConverter(converter, appOptions.options)
  const Renderer = { atom: AtomFeedRenderer, rss: RssFeedRenderer }[appOptions.options.out]

  const result = render(new Renderer())

  await writeToStdout(result)
}


run()
  .catch(console.error)

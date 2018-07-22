
import { last } from 'ramda'
import { ArgsParser } from './args-parser'
import { AtomFeedParser, AtomFeedRenderer, Converter, RssFeedParser, RssFeedRenderer } from './converter'
import { Out } from './out/out'
import { FileReader, FileSystem } from './readers/file-reader'
import { NetworkLayer, NetworkReader } from './readers/network-reader'
import { ResourceReader } from './readers/resource-reader'
import { isURL } from './utils/is-url'

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

function getFileExtension(fileLocation: string) {
  return last(fileLocation.split('.'))!
}

type RunResult
  = { status: 'ok' }
  | { status: 'error', error: string }

export class App {
  constructor(private sources: { fs: FileSystem, network: NetworkLayer, out: Out }) {}
  async run(args: string[]): Promise<RunResult> {
    const argsParser = new ArgsParser<AppOptions>(argsSchema)
    const appOptions = argsParser.parse(args)

    const targetReader: ResourceReader = isURL(appOptions.target)
      ? new NetworkReader(this.sources.network)
      : new FileReader(this.sources.fs)

    let fileContent
    try {
      fileContent = await targetReader.read(appOptions.target)
    } catch (error) {
      return { status: 'error', error }
    }

    const fileExt = getFileExtension(appOptions.target)
    if (fileExt !== 'rss' && fileExt !== 'atom') {
      return { status: 'error', error: 'Unexpected file extension. Only .rss and .atom extensions are allowed' }
    }

    const converter = new Converter()
    const { convert } = applyOptionsToConverter(converter, appOptions.options)

    const FeedParser = { rss: RssFeedParser, atom: AtomFeedParser }[fileExt]
    const FeedRenderer = { atom: AtomFeedRenderer, rss: RssFeedRenderer }[appOptions.options.out]

    const result = convert(new FeedParser(), new FeedRenderer(), fileContent)

    try {
      await this.sources.out.write(result)
    } catch {
      return { status: 'error', error: 'Can not write to out channel' }
    }

    return {
      status: 'ok',
    }
  }
}

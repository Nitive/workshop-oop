import axios from 'axios'
import { promises as fs } from 'fs'
import { ArgsParser } from './args-parser'
import { FileReader } from './readers/file-reader'
import { NetworkReader } from './readers/network-reader'
import { ResourceReader } from './readers/resource-reader'
import { isURL } from './utils'
import { Converter } from './converter'

interface AppOptions {
  out: 'rss' | 'atom',
}

const argsSchema = {
  out: {
    shortcut: 'o',
    type: 'string' as 'string',
    help: 'Out file format: rss or atom',
  },
}

async function run() {
  const argsParser = new ArgsParser<AppOptions>(argsSchema)

  const appOptions = argsParser.parse(process.argv)

  const targetReader: ResourceReader = isURL(appOptions.target)
    ? new NetworkReader(axios)
    : new FileReader(fs)

  const fileContent = await targetReader.read(appOptions.target)
  const converter = Converter.createFromRSS(fileContent)
  const convert = { atom: converter.convertToAtom, rss: converter.convertToRSS }[appOptions.options.out]
  const result = convert()

  process.stdout.write(result)
}


run()

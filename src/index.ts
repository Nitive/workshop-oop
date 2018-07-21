import axios from 'axios'
import { promises as fs } from 'fs'
import { ArgsParser } from './args-parser'
import { FileReader } from './readers/file-reader'
import { NetworkReader } from './readers/network-reader'
import { ResourceReader } from './readers/resource-reader'
import { isURL } from './utils'

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

function run() {
  const argsParser = new ArgsParser<AppOptions>(argsSchema)

  const appOptions = argsParser.parse(process.argv)

  const targetReader: ResourceReader = isURL(appOptions.target)
    ? new NetworkReader(axios)
    : new FileReader(fs)

  targetReader.read(appOptions.target)
    .then(console.log)
}


run()

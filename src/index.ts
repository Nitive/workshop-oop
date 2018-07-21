import * as fs from 'fs'
import { startsWith } from 'ramda'
import { ArgsParser } from './args-parser'
import { FileReader } from './readers/file-reader'
import { NetworkReader } from './readers/network-reader'
import { ResourceReader } from './readers/resource-reader'
import axios from 'axios'

interface AppOptions {
  help: string,
  out: 'rss' | 'atom',
}

function isURL(resourseLocation: string): boolean {
  return startsWith('http', resourseLocation)
}

function run() {
  const argsParser = new ArgsParser<AppOptions>()

  const appOptions = argsParser.parse(process.argv)
  console.log(appOptions)

  const targetReader: ResourceReader = isURL(appOptions.target)
    ? new NetworkReader(axios)
    : new FileReader(fs)

  targetReader.read(appOptions.target)
    .then(console.log)
}


run()

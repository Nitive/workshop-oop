import axios from 'axios'
import { promises as fs } from 'fs'
import { ArgsParser } from './args-parser'
import { Converter } from './converter'
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

  await writeToStdout(result)
}


run()
  .catch(console.error)

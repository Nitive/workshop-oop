import * as path from 'path'
import { App } from '../app'
import { Out } from '../out/out'
import { NetworkLayer } from '../readers/network-reader'
import { FileSystem } from '../readers/file-reader'
import { promises as fs } from 'fs'
import * as format from 'xml-formatter'

type Read = { path: string }
function createFakeFileSystem(): { fs: FileSystem, getReads: () => Read[] } {
  const reads: Read[] = []

  const fakeFs = {
    readFile(filePath: string) {
      reads.push({ path: filePath })

      const fixturePath = path.join(__dirname, 'fixtures/files', filePath)
      return fs.readFile(fixturePath, 'utf8')
    },
  }

  return {
    fs: fakeFs,
    getReads: () => reads,
  }
}

type Request = { url: string }
function createFakeNetworkLayer(): { network: NetworkLayer, getRequests: () => Request[] } {
  const requests: Request[] = []

  const network = {
    get(url: string) {
      const fixturePath = path.join(__dirname, 'fixtures/network', url.replace(/\//g, '_'))

      return fs
        .readFile(fixturePath, 'utf8')
        .then(data => ({ data }))
        .then(response => {
          requests.push({ url })
          return response
        })
    },
  }

  return {
    network,
    getRequests: () => requests,
  }
}

function createFakeOut(): { out: Out, getWrites: () => string[] } {
  const writes: string[] = []

  const out = {
    write(text: string) {
      writes.push(text)
      return Promise.resolve()
    },
  }

  return {
    getWrites: () => writes,
    out,
  }
}

export async function runInFakeWorld(runApp: (app: App) => Promise<any>) {
  const { fs, getReads } = createFakeFileSystem()
  const { out, getWrites } = createFakeOut()
  const { network, getRequests } = createFakeNetworkLayer()
  const app = new App({ fs, network, out })

  const result = await runApp(app)
  const writes = getWrites().map(xml => format(xml)) // fixme: ad-hoc решение для удобства в конкретном случае
  const requests = getRequests()
  const reads = getReads()

  return {
    result,
    writes,
    requests,
    reads,
  }
}

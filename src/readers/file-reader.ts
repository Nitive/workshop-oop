import { ResourceReader } from './resource-reader'

export interface FileSystem {
  readFile(path: string, encoding: string, callback: (err: Error | null, data: string) => void): void
}

export class FileReader implements ResourceReader {
  constructor(private fs: FileSystem) {}

  read(path: string): Promise<string> {
    const { fs } = this

    return new Promise((resolve, reject) => {
      fs.readFile(path, 'utf-8', (err, data) => {
        if (err) {
          reject(err)
          return
        }
        resolve(data)
      })
    })
  }
}

import { ResourceReader } from './resource-reader'

export interface FileSystem {
  readFile(path: string, encoding: BufferEncoding): Promise<string>
}

export class FileReader implements ResourceReader {
  constructor(private fs: FileSystem) {}

  read(path: string): Promise<string> {
    const { fs } = this

    return fs.readFile(path, 'utf8')
      .catch(() => Promise.reject('FILE_NOT_FOUND'))
  }
}

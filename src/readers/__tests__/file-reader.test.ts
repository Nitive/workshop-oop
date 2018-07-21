import { FileSystem, FileReader } from '../file-reader'

const fakeFileSystem: FileSystem = {
  readFile(_file, _encoding, callback) {
    callback(null, 'data')
  },
}

describe('FileReader', () => {
  it('read should works', async() => {
    const fileReader = new FileReader(fakeFileSystem)
    const result = await fileReader.read('test')
    expect(result).toBe('data')
  })
})

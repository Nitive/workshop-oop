import { NetworkReader, NetworkLayer } from '../network-reader'

const fakeNetworkLayer: NetworkLayer = {
  get(_url: string) {
    return Promise.resolve({ data: 'data' })
  },
}

describe('NetworkReader', () => {
  it('read should works', async() => {
    const networkReader = new NetworkReader(fakeNetworkLayer)
    const result = await networkReader.read('test')
    expect(result).toBe('data')
  })
})

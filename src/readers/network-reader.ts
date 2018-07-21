import { ResourceReader } from './resource-reader'

export interface Response {
  data: string
}

export interface NetworkLayer {
  get(url: string): Promise<Response>
}

export class NetworkReader implements ResourceReader {
  constructor(private network: NetworkLayer) {}

  read(url: string): Promise<string> {
    return this.network
      .get(url)
      .then(res => res.data)
  }
}

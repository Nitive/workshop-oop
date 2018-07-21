export interface ResourceReader {
  read(location: string): Promise<string>
}

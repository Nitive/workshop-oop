import { Out } from './out'

export class Stdout implements Out {
  write(text: string) {
    return new Promise<void>((resolve, reject) => {
      process.stdout.write(text, (err: Error) => {
        if (err) {
          reject(err)
          return
        }
        resolve()
      })
    })
  }
}

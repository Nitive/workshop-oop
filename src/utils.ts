import * as fs from 'fs'
import { URL } from 'url'

export function isURL(resourseLocation: string): boolean {
  try {
    // tslint:disable-next-line:no-unused-expression
    new URL(resourseLocation)

    if (fs.existsSync(resourseLocation)) {
      return false
    }

    return true
  } catch {
    return false
  }
}

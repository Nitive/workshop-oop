import { startsWith } from 'ramda'

export function isURL(resourseLocation: string): boolean {
  return startsWith('http', resourseLocation)
}

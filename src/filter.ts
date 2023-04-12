import type {DiffEntry} from './types'

export function filterFiles(
  filters: string[],
  exclusions: string[],
  files: DiffEntry[]
): DiffEntry[] {
  if (filters.length === 0 && exclusions.length === 0) {
    return files
  }
  const testRexExp = (regex: string, filename: string): boolean => {
    if (regex.startsWith('/') && regex.endsWith('/')) {
      return new RegExp(regex.slice(1, -1)).test(filename)
    }
    return new RegExp(regex).test(filename)
  }
  if (filters.length !== 0) {
    files = files.filter(file => {
      return filters.some(filter => testRexExp(filter, file.filename))
    })
  }
  if (exclusions.length !== 0) {
    files = files.filter(file => {
      return !exclusions.some(exclusion => testRexExp(exclusion, file.filename))
    })
  }
  return files
}

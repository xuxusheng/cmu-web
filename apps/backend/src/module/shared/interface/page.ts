export interface Page<T> {
  pn: number
  ps: number
  total: number
  items: T[]
}

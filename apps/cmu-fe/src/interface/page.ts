export interface Page {
  // 当前第几页
  pn: number
  // 每页多少条
  ps: number
  // 总共多少条
  total: number
}

export type DWithPage<T extends object = Record<string, unknown>> = Page & {
  items: T[]
}

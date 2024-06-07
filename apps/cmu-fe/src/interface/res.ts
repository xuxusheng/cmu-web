interface Meta {
  errCode: number
  errMsg: string
  errDebug: string
  errDetails: string[]
}

export interface Res<T extends object = Record<string, unknown>> extends Meta {
  data: T
}

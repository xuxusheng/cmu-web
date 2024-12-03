import { AxiosResponse } from 'axios'

import { DWithPage } from './page.ts'

interface Meta {
  errCode: number
  errMsg: string
  errDebug: string
  errDetails: string[]
}

export interface Res<T extends unknown = Record<string, unknown>> extends Meta {
  data: T
}

// 自动中后端定义的类中的某个方法返回的 Promise 或非 Promise 中提取出类型
export type ResFromController<T extends (...args: any[]) => any> = Res<
  Awaited<ReturnType<T>>
>

// 自动从接口返回中提取 data 类型
export type ExtractFromRes<
  T extends (...args: any[]) => Promise<AxiosResponse<Res<unknown>>>
> = T extends (...args: any[]) => Promise<AxiosResponse<Res<infer R>>>
  ? R extends Array<infer P>
    ? P
    : R extends DWithPage<infer S>
      ? S
      : never
  : never

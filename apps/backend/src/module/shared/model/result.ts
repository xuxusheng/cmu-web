export class Result<T extends object = Record<string, unknown>> {
  errCode: number
  errMsg: string
  errDebug: string
  errDetails: string[]

  data: T

  constructor(
    errCode: number,
    errMsg: string,
    errDetails: string[] = [],
    errDebug: string = '',
    data?: T
  ) {
    this.errCode = errCode
    this.errMsg = errMsg
    this.errDebug = errDebug
    this.errDetails = errDetails
    this.data = data || ({} as T)
  }

  static ok<T extends object = Record<string, unknown>>(data?: T): Result<T> {
    return new Result<T>(0, '', [], '', data)
  }

  static fail<T extends object = Record<string, unknown>>(
    errCode: number,
    errMsg: string,
    errDetails: string[] = [],
    errDebug: string = ''
  ): Result<T> {
    return new Result<T>(errCode, errMsg, errDetails, errDebug, {} as T)
  }
}

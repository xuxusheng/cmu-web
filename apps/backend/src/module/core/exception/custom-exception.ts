import { HttpStatus } from '@nestjs/common'

import { ErrCode } from './error-code'

export class BaseException {
  // 业务错误码
  private readonly errCode: number

  // HTTP 状态码
  private readonly httpStatus: number

  // 错误信息
  private errMsg: string

  // 错误详细信息
  private errDetails: string[]

  // 错误调试信息，生产环境打印到日志中，但是不随接口返回
  private errDebug: string

  constructor(
    errCode: number,
    errMsg: string,
    httpStatus = HttpStatus.INTERNAL_SERVER_ERROR
  ) {
    this.errCode = errCode
    this.errMsg = errMsg
    this.httpStatus = httpStatus
  }

  getHttpStatus() {
    return this.httpStatus
  }

  getErrCode() {
    return this.errCode
  }

  getErrMsg() {
    return this.errMsg
  }

  getErrDetails() {
    return this.errDetails
  }

  getErrDebug() {
    return this.errDebug
  }

  setErrMsg(errMsg: string) {
    this.errMsg = errMsg
    return this
  }

  setErrDetails(errDetails: string[]) {
    this.errDetails = errDetails
    return this
  }

  setErrDebug(errDebug: string) {
    this.errDebug = errDebug
    return this
  }
}

export class BadRequestException extends BaseException {
  constructor(errMsg = '输入参数错误，请检查后重试') {
    super(ErrCode.BadRequest, errMsg, HttpStatus.BAD_REQUEST)
  }
}

export class UnauthorizedException extends BaseException {
  constructor(errMsg = '身份认证失败') {
    super(ErrCode.Unauthorized, errMsg, HttpStatus.UNAUTHORIZED)
  }
}

export class ForbiddenException extends BaseException {
  constructor(errMsg = '禁止访问') {
    super(ErrCode.Forbidden, errMsg, HttpStatus.FORBIDDEN)
  }
}

export class NotFoundException extends BaseException {
  constructor(errMsg = '资源不存在') {
    super(ErrCode.NotFound, errMsg, HttpStatus.NOT_FOUND)
  }
}

export class TooManyRequestException extends BaseException {
  constructor(errMsg = '请求过于频繁，请稍后重试') {
    super(ErrCode.TooManyRequest, errMsg, HttpStatus.TOO_MANY_REQUESTS)
  }
}

export class InternalServerErrorException extends BaseException {
  constructor(errMsg = '服务器内部错误') {
    super(ErrCode.InternalServerError, errMsg, HttpStatus.INTERNAL_SERVER_ERROR)
  }
}

export class ServiceUnavailableException extends BaseException {
  constructor(errMsg = '服务不可用') {
    super(ErrCode.ServiceUnavailable, errMsg, HttpStatus.SERVICE_UNAVAILABLE)
  }
}

// Token 相关错误
export class TokenEmptyException extends BaseException {
  constructor(errMsg = '认证失败，token 不存在') {
    super(ErrCode.TokenEmpty, errMsg, HttpStatus.UNAUTHORIZED)
  }
}

export class TokenExpiredException extends BaseException {
  constructor(errMsg = '认证失败，token 已过期') {
    super(ErrCode.TokenExpired, errMsg, HttpStatus.UNAUTHORIZED)
  }
}

export class TokenInvalidException extends BaseException {
  constructor(errMsg = '认证失败，token 无效') {
    super(ErrCode.TokenInvalid, errMsg, HttpStatus.UNAUTHORIZED)
  }
}

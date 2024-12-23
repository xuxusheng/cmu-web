import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
  NotFoundException
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import ansiRegex from 'ansi-regex'
import { Request, Response } from 'express'

import { Result } from '../../shared/model/result'
import {
  BaseException,
  BadRequestException as CustomBadRequestException,
  InternalServerErrorException as CustomInternalServerErrorException,
  NotFoundException as CustomNotFoundException
} from './custom-exception'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: Error | BaseException, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost

    const ctx = host.switchToHttp()
    const req = ctx.getRequest<Request>()
    const res = ctx.getResponse<Response>()

    let err: BaseException

    switch (true) {
      case exception instanceof HttpException: {
        // 抛出的错误为框架定义的 Exception
        err = transformException(exception as HttpException)
        break
      }
      case exception instanceof BaseException: {
        // 抛出的错误为自定义 Exception
        err = exception as BaseException
        break
      }
      case exception instanceof Error: {
        console.trace(exception)
        // 报错的错误为 Error 类型，主要针对没有被人为捕获的错误，例如数据库查询报错了，第三方接口调用报错了却没有 try catch 处理。
        // 如果有 errDebug 字段的话，这里最好是将内部错误放入 errDebug 字段，不直接暴露给用户（只存在于非生产环境及日志中）
        // 控制台输出的颜色去掉，换行符替换为空格
        const debugMsg = (exception as Error).message
          .replace(ansiRegex(), '')
          .replace(/\n/g, ' ')
        err = new CustomInternalServerErrorException().setErrDebug(debugMsg)
        break
      }
      case typeof exception === 'string': {
        this.logger.error(`不建议直接 throw 字符串，请修改代码：${exception}`)
        err = new CustomInternalServerErrorException().setErrDebug(
          exception as unknown as string
        )
        break
      }
      default: {
        // 抛出的错误类型有误
        this.logger.error(`抛出错误类型有误，请修改代码：${exception}`)
        err = new CustomInternalServerErrorException().setErrDebug(
          '程序抛出的错误类型有误，请联系管理员'
        )
      }
    }

    const data = Result.fail(
      err.getErrCode(),
      err.getErrMsg(),
      err.getErrDetails(),
      err.getErrDebug()
    )

    this.logger // 请求错误时的日志
      .error(
        JSON.stringify({
          reqId: req.header('x-request-id'),
          url: req.originalUrl,
          req: req.body,
          res: data
        })
      )

    httpAdapter.reply(ctx.getResponse(), data, err.getHttpStatus())
  }
}

// 将框架定义的 Exception 转化为自定义的 Exception
function transformException(exception: HttpException) {
  if (exception instanceof BadRequestException) {
    // 这时错误一般是由框架自带的 Validation 插件抛出，例如 ParseIntPipe 在参数校验出错时抛出的错误，建议后期全部改为自定义的 pipe，直接抛出自定义错误
    return new CustomBadRequestException().setErrMsg(
      `输入参数错误：${exception.message}`
    )
  }

  if (exception instanceof NotFoundException) {
    // 路由未匹配到时，框架会自动抛出这个错误
    return new CustomNotFoundException().setErrMsg(exception.message)
  }

  // 其他错误，需要特殊处理的枚举出来特殊处理，不需特殊处理的，一律按 500 处理
  return new CustomInternalServerErrorException().setErrMsg(exception.message)
}

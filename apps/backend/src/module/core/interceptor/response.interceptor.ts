import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor
} from '@nestjs/common'
import { Request } from 'express'
import { Observable, map, tap } from 'rxjs'

import { HealthController } from '../../health/health.controller'
import { Result } from '../../shared/model/result'

@Injectable()
export class ResponseInterceptor<T extends object = Record<string, unknown>>
  implements NestInterceptor<T, Result<T>>
{
  private readonly logger = new Logger(ResponseInterceptor.name)

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<Result<T>> {
    // 健康检查模块，无需处理
    if (ctx.getClass() === HealthController) {
      return next.handle()
    }

    const req = ctx.switchToHttp().getRequest<Request>()
    return next.handle().pipe(
      map((data) => {
        if (data instanceof Result) {
          return data
        }

        return Result.ok(data)
      }),
      // 访问日志使用 Middleware 打印，接口返回默认不打印日志，可以考虑非生产环境模式打印 debug 日志
      tap((data) => {
        this.logger.debug(
          JSON.stringify({
            reqId: req.header('x-request-id'),
            url: req.originalUrl
            // res: data
          })
        )
      })
    )
  }
}

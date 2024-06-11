import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

/**
 * 访问日志中间件
 */
@Injectable()
export class AccessLogMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AccessLogMiddleware.name)

  use(req: Request, res: Response, next: NextFunction) {
    const data = {
      reqId: req.header('x-request-id'),
      url: req.originalUrl,
      body: req.body
    }

    this.logger.log(JSON.stringify(data))

    next()
  }
}

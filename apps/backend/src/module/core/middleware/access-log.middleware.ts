import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

import { getBaseLog } from '../../shared/utils/log'

/**
 * 访问日志中间件
 */
@Injectable()
export class AccessLogMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AccessLogMiddleware.name)

  use(req: Request, res: Response, next: NextFunction) {
    const data = {
      message: '请求开始',
      ...getBaseLog(req)
    }

    this.logger.log(JSON.stringify(data))

    next()
  }
}

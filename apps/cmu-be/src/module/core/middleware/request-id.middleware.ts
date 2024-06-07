import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { nanoid } from 'nanoid'

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let uid = req.header('x-request-id')
    if (!uid) {
      // 设置请求头
      req.headers['x-request-id'] = uid = nanoid()
    }
    // 设置响应头
    res.setHeader('x-request-id', uid)
    next()
  }
}

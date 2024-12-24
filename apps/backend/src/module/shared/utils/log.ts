import { Request } from 'express'
import * as os from 'node:os'

// 从 Request 对象从提取需要打印的日志的基础信息
export const getBaseLog = (req: Request) => ({
  appVersion: process.env.APP_VERSION,
  reqId: req.header('x-request-id'),
  url: req.originalUrl,
  method: req.method,
  remoteIp: req.ip,
  remoteAddress: req.socket.remoteAddress,
  remoteHostname: req.hostname,
  serverAddress: req.socket.localAddress,
  serverHostname: os.hostname(),
  serverPort: req.socket.localPort,
  serverPid: process.pid,
  reqBody: req.body
})

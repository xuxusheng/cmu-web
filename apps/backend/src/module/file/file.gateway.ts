import { Inject, Logger } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway
} from '@nestjs/websockets'
import { spawn } from 'child_process'
import { join } from 'path'
import { Socket } from 'socket.io'

import { gMmsConfig } from '../core/config/g-mms.config'
import { LogFileService } from './service/log-file.service'

@WebSocketGateway({
  path: '/socket.io',
  cors: {
    origin: '*'
  }
})
export class FileGateway {
  private readonly logger = new Logger(FileGateway.name)

  constructor(
    @Inject(gMmsConfig.KEY)
    private gMmsConf: ConfigType<typeof gMmsConfig>,
    private logFileService: LogFileService
  ) {}

  // 监听日志文件
  @SubscribeMessage('tail-log')
  tailLog(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      n: number
    }
  ) {
    const { n = 100 } = data

    const { logDir, logFileName } = this.logFileService.getLogDirAndFileName()
    const path = join(logDir, logFileName)

    const tail = spawn('tail', ['-n', n.toString(), '-f', path])

    tail.stdout.on('data', (data) => {
      console.log('tail-log data: ', data)
      client.emit('tail-log', data.toString())
    })

    tail.stderr.on('data', (err) => {
      // tail 命令执行出错
      this.logger.error('tail-log error: ', err.toString())
      client.emit('tail-log-error', err.toString())
    })

    client.on('disconnect', () => {
      tail.kill()
    })
  }

  @SubscribeMessage('tail-i2-log')
  tailI2Log(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      n: number
    }
  ) {
    const { n = 100 } = data

    const path = this.gMmsConf.gI2LogFilename

    const tail = spawn('tail', ['-n', n.toString(), '-f', path])

    tail.stdout.on('data', (data) => {
      console.log('tail-i2-log data: ', data)
      client.emit('tail-i2-log', data.toString())
    })

    tail.stderr.on('data', (err) => {
      // tail 命令执行出错
      this.logger.error('tail-i2-log error: ', err.toString())
      client.emit('tail-i2-log-error', err.toString())
    })

    client.on('disconnect', () => {
      tail.kill()
    })
  }
}

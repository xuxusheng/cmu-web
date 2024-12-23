import { NestFactory } from '@nestjs/core'
import axios from 'axios'
import { WinstonModule } from 'nest-winston'
import * as winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

import { AppModule } from './app.module'

axios.defaults.validateStatus = () => true

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // Log 模块，参考文档：https://github.com/gremo/nest-winston
    logger: WinstonModule.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        // info、warn、error 日志集合
        new DailyRotateFile({
          level: 'info',
          dirname: 'logs',
          filename: 'app-%DATE%.log',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d'
        }),
        // 错误日志
        new DailyRotateFile({
          level: 'error',
          dirname: 'logs',
          filename: 'error-%DATE%.log',
          maxSize: '20m',
          maxFiles: '14d'
        }),
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize({ all: true }),
            winston.format.printf(
              ({ level, message, timestamp }) =>
                `${timestamp} [${level}]: ${message}`
            )
          )
        })
      ]
    })
  })

  await app.listen(process.env.PORT || 3000, process.env.HOSTNAME || '0.0.0.0')
}

bootstrap()

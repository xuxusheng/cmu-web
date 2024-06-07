import { Injectable, Logger } from '@nestjs/common'
import { Knex } from 'knex'
import { Socket } from 'net'
import { I2DebugModelEntity } from '../shared/model/entity/cfg-i2/i2-debug-model.entity'
import { KnexService } from '../shared/service/knex.service'

@Injectable()
export class I2SensorDebugService {
  private readonly logger = new Logger(I2SensorDebugService.name)
  private readonly cfgI2DB: Knex

  constructor(private knexSvc: KnexService) {
    this.cfgI2DB = this.knexSvc.getCfgI2DB()
  }

  getCommand = async () => {
    const commands =
      await this.cfgI2DB<I2DebugModelEntity>('i2_debug_model').select()

    return commands.map((item) => ({
      value: item.cmd,
      label: item.descCn
    }))
  }

  sendCommand = (i2SensorId: number, command: string) => {
    const cmd = `sen_id:${i2SensorId};cmd:${command}`
    const client = new Socket()

    return new Promise((resolve, reject) => {
      client.connect(6565, '127.0.0.1', () => {
        client.write(cmd)
        this.logger.log(`Socket 连接成功，发送命令：${cmd}`)
      })

      client.on('data', (data) => {
        this.logger.log(`Socket 接收到数据：${data}`)
        client.destroy()
      })

      client.on('close', (data) => {
        this.logger.log('Socket 连接关闭')
        resolve(null)
      })

      client.on('error', (err) => {
        this.logger.error(`Socket 连接错误：${err.message}`)
        reject(err)
      })
    })
  }
}

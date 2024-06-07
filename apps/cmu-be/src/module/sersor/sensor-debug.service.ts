import { Injectable, Logger } from '@nestjs/common'
import { Knex } from 'knex'
import { Socket } from 'net'
import { NotFoundException } from '../core/exception/custom-exception'
import { SenCfgTblEntity } from '../shared/model/entity/cfg/sen-cfg-tbl.entity'
import { SenDebugModelEntity } from '../shared/model/entity/cfg/sen-debug-model.entity'
import { KnexService } from '../shared/service/knex.service'

@Injectable()
export class SensorDebugService {
  private readonly logger = new Logger(SensorDebugService.name)

  private readonly cfgDB: Knex

  constructor(private knexSvc: KnexService) {
    this.cfgDB = knexSvc.getCfgDB()
  }

  // 获取调试命令
  getCommand = async (sensorId: number) => {
    // 先通过 sensorId 查询传感器对应的设备类型和设备型号
    const sensor = await this.cfgDB<SenCfgTblEntity>('sen_cfg_tbl')
      .where('senId', sensorId)
      .first()

    if (!sensor) {
      throw new NotFoundException(`ID 为 ${sensorId} 的传感器不存在`)
    }

    const { lnClass, senType } = sensor

    const commands = await this.cfgDB<SenDebugModelEntity>(
      'sen_debug_model'
    ).where({
      lnClass,
      senType
    })

    return commands.map((item) => ({
      value: item.cmd,
      label: item.descCn
    }))
  }

  // 下发调试命令
  sendCommand = (sensorId: number, command: string, args: string) => {
    const cmd = `ln_inst:${sensorId};cmd:${command};data:${args}`
    const client = new Socket()

    return new Promise((resolve, reject) => {
      client.connect(6665, '127.0.0.1', () => {
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

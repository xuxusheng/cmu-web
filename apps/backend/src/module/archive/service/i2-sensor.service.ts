import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import net from 'net'

import { I2SensorTblEntity } from '../../shared/model/entity/cfg-i2/i2-sensor-tbl.entity'
import { KnexService } from '../../shared/service/knex.service'
import { str2Int } from '../../shared/utils/parse-int'

@Injectable()
export class I2SensorService {
  cfgI2DB: Knex

  private readonly cols = [
    'sensor_id',
    'sensor_code',
    'device_id',
    'ln_inst',
    'desc_cn',
    'group_id',
    'equipment_id',
    'dataupload_period',
    'next_dataupload_time',
    'phase'
  ]

  constructor(private knexSvc: KnexService) {
    this.cfgI2DB = this.knexSvc.getCfgI2DB()
  }

  getAllInfos = async () => {
    const rows = await this.cfgI2DB<I2SensorTblEntity>('i2_sensor_tbl').select()
    return str2Int(['sensorId'], rows)
  }

  deleteInfoById = (ids) =>
    this.cfgI2DB<I2SensorTblEntity>('i2_sensor_tbl')
      .whereIn('sensor_id', ids)
      .del()

  updateInfoById = (id, info) => {
    info = Object.fromEntries(
      Object.entries(info).filter((entry) => this.cols.includes(entry[0]))
    )
    return this.cfgI2DB<I2SensorTblEntity>('i2_sensor_tbl')
      .where('sensorId', id)
      .update(info)
  }
  addInfo = (info) => {
    info = Object.fromEntries(
      Object.entries(info).filter((entry) => this.cols.includes(entry[0]))
    )
    return this.cfgI2DB<I2SensorTblEntity>('i2_sensor_tbl').insert(info)
  }

  deleteAll = () => this.cfgI2DB<I2SensorTblEntity>('i2_sensor_tbl').del()

  getAll = (params) => {
    const joinTable = 'i2_group_tbl'
    const joinTable1 = 'phase_tbl'
    const exCols = [`${joinTable}.group_name`, `${joinTable1}.phase_name`]
    const selectCols = params?.fields
      ? params.fields.split(/,/)
      : [...this.cols, ...exCols]

    return this.cfgI2DB('i2_sensor_tbl')
      .leftJoin(
        joinTable,
        `i2_sensor_tbl.i2_group_tbl`,
        '=',
        `${joinTable}.group_id`
      )
      .leftJoin(
        joinTable1,
        `i2_sensor_tbl.phase_tbl`,
        '=',
        `${joinTable1}.phase_id`
      )
      .select(exCols)
  }

  postSensorDebugOrder = (sensorId, params) => {
    const cmd = params.cmd
    const str = `sen_id:${sensorId};cmd:${cmd}`
    const host = '127.0.0.1'
    const port = 6565
    const client = new net.Socket()
    const p = new Promise((resolve, reject) => {
      client.connect(port, host, () => {
        client.write(str)
        console.log('Connected, write:', str)
      })

      client.on('data', (data) => {
        console.log('Receive data:', str)
        client.destroy()
      })
      client.on('close', (data) => {
        console.log('socket closed')
        resolve(null)
      })
      client.on('error', (data) => {
        console.log('socket error:', data.message)
        reject()
      })
    })

    return p
  }
}

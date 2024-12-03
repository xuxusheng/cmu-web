import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'

import { CfgI2Tables } from '../../shared/const/enum/table-name'
import { I2CacTblEntity } from '../../shared/model/entity/cfg-i2/i2-cac-tbl.entity'
import { KnexService } from '../../shared/service/knex.service'
import { str2Int } from '../../shared/utils/parse-int'

@Injectable()
export class I2CacService {
  cfgI2DB: Knex

  constructor(private knexSvc: KnexService) {
    this.cfgI2DB = this.knexSvc.getCfgI2DB()
  }

  getAllInfos = async () => {
    const rows = await this.cfgI2DB<I2CacTblEntity>('i2_cac_tbl').select(
      'cac_id',
      'cac_ip',
      'heartbeat_period',
      'next_heartbeat_time'
    )
    return str2Int(['cac_id'], rows)
  }

  deleteInfoById = (ids) =>
    this.cfgI2DB<I2CacTblEntity>('i2_cac_tbl').whereIn('cac_id', ids).del()

  updateInfoById = (id, info) => {
    info = Object.fromEntries(
      Object.entries(info).filter((entry) =>
        [
          'cac_id',
          'cac_ip',
          'heartbeat_period',
          'next_heartbeat_time'
        ].includes(entry[0])
      )
    )
    return this.cfgI2DB<I2CacTblEntity>('i2_cac_tbl')
      .where('cacId', id)
      .update(info)
  }
  addInfo = (info) => {
    info = Object.fromEntries(
      Object.entries(info).filter((entry) =>
        [
          'cac_id',
          'cac_ip',
          'heartbeat_period',
          'next_heartbeat_time'
        ].includes(entry[0])
      )
    )
    return this.cfgI2DB<I2CacTblEntity>(CfgI2Tables.I2CacTbl).insert(info)
  }

  deleteAll = () => this.cfgI2DB<I2CacTblEntity>('i2_cac_tbl').del()
}

import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'

import { I2CagTblEntity } from '../../shared/model/entity/cfg-i2/i2-cag-tbl.entity'
import { KnexService } from '../../shared/service/knex.service'
import { str2Int } from '../../shared/utils/parse-int'

@Injectable()
export class I2CagService {
  cfgI2DB: Knex

  constructor(private knexSvc: KnexService) {
    this.cfgI2DB = this.knexSvc.getCfgI2DB()
  }

  getAllInfos = async () => {
    const rows = await this.cfgI2DB<I2CagTblEntity>('i2_cag_tbl').select(
      'cag_id',
      'cag_ip',
      'cag_port',
      'cag_service_locate',
      'cag_namespace',
      'timeout_time'
    )
    return str2Int(['cag_id'], rows)
  }

  deleteInfoById = (ids) =>
    this.cfgI2DB<I2CagTblEntity>('i2_cag_tbl').whereIn('cag_id', ids).del()

  updateInfoById = (id, info) => {
    info = Object.fromEntries(
      Object.entries(info).filter((entry) =>
        [
          'cag_id',
          'cag_ip',
          'cag_port',
          'cag_service_locate',
          'cag_namespace',
          'timeout_time'
        ].includes(entry[0])
      )
    )
    return this.cfgI2DB<I2CagTblEntity>('i2_cag_tbl')
      .where('cagId', id)
      .update(info)
  }
  addInfo = (info) => {
    info = Object.fromEntries(
      Object.entries(info).filter((entry) =>
        [
          'cag_id',
          'cag_ip',
          'cag_port',
          'cag_service_locate',
          'cag_namespace',
          'timeout_time'
        ].includes(entry[0])
      )
    )
    return this.cfgI2DB<I2CagTblEntity>('i2_cag_tbl').insert(info)
  }

  deleteAll = () => this.cfgI2DB<I2CagTblEntity>('i2_cag_tbl').del()
}

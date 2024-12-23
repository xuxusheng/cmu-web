import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'

import { I2ParamgroupTblEntity } from '../../shared/model/entity/cfg-i2/i2-paramgroup-tbl.entity'
import { KnexService } from '../../shared/service/knex.service'
import { str2Int } from '../../shared/utils/parse-int'

@Injectable()
export class I2ParamgroupService {
  cfgI2DB: Knex

  constructor(private knexSvc: KnexService) {
    this.cfgI2DB = this.knexSvc.getCfgI2DB()
  }

  getAllInfos = async () => {
    const rows =
      await this.cfgI2DB<I2ParamgroupTblEntity>('i2_paramgroup_tbl').select()
    return str2Int(['i2ParamgroupId'], rows)
  }

  getParamsByGroupId = (groupId) => {
    const joinTable = 'data_type_tbl'
    return this.cfgI2DB('i2_paramgroup_tbl')
      .leftJoin(
        joinTable,
        `i2_paramgroup_tbl.data_type`,
        '=',
        `${joinTable}.data_type_id`
      )
      .select(
        ...[
          'i2_paramgroup_id',
          'group_id',
          'param_code',
          'param_name',
          'param_alm_name',
          'rate',
          'data_type'
        ],
        `${joinTable}.data_type_name`
      )
      .where({ groupId: groupId })
      .orderBy('i2_paramgroup_id', 'asc')
  }
}

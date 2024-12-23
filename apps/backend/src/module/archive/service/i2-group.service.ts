import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'

import { I2GroupTblEntity } from '../../shared/model/entity/cfg-i2/i2-group-tbl.entity'
import { KnexService } from '../../shared/service/knex.service'
import { str2Int } from '../../shared/utils/parse-int'

@Injectable()
export class I2GroupService {
  cfgI2DB: Knex

  constructor(private knexSvc: KnexService) {
    this.cfgI2DB = this.knexSvc.getCfgI2DB()
  }

  getAllInfos = async () => {
    const rows = await this.cfgI2DB<I2GroupTblEntity>('i2_group_tbl').select()
    return str2Int(['groupId'], rows)
  }
}

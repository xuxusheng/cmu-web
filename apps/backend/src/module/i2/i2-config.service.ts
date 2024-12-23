import { Injectable } from '@nestjs/common'
import dayjs from 'dayjs'

import { I2CacTblEntity } from '../shared/model/entity/cfg-i2/i2-cac-tbl.entity'
import { I2CagTblEntity } from '../shared/model/entity/cfg-i2/i2-cag-tbl.entity'
import { KnexService } from '../shared/service/knex.service'
import { CacConfigDto } from './dto/cac-config.dto'
import { CagConfigDto } from './dto/cag-config.dto'

@Injectable()
export class I2ConfigService {
  private readonly i2DB = this.knexSvc.getCfgI2DB()

  constructor(private knexSvc: KnexService) {}

  getCac = () => this.i2DB<I2CacTblEntity>('i2_cac_tbl').first()

  updateCac = async (dto: CacConfigDto) => {
    const nextHeartbeatTime = dayjs(dto.nextHeartbeatTime).format(
      'YYYY-MM-DD HH:mm'
    )

    await this.i2DB<I2CacTblEntity>('i2_cac_tbl')
      .update({ ...dto, nextHeartbeatTime })
      .limit(1)
  }

  getCag = (id: number) =>
    this.i2DB<I2CagTblEntity>('i2_cag_tbl').where('cagId', id).first()

  getCagList = () =>
    this.i2DB<I2CagTblEntity>('i2_cag_tbl').select().orderBy('cagId', 'desc')

  createCag = (dto: CagConfigDto) =>
    this.i2DB<I2CagTblEntity>('i2_cag_tbl').insert(dto)

  updateCag = (id: number, dto: CagConfigDto) =>
    this.i2DB<I2CagTblEntity>('i2_cag_tbl').where('cagId', id).update(dto)

  deleteCag = (id: number) =>
    this.i2DB<I2CagTblEntity>('i2_cag_tbl').where('cagId', id).delete()
}

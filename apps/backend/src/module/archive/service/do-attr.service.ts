import { Injectable } from '@nestjs/common'

import { DoattrsAllEntity } from '../../shared/model/entity/cfg/doattrs-all.entity'
import { LnClassModelEntity } from '../../shared/model/entity/cfg/ln-class-model.entity'
import { SenTypeModelEntity } from '../../shared/model/entity/cfg/sen-type-model.entity'
import { SysCfgTblEntity } from '../../shared/model/entity/cfg/sys-cfg-tbl.entity'
import { KnexService } from '../../shared/service/knex.service'

@Injectable()
export class DoAttrService {
  constructor(private knexService: KnexService) {}

  queryAll = () => {
    const db = this.knexService.getCfgDB()
    return db<DoattrsAllEntity>('doattrs_all').select()
  }

  // todo improve
  getMapParams = () => {
    const cfgDB = this.knexService.getCfgDB()
    const cfgI2DB = this.knexService.getCfgI2DB()

    const pp = []
    let p = null

    p = cfgDB<SenTypeModelEntity>('sen_type_model')
      .select('sen_type')
      .then((rows) =>
        rows.map((row) => {
          return { value: row.sen_type, label: row.sen_type }
        })
      )
    pp.push(p)

    p = cfgDB<LnClassModelEntity>('ln_class_model')
      .select('ln_class', 'desc_cn')
      .then((rows) =>
        rows.map((row) => {
          return { value: row.ln_class, label: row.desc_cn }
        })
      )
    pp.push(p)

    p = cfgDB('commu_type_model')
      .select('commu_type', 'commu_type_cn')
      .then((rows) =>
        rows.map((row) => {
          return { value: row.commu_type, label: row.commu_type_cn }
        })
      )
    pp.push(p)

    p = cfgI2DB('phase_tbl')
      .select('phase_id', 'phase_name')
      .then((rows) =>
        rows.map((row) => {
          return { value: row.phase_id, label: row.phase_name }
        })
      )
    pp.push(p)

    p = cfgDB('sen_attr_model')
      .select('ln_class', 'sen_type', 'attr', 'desc_cn', 'attr_def_val')
      .then((rows) => {
        const arr = []
        for (const row of rows) {
          const ln_class = row.ln_class
          const sen_type = row.sen_type
          const val = arr.find(
            (val) => val.ln_class === ln_class && val.sen_type === sen_type
          )

          delete row.ln_class
          delete row.sen_type

          if (val && val.attrs) {
            val.attrs.push(row)
          } else {
            arr.push({ ln_class, sen_type, attrs: [row] })
          }
        }

        return arr
      })
    pp.push(p)

    p = cfgDB('sen_debug_model')
      .select('ln_class', 'sen_type', 'cmd', 'desc_cn', 'comment', 'def_data')
      .then((rows) => {
        const arr = []
        for (const row of rows) {
          row.cmd = parseInt(row.cmd)

          const ln_class = row.ln_class
          const sen_type = row.sen_type
          const val = arr.find(
            (val) => val.ln_class === ln_class && val.sen_type === sen_type
          )

          delete row.ln_class
          delete row.sen_type

          if (val && val.attrs) {
            val.attrs.push(row)
          } else {
            arr.push({ ln_class, sen_type, attrs: [row] })
          }
        }

        return arr
      })
    pp.push(p)

    const f = (db, rows, intIndex) => {
      return db.select(rows).then((rr) =>
        rr.map((r) => {
          r[rows[intIndex]] = parseInt(r[rows[intIndex]])
          return r
        })
      )
    }

    p = f(
      cfgDB('cdc_type_model'),
      ['cdc_type_id', 'cdc_type_name', 'desc_cn'],
      0
    )
    pp.push(p)

    p = f(
      cfgI2DB('i2_group_tbl'),
      ['group_id', 'ln_name', 'group_name', 'group_code'],
      0
    )
    pp.push(p)

    p = f(cfgI2DB('i2_debug_model'), ['cmd', 'desc_cn'], 0).then((rows) =>
      rows.map((r) => {
        return { value: r.cmd, label: r.desc_cn }
      })
    )
    pp.push(p)

    p = f(cfgI2DB('data_type_tbl'), ['data_type_id', 'data_type_name'], 0)
    pp.push(p)

    return Promise.all(pp).then((vals) => {
      const o = {
        map_sen_type: vals[0],
        map_ln_class: vals[1],
        map_commu_type: vals[2],
        map_phase: vals[3],
        map_sen_attr: vals[4],
        map_sen_debug: vals[5],
        map_cdc_type: vals[6],
        map_i2_group: vals[7],
        map_i2_debug: vals[8],
        map_i2_data_type: vals[9]
      }
      return o
    })
  }

  getCommuProcAttrs = () => {
    const db = this.knexService.getCfgDB()

    return db<SysCfgTblEntity>('sys_cfg_tbl').select('key', 'value', 'desc_cn')
  }

  updateCommuProcAttrs = (attrs) => {
    const db = this.knexService.getCfgDB()

    return (
      db('sys_cfg_tbl')
        // todo 错误的代码？，传参类型对不上
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .transacting((trx) => {
          const pp = []
          for (const attr of attrs) {
            const p = db('sys_cfg_tbl')
              .update({ value: attr.value })
              .where({ key: attr.key })
            pp.push(p)
          }

          Promise.all(pp)
            .then(() => {
              console.log('update success!')
              trx.commit()
            })
            .catch((e) => {
              console.log('update failed!')
              trx.rollback()
            })
        })
        .then((resp) => {
          console.log('transaction complete')
        })
    )
  }
}

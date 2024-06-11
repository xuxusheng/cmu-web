import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import knex, { Knex } from 'knex'
import { gMmsConfig } from '../../core/config/g-mms.config'
import { c2s } from '../utils/c2s'
import { s2c } from '../utils/s2c'

const wrapIdentifier = (value, origImpl) => {
  if (value === '*') {
    return origImpl(value)
  }

  // 驼峰转蛇形
  return origImpl(c2s(value))
}

const postProcessResponse = (result) => s2c(result)

@Injectable()
export class KnexService implements OnModuleInit {
  private cfgDB: Knex
  private cfgI2DB: Knex
  private iedDataDB: Knex

  constructor(
    @Inject(gMmsConfig.KEY) private gMmsConf: ConfigType<typeof gMmsConfig>
  ) {
    // 初始化数据库连接

    const { gMmsEtcHome, gNandHome } = gMmsConf

    this.setCfgDB(
      knex({
        client: 'better-sqlite3',
        connection: {
          filename: `${gMmsEtcHome}/cfg.sqlite3`
        },
        useNullAsDefault: true,
        debug: true,
        wrapIdentifier,
        postProcessResponse
      })
    )

    this.setCfgI2DB(
      knex({
        client: 'better-sqlite3',
        connection: {
          filename: `${gMmsEtcHome}/cfg_i2.sqlite3`
        },
        useNullAsDefault: true,
        debug: true,
        wrapIdentifier,
        postProcessResponse
      })
    )
    this.setIedDataDB(
      knex({
        client: 'better-sqlite3',
        connection: {
          filename: `${gNandHome}/db/ied_data.sqlite3`
        },
        useNullAsDefault: true,
        debug: true,
        wrapIdentifier,
        postProcessResponse
      })
    )
  }

  async onModuleInit() {
    // 可以在这里做一些数据库连接配置
  }

  private setCfgDB(db: Knex) {
    this.cfgDB = db
  }

  public getCfgDB() {
    return this.cfgDB
  }

  private setCfgI2DB(db: Knex) {
    this.cfgI2DB = db
  }

  public getCfgI2DB() {
    return this.cfgI2DB
  }

  private setIedDataDB(db: Knex) {
    this.iedDataDB = db
  }

  public getIedDataDB() {
    return this.iedDataDB
  }
}

import { Injectable } from '@nestjs/common'
import { writeFileSync } from 'fs'
import { Knex } from 'knex'
import net from 'net'
import { DoMapModelEntity } from '../../shared/model/entity/cfg/do-map-model.entity'
import { SenAttrModelEntity } from '../../shared/model/entity/cfg/sen-attr-model.entity'
import { SenAttrTblEntity } from '../../shared/model/entity/cfg/sen-attr-tbl.entity'
import { SenCfgTblEntity } from '../../shared/model/entity/cfg/sen-cfg-tbl.entity'
import { SensorAllEntity } from '../../shared/model/entity/cfg/sensor-all.entity'
import { UpdateStatusEntity } from '../../shared/model/entity/ied-data/update-status.entity'
import { KnexService } from '../../shared/service/knex.service'
import { str2Int } from '../../shared/utils/parse-int'

@Injectable()
export class SensorService {
  private readonly cfgDB: Knex
  private readonly iedDataDB: Knex

  constructor(private knexSvc: KnexService) {
    this.cfgDB = this.knexSvc.getCfgDB()
    this.iedDataDB = this.knexSvc.getIedDataDB()
  }

  queryAll = async () => {
    const rows = await this.cfgDB<SensorAllEntity>('sensor_all').select()
    const id2Sensor = {}
    const id2Attr = {}
    for (const row of rows) {
      const senId = row.senId
      if (row.hasOwnProperty('attr')) {
        const o = {
          attr: row.attr,
          value: row.value,
          desc_cn: row.senAttrDesc
        }
        if (id2Attr.hasOwnProperty(senId)) id2Attr[senId].push(o)
        else id2Attr[senId] = [o]
      }

      if (!id2Sensor.hasOwnProperty(senId)) {
        delete row.attr
        delete row.value
        delete row.senAttrDesc
        id2Sensor[senId] = row
      }
    } // map
    const resps = []
    for (const senId_1 of Object.keys(id2Attr)) {
      const resp = id2Sensor[senId_1]
      resp.attrs = id2Attr[senId_1]
      resps.push(resp)
    }
    return resps
  }

  onExportCSV = async (senId, query) => {
    const q = await this.cfgDB<SenCfgTblEntity>('sen_cfg_tbl')
      .select('sen_id', 'ln_class', 'ln_inst', 'desc_cn')
      .where('sen_id', senId)
    const lnClass = q[0].ln_class
    const lnInst = q[0].ln_inst
    const desc = q[0].desc_cn

    const today = new Date()
    const filename = `${desc}#${lnInst}#${today.toISOString()}.csv`

    const doq = await this.cfgDB<DoMapModelEntity>('do_map_model')
      .select('do_name', 'desc_cn', 'unit', 'precision')
      .where('ln_class', lnClass)
      .where('import_level', '>=', 1)

    const dataLnTable = `data_${lnClass}`

    const db = this.iedDataDB(dataLnTable).where('ln_inst', lnInst)
    if (query.hasOwnProperty('time_min'))
      // fixme: 压根就没有 str2Time 这个函数
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      db.where('data_time', '>=', str2Time(query.time_min))
    if (query.hasOwnProperty('time_max'))
      // fixme: 压根就没有 str2Time 这个函数
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      db.where('data_time', '>=', str2Time(query.time_max))

    const csvHeader = ['Data_Time']
    const csvKey = ['Data_Time']

    const dataq = await db

    for (const row of doq) {
      if (dataq[0].hasOwnProperty(row.do_name)) {
        csvHeader.push(row.do_name)
        csvKey.push(row.do_name)
      }
    }

    const content = []
    for (const row of dataq) {
      const arr = csvKey.map((key) => row[key])
      content.push(arr.join(','))
    }

    content.unshift(csvHeader.join(','))

    writeFileSync(`/tmp/${filename}`, content.join('\n'))

    return `/tmp/${filename}`
  }

  getCurrentSensorStatus = async () => {
    const rows = await this.iedDataDB<UpdateStatusEntity>(
      'update_status'
    ).select(
      'sen_id',
      'data_time',
      'mov_dev_conf',
      'sup_dev_run',
      'data_status'
    )
    return str2Int(
      ['sen_id', 'mov_dev_conf', 'sup_dev_run', 'data_status'],
      rows
    )
  }

  getLnNames = () => {
    return this.iedDataDB('sqlite_master')
      .select('name')
      .where('type', 'table')
      .andWhereLike('name', 'DATA_%')
      .then((rows) => rows.map((row) => row.name.replace(/^DATA_/, '')))
  }

  getUpdateSensorInfo = async (args) => {
    const lnNames = await this.getLnNames()
    const query = this.cfgDB<DoMapModelEntity>('do_map_model')
      .select('ln_class', 'do_name')
      .whereIn('ln_class', lnNames)
    if (args.hasOwnProperty('import_level'))
      query.whereIn(
        'import_level',
        args.import_level.split(/,/).map((v) => parseInt(v))
      )
    else query.andWhere('import_level', 2) // default

    let modelQ = await query
    if (modelQ.length == 0) return []

    const ln2Cols = {}
    for (const m of modelQ) {
      const ln_class = m.ln_class
      if (ln2Cols.hasOwnProperty(ln_class)) ln2Cols[ln_class].push(m.do_name)
      else ln2Cols[ln_class] = [m.do_name]
    }

    // fixme: 一个变量赋值两次，导致有类型推断的错误了
    modelQ = await this.cfgDB('sen_cfg_tbl')
      .select('ln_class', 'ln_inst', 'sen_id')
      .whereIn('ln_class', lnNames)
    if (modelQ.length == 0) return []

    const inst2SenId = {}
    const sendId2DoData = {}
    for (const m of modelQ) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const senId = m.sen_id
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      inst2SenId[`${m.ln_class}#${m.ln_inst}`] = senId
      sendId2DoData[senId] = { sen_id: senId, data_time: null }
    }

    for (const lnName of lnNames) {
      const cols = ln2Cols[lnName]
      if (cols === undefined) continue

      modelQ = await this.iedDataDB(`update_${lnName.toLowerCase()}`).select(
        'Data_Time',
        'Ln_inst',
        ...cols
      )
      if (modelQ.length == 0) continue

      for (const row of modelQ) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const key = `${lnName}#${row.Ln_inst}`
        if (!inst2SenId.hasOwnProperty(key)) continue
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const res = { sen_id: inst2SenId[key], data_time: row.Data_Time }

        for (const col of cols) {
          if (row.hasOwnProperty(col)) res[col] = row[col]
          else res[col] = null
        }
        sendId2DoData[res.sen_id] = res
      }
    }

    return Object.values(sendId2DoData)
  }

  getLnNameAndInstById = async (senId, importLevel = 1) => {
    let q = await this.cfgDB<SenCfgTblEntity>('sen_cfg_tbl')
      .select('ln_class', 'ln_inst')
      .where('sen_id', senId)
    if (q.length === 0)
      throw new Error('cannot get ln_class and ln_inst for sensorId：' + senId)

    const lnClass = q[0].ln_class.toUpperCase()
    const lnInst = q[0].ln_inst

    // fixme: 一个变量赋值多次导致问题
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    q = await this.cfgDB<DoMapModelEntity>('do_map_model')
      .select('do_name')
      .where('ln_class', lnClass)
      .andWhere('import_level', '>', importLevel)
    if (q.length === 0)
      throw new Error('cannot get donames for lnClass: ' + lnClass)

    // fixme: 一个变量赋值多次导致问题
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const doNames = q.map((row) => row.do_name)

    return { lnClass, lnInst, doNames }
  }

  getHistorData = (db, doNames) => {
    return db.select('data_time', ...doNames).then((rows) => {
      const RET = []
      for (const row of rows) {
        const item = { data_time: row.Data_Time, datas: [] }
        for (const doName of doNames) item.datas.push(row[doName])
        RET.push(item)
      }

      return RET
    })
  }

  getSensorDataById = async (senId, query) => {
    const { lnClass, lnInst, doNames } = await this.getLnNameAndInstById(senId)

    const str2Time = (str) => {
      if (str.length != 14) return '0000-00-00 00:00:00'
      else return str.match(/.{1,2}/g)
    }

    const tableName = `DATA_${lnClass}`
    const db = this.iedDataDB(tableName)
    if (query.hasOwnProperty('top')) {
      db.limit(query.top)
    } else {
      if (query.hasOwnProperty('time')) {
        db.where('data_time', str2Time(query.time))
      } else {
        if (query.hasOwnProperty('time_min'))
          db.where('data_time', '>=', str2Time(query.time_min))
        if (query.hasOwnProperty('time_max'))
          db.where('data_time', '>=', str2Time(query.time_max))
      }
    }

    db.where('ln_inst', lnInst)
    db.orderBy('data_time')

    const hisDatas = await this.getHistorData(db, doNames)

    return { do_names: doNames, items: hisDatas, sen_id: senId }
  }

  checkUpdateValidation = async (newsensor, senId) => {
    const cnt = await this.cfgDB<SenAttrModelEntity>('sen_attr_model')
      .where({ senType: newsensor.sen_type, lnClass: newsensor.ln_class })
      .count()
    // fixme: count 语句使用的有问题
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (cnt == 0) {
      return false
    }

    const q = await this.cfgDB('sen_cfg_tbl').select().where({
      sen_id: senId,
      sen_type: newsensor.sen_type,
      ln_class: newsensor.ln_class,
      ln_inst: newsensor.ln_inst
    })
    //如果有对应类型的数据,则是2种情况:
    // 1.该数据是另一条数据,即sen_id不同,此时不应该修改以免数据冲突
    // 2.该数据就是本条数据,$newSensor提交的这几项参数没有修改,则这时应该放行

    if (q.length > 0 && q[0].sen_id != senId) return false
    else return true
  }

  addSensor = async (sensor) => {
    const attrs = sensor.attrs
    const sensorProps = [
      'sen_type',
      'ln_class',
      'ln_inst',
      's_addr',
      'desc_cn',
      'commu_type'
    ]
    const newSensor = Object.fromEntries(
      Object.entries(sensor).filter(([key]) => sensorProps.includes(key))
    )
    const trx = await this.cfgDB.transaction()
    try {
      const [senId] = await trx('sen_cfg_tbl').insert(newSensor)
      console.log('senId: ', senId)
      const newRows = attrs.map((attr) => {
        return { sen_id: senId, key: attr.attr, value: attr.value }
      })
      await trx('sen_attr_tbl').insert(newRows)
      await trx.commit()
    } catch (e) {
      console.log('add sensor error: ', e.message)
      await trx.rollback()
      throw e
    }
  }

  onDeleteSensor = async (senIds) => {
    const ids = senIds.split(/,/)
    const trx = await this.cfgDB.transaction()
    try {
      let num = await trx('sen_cfg_tbl').whereIn('sen_id', ids).del()
      if (num < 1) throw new Error('delete sensor failed, return: ' + num)

      num = await trx('sen_attr_tbl').whereIn('sen_id', ids).del()
      if (num < 1) throw new Error('delete sensor attr failed, return: ' + num)
      await trx.commit()
    } catch (e) {
      await trx.rollback()
      throw e
    }
  }

  updateSensor = async (senId, sensor) => {
    const attrs = sensor.attrs
    const sensorProps = [
      'sen_type',
      'ln_class',
      'ln_inst',
      's_addr',
      'desc_cn',
      'commu_type'
    ]
    const newSensor = Object.fromEntries(
      Object.entries(sensor).filter(([key]) => sensorProps.includes(key))
    )

    if (!(await this.checkUpdateValidation(newSensor, senId)))
      throw new Error('error type/ln_class match or ln_inst conflict')

    const num = await this.cfgDB('sen_cfg_tbl')
      .update(newSensor)
      .where('sen_id', senId)
    if (num != 1) throw new Error('update sensor return: ' + num)

    const newRows = attrs.map((attr) => {
      return { sen_id: senId, key: attr.attr, value: attr.value }
    })
    await this.cfgDB<SenAttrTblEntity>('sen_attr_tbl')
      .del()
      .where('senId', senId)
    await this.cfgDB<SenAttrTblEntity>('sen_attr_tbl').insert(newRows)
  }

  onDebug = async (senId, cmd, param) => {
    const str = `ln_inst:${senId};cmd:${cmd};data:${param}`
    const host = '127.0.0.1'
    const port = 6665
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

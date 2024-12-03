import Database from 'better-sqlite3'
import { Dayjs } from 'dayjs'
import { copySync, removeSync } from 'fs-extra'
import path from 'node:path'
import ora from 'ora'
import { exit } from 'process'

import { SenAttrModelEntity, SenCfgTblEntity } from '../../entity/entity'
import { generateOutputFilename } from '../../utils/file'
import { logger } from '../../utils/logger'
import { LNTemplateFromExcel, parseExcel } from './excel'

export interface GenerateDbOptions {
  time: Dayjs
  sqliteFilePath: string
  excelFilePath: string
}

// 生成数据库
export const generateDb = async (options: GenerateDbOptions) => {
  const { time, sqliteFilePath, excelFilePath } = options

  logger.divider('生成数据库文件开始')

  // 解析 excel
  const { lnDescriptionFromExcel, lnTemplateFromExcel, ldInfoFromExcel } =
    parseExcel(excelFilePath)

  // 输出的数据库文件路径
  const outputFileName = generateOutputFilename(sqliteFilePath, 'sqlite3', time)
  const outputFilePath = path.join(process.cwd(), outputFileName)
  const outputFileTmpPath = path.join('/tmp', outputFileName) // 临时路径

  // 先复制到临时路径
  copySync(sqliteFilePath, outputFileTmpPath)

  // 创建数据库连接
  const db = Database(outputFileTmpPath)
  ora().succeed('数据库连接成功')

  // 删除传感器表中的旧数据
  db.exec('delete from main.sen_cfg_tbl')
  ora().succeed('删除 sen_cfg_tbl 表旧数据完成')

  // 待插入的传感器数据
  const sensorsWait2Insert: Omit<SenCfgTblEntity, 'sen_id'>[] = []

  // 维护一个第几组和 LD 逻辑设备的 map
  const LDGroupMap: Partial<
    Record<
      number,
      {
        device_id: string
        ip: string
        port: string
      }
    >
  > = {}

  for (const logicDevice of ldInfoFromExcel) {
    const logicDeviceId = Number(logicDevice.ld_id)

    // 当前逻辑设备属于第几组
    const ldGroup = Math.floor(Number(logicDevice.GroupNoStartID) / 100)

    const device_id = logicDevice.device_id
    const ip = logicDevice.ip
    const port = logicDevice.port
    LDGroupMap[ldGroup] = { device_id, ip, port }

    for (const lnTemplate of lnTemplateFromExcel) {
      // ln_inst 代表第几组第几个设备
      const ln_inst = `${logicDeviceId * 100 + (Number(lnTemplate.ln_inst) % 100)}`
      const s_addr = (
        (Number(lnTemplate.s_addr) % 100) +
        Number(ldGroup) * 100
      ).toString()

      const lnDescription = lnDescriptionFromExcel.find(
        (v) => v.vcard_id === lnTemplate.vcard_id
      )
      const latterDesc = lnDescription![ldGroup]

      if (!latterDesc || latterDesc.trim().length == 0) {
        logger.warning(
          `未找到描述信息，ln_class: ${lnTemplate.ln_class}，sen_type: ${lnTemplate.sen_type}，ln_inst: ${ln_inst}`
        )
        // console.log('skip lnobj', ln_class, ', sentype:', sen_type, ', inst: ', ln_inst,)
        continue
      }

      sensorsWait2Insert.push({
        // 设备型号
        sen_type: lnTemplate.sen_type,
        // 设备类型
        ln_class: lnTemplate.ln_class,
        // 设备号
        ln_inst,
        // 短地址
        s_addr,
        // 通信类型
        commu_type: Number(lnTemplate.commu_type),
        // 设备描述
        desc_cn: `${logicDevice.LDevice_desc}_${lnTemplate.desc_cn}|${latterDesc}`
      })
    }
  }

  // 建立一个用来查询 lnTemplate 的 map
  const lnTemplateMap: Record<string, LNTemplateFromExcel> = {}
  for (const lnTemplate of lnTemplateFromExcel) {
    // const inst = Number(lnTemplate.ln_inst) % 100
    const key = createSensorKey(lnTemplate)
    lnTemplateMap[key] = lnTemplate
  }

  // 准备 sen_cfg_tbl 表的插入语句
  const sensorInsertSql = db.prepare(
    `insert into sen_cfg_tbl (sen_type, ln_class, ln_inst, s_addr, commu_type, desc_cn)
     VALUES (@sen_type, @ln_class, @ln_inst, @s_addr, @commu_type, @desc_cn)`
  )
  // 所有生成的传感器入库
  db.transaction((sensors) => {
    for (const sensor of sensors) {
      sensorInsertSql.run(sensor)
    }
  })(sensorsWait2Insert)
  ora().succeed(
    `sen_cfg_tbl 表数据插入完成，共 ${sensorsWait2Insert.length} 条数据`
  )

  // 删除传感器属性值表中旧数据
  db.exec('delete from sen_attr_tbl')
  ora().succeed('sen_attr_tbl 表旧数据删除完成')

  // 取出数据库中所有的传感器属性字段数据
  const sensorAttrModels = db
    .prepare('select * from sen_attr_model')
    .all() as SenAttrModelEntity[]

  // 建立一个传感器属性字段 map，方便后面查找，使用 ln_class + sen_type 作为 key
  const sensorAttrModelMap: Record<string, SenAttrModelEntity[]> = {}

  // 下面这个操作，其实就是起的 groupBy 的作用
  sensorAttrModels.forEach((attrModel) => {
    const key = generateSensorAttrModelMapKey(attrModel)
    if (!sensorAttrModelMap[key]) {
      sensorAttrModelMap[key] = [attrModel]
    } else {
      sensorAttrModelMap[key].push(attrModel)
    }
  })

  // 待存入传感器属性值表的数据
  const sensorAttrsWait2Insert = []

  // 查询出刚才插入的传感器数据
  const sensors = db
    .prepare('select sen_id, sen_type, ln_class, ln_inst from sen_cfg_tbl')
    .all() as Pick<
    SenCfgTblEntity,
    'sen_id' | 'sen_type' | 'ln_class' | 'ln_inst'
  >[]

  for (const sensor of sensors) {
    // 取出当前传感器所有对应的属性字段
    const attrModels = sensorAttrModelMap[generateSensorAttrModelMapKey(sensor)]
    if (attrModels == undefined) {
      logger.error(
        `执行失败，未查询到当前传感器相关的属性字段，lnClass: ${sensor.ln_class}, senType: ${sensor.sen_type}`
      )
      exit(1)
    }

    // 这里有一个 bug，在存入 lnTemplateMap 的时候，使用的是 lnTemplate 中的 ln_inst 作为 key，但是这个始终都是第一组
    // 后面实际生成的 sensor 存入数据库后，组就不一定是第一组了，所以计算 key 的时候，需要将组先重置为第一组
    const lnTemplate =
      lnTemplateMap[
        createSensorKey({
          ln_class: sensor.ln_class,
          sen_type: sensor.sen_type,
          // 将组重置为 1，也就是 10x 这种形式
          ln_inst: (100 + (Number(sensor.ln_inst) % 100)).toString()
        })
      ]

    // const ln_inst = `${logicDeviceId * 100 + (Number(lnTemplate.ln_inst) % 100)}`
    // sensor 的 ln_inst 生成的时候，其实就是用第几组 * 100 在加上模版中的 ln_inst 除 100 的余数
    // 所以这里将 sensor.ln_inst 再除以 100 并向下取整后，其实得到的就是第几组
    const sensorGroup = Math.floor(Number(sensor.ln_inst) / 100)

    // 取出当前组对应的逻辑设备中的 ip 和 port
    const ldIpAndPort = LDGroupMap[sensorGroup]

    // 混合 LN 模版 和 LD 设备的信息， 后面从这个 map 中取传感器属性对应的值
    const newLnTemplate = { ...lnTemplate, ...ldIpAndPort }

    for (const attrModel of attrModels) {
      // 属性字段名
      const attrKey = attrModel.attr as keyof LNTemplateFromExcel
      // 如果从模版中没有取到的话，就使用默认值
      const value = `${newLnTemplate[attrKey] || attrModel.attr_def_val}`
      sensorAttrsWait2Insert.push({
        sen_id: sensor.sen_id,
        key: attrKey,
        value
      })
    }
  }

  const sensorAttrInsertSql = db.prepare(
    'insert into sen_attr_tbl (sen_id, key, value) values (@sen_id, @key, @value)'
  )
  db.transaction((rows) => {
    for (const row of rows) {
      sensorAttrInsertSql.run(row)
    }
  })(sensorAttrsWait2Insert)
  ora().succeed(
    `sen_attr_tbl 表数据插入完成，共 ${sensorAttrsWait2Insert.length} 条数据`
  )

  copySync(outputFileTmpPath, outputFilePath)
  // 删除临时文件
  removeSync(outputFileTmpPath)

  logger.divider('生成数据库文件结束')
  logger.success(`数据库文件生成成功，路径：${outputFilePath}`)
}

const generateSensorAttrModelMapKey = (item: {
  ln_class: string
  sen_type: string
}) => `${item.ln_class}_${item.sen_type}`

const createSensorKey = (item: {
  ln_class: string
  sen_type: string
  ln_inst: string
}) => `${item.ln_class}_${item.sen_type}_${item.ln_inst}`

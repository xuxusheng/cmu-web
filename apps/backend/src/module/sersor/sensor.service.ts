import { Injectable, Logger } from '@nestjs/common'
import dayjs from 'dayjs'
import { Knex } from 'knex'
import { camelCase, groupBy, omit, omitBy, pick, sortedUniq } from 'lodash'
import XLSX from 'xlsx'

import {
  BadRequestException,
  NotFoundException
} from '../core/exception/custom-exception'
import { SelectOption } from '../shared/interface/common'
import { SensorAttr, SensorReportDataEntity } from '../shared/interface/sensor'
import { CommTypeModelEntity } from '../shared/model/entity/cfg/comm-type-model.entity'
import { DoMapModelEntity } from '../shared/model/entity/cfg/do-map-model.entity'
import { LnClassModelEntity } from '../shared/model/entity/cfg/ln-class-model.entity'
import { SenAttrModelEntity } from '../shared/model/entity/cfg/sen-attr-model.entity'
import { SenAttrTblEntity } from '../shared/model/entity/cfg/sen-attr-tbl.entity'
import { SenCfgTblEntity } from '../shared/model/entity/cfg/sen-cfg-tbl.entity'
import { SenTypeModelEntity } from '../shared/model/entity/cfg/sen-type-model.entity'
import { UpdateStatusEntity } from '../shared/model/entity/ied-data/update-status.entity'
import { KnexService } from '../shared/service/knex.service'
import { isNilOrEmptyStr } from '../shared/utils/common'
import { s2c } from '../shared/utils/s2c'
import { CreateSensorDto } from './dto/create-sensor.dto'
import { GetLatestDataDto } from './dto/get-latest-data.dto'
import { GetReportDataDto } from './dto/get-report-data.dto'
import { ListSensorDto } from './dto/list-sensor.dto'
import { PageSensorDto } from './dto/page-sensor.dto'
import { UpdateSensorDto } from './dto/update-sensor.dto'

@Injectable()
export class SensorService {
  private readonly logger = new Logger(SensorService.name)

  private readonly cfgDB: Knex
  private readonly iedDataDB: Knex

  constructor(private knexSvc: KnexService) {
    this.cfgDB = this.knexSvc.getCfgDB()
    this.iedDataDB = this.knexSvc.getIedDataDB()
  }

  // ----------------------------- Create -----------------------------

  // 添加传感器
  create = async (dto: CreateSensorDto) => {
    const { sensorType, lnClass, lnInst, sAddr, descCn, commType, attrs } = dto

    // 判断短地址是否重复
    const isShortAddrExist = await this.isShortAddressExist(sAddr)

    if (isShortAddrExist) {
      throw new BadRequestException(`短地址 ${sAddr} 已存在`)
    }

    // 判断设备号是否重复
    const isLnInstExist = await this.isLnInstExist(lnInst, lnClass)

    if (isLnInstExist) {
      throw new BadRequestException(`设备类型下设备号 ${lnInst} 已存在`)
    }

    await this.cfgDB.transaction(async (trx) => {
      // 插入传感器表
      const [sensorId] = await trx<SenCfgTblEntity>('sen_cfg_tbl').insert({
        senType: sensorType,
        lnInst: lnInst,
        sAddr: sAddr,
        descCn: descCn,
        commuType: commType,
        lnClass: lnClass
      })

      // 插入传感器属性表
      await trx<SenAttrTblEntity>('sen_attr_tbl').insert(
        attrs.map(({ key, value }) => ({
          senId: sensorId,
          key,
          value
        }))
      )
    })
  }

  // ----------------------------- Update -----------------------------

  // 编辑传感器
  update = async (dto: UpdateSensorDto) => {
    const { id, sensorType, lnClass, lnInst, sAddr, descCn, commType, attrs } =
      dto

    // 判断短地址是否重复
    const isShortAddrExist = await this.isShortAddressExist(sAddr, id)

    if (isShortAddrExist) {
      throw new BadRequestException(`短地址 ${sAddr} 已存在`)
    }

    // 判断设备号是否重复
    const isLnInstExist = await this.isLnInstExist(lnInst, lnClass, id)

    if (isLnInstExist) {
      throw new BadRequestException(`设备类型下设备号 ${lnInst} 已存在`)
    }

    // 先检查传感器修改的设备类型和设备型号是否匹配
    const sensorAttrs = await this.getSensorAttrs({
      sensorType,
      lnClass
    })

    if (sensorAttrs.length === 0) {
      throw new Error('设备类型和设备型号不匹配')
    }

    // 检查通过，插数据库
    await this.cfgDB.transaction(async (trx) => {
      // 更新传感器表
      await trx<SenCfgTblEntity>('sen_cfg_tbl').where('senId', id).update({
        senType: sensorType,
        lnInst,
        sAddr,
        descCn,
        commuType: commType,
        lnClass: lnClass
      })

      // 更新传感器属性表
      await trx<SenAttrTblEntity>('sen_attr_tbl').where('senId', id).del()

      await trx<SenAttrTblEntity>('sen_attr_tbl').insert(
        attrs.map(({ key, value }) => ({
          senId: id,
          key,
          value
        }))
      )
    })
  }

  // ----------------------------- Read -----------------------------

  // 查询所有设备状态
  getAllSensorStatus = async () => {
    const rows =
      await this.iedDataDB<UpdateStatusEntity>('update_status').select()

    // 查询传感器列表
    const sensors = await this.cfgDB<SenCfgTblEntity>('sen_cfg_tbl').select()

    // 根据 sensorId 转为 map
    const sensorMap = sensors.reduce((map, sensor) => {
      map.set(sensor.senId, sensor)
      return map
    }, new Map<number, SenCfgTblEntity>())

    return (
      rows
        // 存在 update_status 表中的数据，但是却不存在与传感器表，这种数据过滤掉
        .filter(({ senId }) => sensorMap.has(senId))
        .map(({ senId, statusId, ...rest }) => ({
          id: statusId,
          sensorId: senId,
          sensorDescCn: sensorMap.get(senId)?.descCn,
          ...rest
        }))
    )
  }

  // 查询所有传感器及最后上报的数据
  getAllLatestReportData = async (dto: GetLatestDataDto) => {
    // 先查询出所有的传感器
    const query = this.cfgDB<SenCfgTblEntity>('sen_cfg_tbl')

    if (dto.descPrefixes && dto.descPrefixes.length > 0) {
      // 每个条件都前缀 like，多个 or
      query.where((builder) => {
        dto.descPrefixes.forEach((prefix) => {
          builder.orWhere('descCn', 'like', `${prefix}%`)
        })
      })
    }

    const sensors = await query.select()

    // 根据 lnClass 字段，将 sensors 聚合分组
    const sensorGroup = groupBy(sensors, 'lnClass')

    // 不同的设备类型 lnClass，数据存在不同的表中，所以需要分开查询
    const dataMap = (
      await Promise.all(
        // 每一组 sensor 分开查询，最后将结果汇总
        Object.entries(sensorGroup).map(async ([lnClass, sensors]) => {
          const tableName = `update_${lnClass.toLowerCase()}`

          // 判断表是否存在
          const isTableExist = await this.iedDataDB.schema.hasTable(tableName)

          if (!isTableExist) {
            return []
          }

          const data = await this.iedDataDB<SensorReportDataEntity>(tableName)
            .whereIn(
              'lnInst',
              sensors.map(({ lnInst }) => Number(lnInst))
            )
            .select()

          return data.map((v) => ({ ...v, lnClass }))
        })
      )
    )
      .flat()
      // 根据 lnInst 字段，构造一个 map，方便后面组装数据
      .reduce((map, data) => {
        map.set(`${data.lnClass}-${data.lnInst}`, data)
        return map
      }, new Map<string, SensorReportDataEntity & Pick<SenCfgTblEntity, 'lnClass'>>())

    // 再查询出所有设备类型的传感器分别对应的字段
    const fieldMap = (
      await this.cfgDB<DoMapModelEntity>('do_map_model').select()
    )
      // 根据 lnClass 和 doName（字段名）构造 Map，方便后面查询字段信息
      .reduce((map, field) => {
        map.set(`${field.lnClass}-${camelCase(field.doName)}`, field)
        return map
      }, new Map<string, DoMapModelEntity>())

    // 组装数据
    return sensors.map((sensor) => {
      const data = dataMap.get(`${sensor.lnClass}-${sensor.lnInst}`)

      const { senId, senType, commuType, ...sensorRest } = sensor

      if (!data) {
        // 没有找到此传感器对应的数据
        return {
          id: senId,
          sensorType: senType,
          commType: commuType,
          ...sensorRest,
          latestReportTime: null,
          latestReportData: []
        }
      }

      // 移除 data 中非上报的数据字段
      const dataRest = omit(data, [
        'dataId',
        'des',
        'lnInst',
        'dataTime',
        'lnClass'
      ])

      return {
        id: senId,
        sensorType: senType,
        commType: commuType,
        ...sensorRest,
        latestReportTime: data.dataTime,
        latestReportData: Object.entries(dataRest).map(([key, value]) => {
          const field = fieldMap.get(`${sensor.lnClass}-${key}`)

          if (!field) {
            this.logger.error(
              `传感器 ${sensor.senId} 上报的数据有这个字段 ${key}，但是字典表中确没有这个字段`
            )
            return {
              key,
              label: key,
              value
            }
          }

          // 移除不需要返回的字段
          const rest = omit(field, ['doId', 'lnClass', 'doName', 'descCn'])
          return {
            key,
            label: field.descCn,
            value,
            ...rest
          }
        })
      }
    })
  }

  // 查询指定设备所有数据
  getReportDataById = async (id: number, dto: GetReportDataDto = {}) => {
    const { reportTimeBegin, reportTimeEnd, orderBy, orderSort } = dto

    const sensor = await this.getById(id)

    if (!sensor) {
      throw new NotFoundException(`ID 为 ${id} 的传感器不存在`)
    }

    // 不同 lnClass 设备的数据存在不同的表中

    // 先判断一下表是否存在
    const tableName = `data_${sensor.lnClass}`.toLowerCase()

    // 表名是大写的情况下，不管怎么判断都是不存在？？？？？
    // const isTableExist = await this.iedDataDB.schema.hasTable(tableName)

    //
    // if (!isTableExist) {
    //   throw new InternalServerErrorException(
    //     `数据表 ${tableName} 不存在，请联系管理员`
    //   )
    // }

    const queryBuilder = this.iedDataDB<SensorReportDataEntity>(tableName)
      .where('lnInst', sensor.lnInst)
      .andWhere((builder) => {
        if (reportTimeBegin) {
          builder.where(
            'dataTime',
            '>=',
            dayjs(reportTimeBegin).startOf('day').format('YYYY-MM-DD HH:mm:ss')
          )
        }

        if (reportTimeEnd) {
          // 这里需要注意一下，sqlite 中查询时，如果不带时分秒的话，默认是零点，会匹配不当前的数据！
          builder.where(
            'dataTime',
            '<=',
            dayjs(reportTimeEnd).endOf('day').format('YYYY-MM-DD HH:mm:ss')
          )
        }
      })
      .orderBy(orderBy || 'dataTime', orderSort || 'desc')

    if (orderBy) {
      queryBuilder.orderBy(orderBy, orderSort)
    }

    const rows = await queryBuilder.select()

    return rows.map((row) => {
      // 移除部分非数据字段
      const rest = omit(row, ['dataId', 'des', 'lnInst', 'dataTime', 'lnClass'])
      return {
        id: row.dataId,
        reportTime: row.dataTime,
        ...rest
      }
    })
  }

  // 查询指定设备类型上报数据字段
  getReportDataFieldsByLnClass = async (lnClass: string) => {
    const rows = await this.cfgDB<DoMapModelEntity>('do_map_model').where(
      'lnClass',
      lnClass
    )

    return rows.map((row) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { doId, doName, descCn, lnClass, ...rest } = row
      return {
        id: doId,
        key: doName,
        label: descCn,
        ...rest
      }
    })
  }

  // 查询指定设备 ID 上报数据字段
  getReportDataFields = async (sensorId: number) => {
    const sensor = await this.getById(sensorId)

    if (!sensor) {
      throw new NotFoundException(`ID 为 ${sensorId} 的传感器不存在`)
    }

    return this.getReportDataFieldsByLnClass(sensor.lnClass)
  }

  // 查询设备类型可选项
  getLnClassOptions = async (): Promise<SelectOption[]> => {
    const rows = await this.cfgDB<LnClassModelEntity>('ln_class_model').select()
    return rows.map((row) => ({
      label: row.descCn,
      value: row.lnClass
    }))
  }

  // 查询设备型号可选项
  getSensorTypeOptions = async (lnClass?: string): Promise<SelectOption[]> => {
    const rows = await this.cfgDB<SenTypeModelEntity>('sen_type_model').select()

    // 如果未指定设备类型，则返回所有设备型号
    if (!lnClass) {
      return rows.map((row) => ({
        label: row.senType,
        value: row.senType
      }))
    }

    // 如果指定了设备类型，需要查询一下哪些设备型号是该设备类型下的
    // 以 lnClass 为条件，从 sen_attr_model 表中查询 sen_type 字段 并去重
    const sensorTypes = (
      await this.cfgDB<SenAttrModelEntity>('sen_attr_model')
        .where('lnClass', lnClass)
        .distinct('senType')
    ).map(({ senType }) => senType)

    return rows
      .filter((row) => sensorTypes.includes(row.senType))
      .map((row) => ({
        label: row.senType,
        value: row.senType
      }))
  }

  // 查询通信类型可选项
  getCommTypeOptions = async (): Promise<SelectOption<number>[]> => {
    const rows =
      await this.cfgDB<CommTypeModelEntity>('commu_type_model').select()
    return rows.map((row) => ({
      label: row.commuTypeCn,
      value: row.commuType
    }))
  }

  // 查询设备描述前缀可选项
  async getDescPrefixOptions() {
    // 查询出所有传感器的 descCn 字段，然后提取前缀出来
    const descList =
      await this.cfgDB<SenCfgTblEntity>('sen_cfg_tbl').distinct('descCn')

    return sortedUniq(
      descList.map(({ descCn }) => {
        // 提取规则为先通过 | 分割，取出第一串字符，然后将最后一个 _ 符号及后面的字符移除
        return descCn.split('|')[0].split('_').slice(0, -1).join('_')
      })
    )
  }

  // 查询指定设备类型和设备型号的属性字段
  getSensorAttrs = async (data: {
    sensorType: string
    lnClass: string
  }): Promise<SensorAttr[]> => {
    const rows = await this.cfgDB<SenAttrModelEntity>('sen_attr_model')
      .where({
        senType: data.sensorType,
        lnClass: data.lnClass
      })
      .select()

    return rows.map(({ attr, descCn, attrDefVal }) => ({
      key: attr,
      label: descCn,
      defaultValue: attrDefVal
    }))
  }

  // 查询所有设备类型和设备型号对应的属性字段
  getAllSensorAttrs = async (): Promise<
    {
      lnClass: string
      sensorType: string
      attrs: SensorAttr[]
    }[]
  > => {
    const rows = await this.cfgDB<SenAttrModelEntity>('sen_attr_model').select()

    // 通过 ln_class 和 sen_type 分组
    const grouped = groupBy(
      rows,
      ({ lnClass, senType }) => `${lnClass},${senType}`
    )

    return Object.entries(grouped).map(([key, value]) => {
      const [lnClass, senType] = key.split(',')
      return {
        lnClass,
        sensorType: senType,
        attrs: value.map(({ attr, descCn, attrDefVal }) => ({
          key: attr,
          label: descCn,
          defaultValue: attrDefVal
        }))
      }
    })
  }

  // 判断短地址是否已存在
  isShortAddressExist = async (
    shortAddr: string,
    excludeId?: number
  ): Promise<boolean> => {
    const [{ count }] = await this.cfgDB<SenCfgTblEntity>('sen_cfg_tbl')
      .where((builder) => {
        builder.where('sAddr', shortAddr)

        if (excludeId) {
          builder.andWhereNot('senId', excludeId)
        }
      })
      .count()

    return (count as number) > 0
  }

  // 判断设备号是否已存在
  isLnInstExist = async (
    lnInst: string, // 设备号
    lnClass: string, // 设备类型
    excludeId?: number
  ): Promise<boolean> => {
    const [{ count }] = await this.cfgDB<SenCfgTblEntity>('sen_cfg_tbl')
      .where((builder) => {
        // 相同设备类型下，设备号不允许重复
        builder.where('lnInst', lnInst).where('lnClass', lnClass)

        if (excludeId) {
          builder.andWhereNot('senId', excludeId)
        }
      })
      .count()

    return (count as number) > 0
  }

  page = async (dto: PageSensorDto) => {
    const { ps, pn, lnClass, sensorType, commType } = dto

    const where = omitBy(
      {
        lnClass,
        senType: sensorType,
        commuType: commType
      },
      isNilOrEmptyStr
    )

    const [{ count }] = await this.cfgDB<SenCfgTblEntity>('sen_cfg_tbl')
      .where(where)
      .count()

    const items = await this.cfgDB<SenCfgTblEntity>('sen_cfg_tbl')
      .where(where)
      .limit(ps)
      .offset((pn - 1) * ps)
      .orderBy('senId', 'desc')
      .select()

    return {
      total: count as number,
      items: items.map(({ senId, senType, commuType, ...rest }) => ({
        ...rest,
        id: senId,
        sensorType: senType,
        commType: commuType
      })),
      ps,
      pn
    }
  }

  getByIdWithAttrs = async (id: number) => {
    const sensor = await this.getById(id)

    const attrs = await this.cfgDB<SenAttrTblEntity>('sen_attr_tbl')
      .where('senId', id)
      .select()

    return {
      ...sensor,
      attrs: attrs.map((attr) => pick(attr, ['key', 'value']))
    }
  }

  // 查询指定传感器
  getById = async (id: number) => {
    const sensor = await this.cfgDB<SenCfgTblEntity>('sen_cfg_tbl')
      .where('senId', id)
      .first()

    if (!sensor) {
      throw new NotFoundException('传感器不存在')
    }

    const { senId, senType, commuType, ...rest } = sensor

    return {
      ...rest,
      id: senId,
      sensorType: senType,
      commType: commuType
    }
  }

  // 查询设备列表
  list = async (dto: ListSensorDto) => {
    const rows = await this.cfgDB<SenCfgTblEntity>('sen_cfg_tbl')
      .where((builder) => {
        if (dto.descCn) {
          builder.where('descCn', 'like', `%${dto.descCn}%`)
        }
        if (dto.lnClass) {
          builder.where('lnClass', dto.lnClass)
        }
      })
      .orderBy('senId', 'desc')
      .select()

    // 查询设备类型
    const lnClassMap = (
      await this.cfgDB<LnClassModelEntity>('ln_class_model').select()
    ).reduce((map, row) => {
      map.set(row.lnClass, row.descCn)
      return map
    }, new Map<string, string>())

    return rows.map((row) => {
      const { senId, senType, commuType, ...rest } = row

      return {
        id: senId,
        lnClassNameCn: lnClassMap.get(row.lnClass), // 设备类型中文名
        sensorType: senType,
        sensorTypeNameCn: senType, // 设备型号中文名，数据库中暂时没有这个字段
        commType: commuType,
        ...rest
      }
    })
  }

  exportReportData = async (
    id: number
  ): Promise<{
    filename: string
    buffer: Buffer
  }> => {
    // 查询传感器
    const sensor = await this.getById(id)

    // 查询传感器对应的上报数据字段信息
    const fields = await this.getReportDataFieldsByLnClass(sensor.lnClass)

    // 查询传感器对应的上报数据
    const reportData = await this.getReportDataById(id)

    // 构造 excel 中数据
    const rows: (string | number)[][] = [
      ['数据 ID', '上报时间'].concat(fields.map(({ label }) => label))
    ]

    reportData.forEach((data) => {
      rows.push([
        data.id,
        data.reportTime,
        ...fields.map(({ key }) => data[s2c(key)])
      ])
    })

    // 构造 excel 文件
    const sheet = XLSX.utils.aoa_to_sheet(rows)
    const book = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(book, sheet, 'Sheet1')
    const buffer = XLSX.write(book, { type: 'buffer' })

    const filename = `历史上报数据-${sensor.descCn}.xlsx`

    return {
      filename,
      buffer
    }
  }

  // ----------------------------- Delete -----------------------------
  delete = async (id: number) => {
    await this.cfgDB.transaction(async (trx) => {
      // 删除传感器表
      await trx<SenCfgTblEntity>('sen_cfg_tbl').where('senId', id).del()

      // 删除传感器属性表
      await trx<SenAttrTblEntity>('sen_attr_tbl').where('senId', id).del()
    })
  }
}

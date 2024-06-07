import { Injectable, Logger } from '@nestjs/common'
import dayjs from 'dayjs'
import { Knex } from 'knex'
import { omit } from 'lodash'
import {
  BadRequestException,
  InternalServerErrorException
} from '../../core/exception/custom-exception'
import { I2ConfigService } from '../../i2/i2-config.service'
import { I2SensorService } from '../../i2/i2-sensor.service'
import { SensorService } from '../../sersor/sensor.service'
import { Page } from '../../shared/interface/page'
import { SensorReportDataEntity } from '../../shared/interface/sensor'
import { I2ParamgroupTblEntity } from '../../shared/model/entity/cfg-i2/i2-paramgroup-tbl.entity'
import { KnexService } from '../../shared/service/knex.service'
import { s2c } from '../../shared/utils/s2c'
import { OpenapiI2SensorDataPageDto } from '../dto/openapi-i2-sensor-data-page.dto'
import { OpenapiI2SensorPageDto } from '../dto/openapi-i2-sensor-page.dto'
import { OpenapiI2SensorPageVo } from '../vo/openapi-i2-sensor-page.vo'

@Injectable()
export class OpenapiI2Service {
  private readonly logger = new Logger(OpenapiI2Service.name)

  private readonly i2DB = this.knexSvc.getCfgI2DB()
  private readonly cfgDB = this.knexSvc.getCfgDB()
  private readonly iedDataDB = this.knexSvc.getIedDataDB()

  constructor(
    private knexSvc: KnexService,
    private i2SensorService: I2SensorService,
    private i2ConfigService: I2ConfigService,
    private sensorService: SensorService
  ) {}

  i2SensorPage = async (
    dto: OpenapiI2SensorPageDto
  ): Promise<Page<OpenapiI2SensorPageVo>> => {
    const { pn, ps } = dto
    const { total, items } = await this.i2SensorService.page({
      pn,
      ps
    })

    const cac = await this.i2ConfigService.getCac()

    return {
      pn,
      ps,
      total,
      items: items.map((i2Sensor) => ({
        linkedStationCode: cac.cacId,
        equipmentCode: i2Sensor.equipmentId,
        sensorCode: i2Sensor.code,
        sensorName: i2Sensor.descCn,
        sensorMonitorType: i2Sensor.groupName,
        phase: i2Sensor.phaseName
      }))
    }
  }

  i2SensorDataPage = async (dto: OpenapiI2SensorDataPageDto) => {
    const { pn, ps, sensorCode, startTime, endTime } = dto

    // 通过 sensorCode 可以定位到唯一传感器
    const i2Sensor = await this.i2SensorService.getBySensorCode(sensorCode)

    if (!i2Sensor) {
      throw new BadRequestException(`编码为 ${sensorCode} 的 I2 传感器不存在`)
    }

    if (!i2Sensor.lnClass || !i2Sensor.lnInst) {
      throw new InternalServerErrorException().setErrDebug(
        `传感器 lnClass 或 lnInst 字段不存在，请联系管理员，数据：${JSON.stringify(
          i2Sensor
        )}`
      )
    }

    // 通过设备编号和设备类型，就可以唯一定位到一个传感器
    const lnInst = i2Sensor.lnInst
    const lnClass = i2Sensor.lnClass

    // 不同设备类型的数据存在不同的表中，需要构造一下表名
    const tableName = `data_${lnClass}`.toLowerCase()

    const where: Knex.QueryCallback<SensorReportDataEntity> = (builder) => {
      builder.where('lnInst', lnInst)

      if (startTime) {
        builder.where(
          'dataTime',
          '>=',
          dayjs(startTime).format('YYYY-MM-DD HH:mm:ss')
        )
      }

      if (endTime) {
        builder.where(
          'dataTime',
          '<=',
          dayjs(endTime).format('YYYY-MM-DD HH:mm:ss')
        )
      }
    }

    const [{ count }, items] = await Promise.all([
      this.iedDataDB(tableName).where(where).count().first(),
      this.iedDataDB<SensorReportDataEntity>(tableName)
        .where(where)
        .limit(ps)
        .offset((pn - 1) * ps)
        .orderBy('dataTime', 'desc')
        .select()
    ])

    // 查询当前设备类型对应的所有上报数据字段
    const fields =
      await this.sensorService.getReportDataFieldsByLnClass(lnClass)

    // 上报的数据对外的映射字段
    const fieldOutputMap: Map<string, string> = (
      await this.i2DB<I2ParamgroupTblEntity>('i2_paramgroup_tbl').where(
        'groupId',
        i2Sensor.groupId
      )
    ).reduce((map, item) => {
      map.set(item.paramCode, item.paramName)
      return map
    }, new Map<string, string>())

    return {
      pn,
      ps,
      total: count,
      // 每条上报的数据，都是 k-v 这种形式，不方便阅读，需要转换一下
      items: items.map((data) => {
        // 将非采集数据的字段移除
        const rest = omit(data, [
          'dataId',
          'des',
          'lnInst',
          'dataTime',
          'lnClass'
        ])

        // 将 k-v 结构转换成对象数组
        const dataList = fields
          .filter((field) => {
            // 如果这个字段没有配置对外转换的规则，就不用对外传输了
            return !!fieldOutputMap.get(field.key)
          })
          .map((field) => {
            return {
              key: fieldOutputMap.get(field.key),
              value: rest[s2c(field.key)],
              label: field.label,
              unit: field.unit
            }
          })

        return {
          equipmentCode: i2Sensor.equipmentId, // 设备编码
          sensorCode: i2Sensor.code, // 传感器编码
          sensorName: i2Sensor.descCn, // 传感器名称
          acquisitionTime: data.dataTime, // 采集时间
          phase: i2Sensor.phaseName, // 相别
          dataList
        }
      })
    }
  }
}

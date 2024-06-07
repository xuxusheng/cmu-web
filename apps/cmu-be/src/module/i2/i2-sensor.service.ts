import { Injectable, Logger } from '@nestjs/common'
import { map, uniq } from 'lodash'
import { NotFoundException } from '../core/exception/custom-exception'
import { I2GroupTblEntity } from '../shared/model/entity/cfg-i2/i2-group-tbl.entity'
import { I2SensorTblEntity } from '../shared/model/entity/cfg-i2/i2-sensor-tbl.entity'
import { PhaseTblEntity } from '../shared/model/entity/cfg-i2/phase-tbl.entity'
import { SenCfgTblEntity } from '../shared/model/entity/cfg/sen-cfg-tbl.entity'
import { KnexService } from '../shared/service/knex.service'
import { I2SensorDto } from './dto/i2-sensor.dto'
import { PageI2SensorDto } from './dto/page-i2-sensor.dto'

@Injectable()
export class I2SensorService {
  private readonly logger = new Logger(I2SensorService.name)

  private readonly i2DB = this.knexSvc.getCfgI2DB()
  private readonly cfgDB = this.knexSvc.getCfgDB()

  constructor(private knexSvc: KnexService) {}

  create = async (dto: I2SensorDto) => {
    const { code, dataUploadPeriod, nextDataUploadTime, phaseId, ...rest } = dto

    // 判断所选分组是否存在
    await this.isGroupExists(dto.groupId, true)

    // 判断所选相别是否存在
    await this.isPhaseExists(dto.phaseId, true)

    return this.i2DB<I2SensorTblEntity>('i2_sensor_tbl').insert({
      ...rest,
      sensorCode: code,
      datauploadPeriod: dataUploadPeriod,
      nextDatauploadTime: nextDataUploadTime,
      phase: phaseId
    })
  }

  update = async (id: number, dto: I2SensorDto) => {
    const { code, dataUploadPeriod, nextDataUploadTime, phaseId, ...rest } = dto

    // 判断所选分组是否存在
    await this.isGroupExists(dto.groupId, true)

    // 判断所选相别是否存在
    await this.isPhaseExists(dto.phaseId, true)

    return this.i2DB<I2SensorTblEntity>('i2_sensor_tbl')
      .where('sensorId', id)
      .update({
        ...rest,
        sensorCode: code,
        datauploadPeriod: dataUploadPeriod,
        nextDatauploadTime: nextDataUploadTime,
        phase: phaseId
      })
  }

  // 查询 I2 传感器
  getById = async (id: number) => {
    const sensor = await this.i2DB<I2SensorTblEntity>('i2_sensor_tbl')
      .where('sensorId', id)
      .first()

    if (!sensor) {
      throw new NotFoundException(`ID 为 ${id} 的 I2 传感器配置不存在`)
    }

    // 将相别查出来
    const phase = await this.i2DB<PhaseTblEntity>('phase_tbl')
      .where('phaseId', sensor.phase)
      .first()

    // 将 group 查出来
    const group = await this.i2DB<I2GroupTblEntity>('i2_group_tbl')
      .where('groupId', sensor.groupId)
      .first()

    const {
      sensorId,
      sensorCode,
      datauploadPeriod,
      nextDatauploadTime,
      phase: phaseId,
      ...rest
    } = sensor

    return {
      ...rest,
      id: sensorId,
      code: sensorCode,
      dataUploadPeriod: datauploadPeriod,
      nextDataUploadTime: nextDatauploadTime,
      phaseId,
      phaseName: phase.phaseName,
      groupName: group.groupName,
      lnClass: group.lnName
    }
  }

  getBySensorCode = async (sensorCode: string) => {
    const sensorId = await this.getIdBySensorCode(sensorCode)
    if (!sensorId) {
      throw new NotFoundException(`编码为 ${sensorCode} 的 I2 传感器不存在`)
    }

    return this.getById(sensorId)
  }

  getIdBySensorCode = async (sensorCode: string) => {
    const sensor = await this.i2DB<I2SensorTblEntity>('i2_sensor_tbl')
      .where('sensorCode', sensorCode)
      .select('sensorId')
      .first()
    return sensor?.sensorId
  }

  // 查询 I2 传感器列表
  list = async () => {
    // 偷个懒，直接复用分页查询
    const { items } = await this.page({
      pn: 1,
      ps: 999999
    })
    return items
  }

  // 查询 I2 传感器列表（分页）
  page = async (dto: PageI2SensorDto) => {
    const { pn, ps } = dto

    const [{ count }] =
      await this.i2DB<I2SensorTblEntity>('i2_sensor_tbl').count()

    const i2Sensors = await this.i2DB<I2SensorTblEntity>('i2_sensor_tbl')
      .limit(ps)
      .offset((pn - 1) * ps)
      .orderBy('sensorId', 'desc')
      .select()

    // 查询所有分组，in 查询
    const groups = await this.i2DB<I2GroupTblEntity>('i2_group_tbl').whereIn(
      'groupId',
      uniq(map(i2Sensors, 'groupId'))
    )
    const groupMap = groups.reduce((map, group) => {
      map.set(group.groupId, group)
      return map
    }, new Map<number, I2GroupTblEntity>())

    // 查询所有相别，in 查询
    const phases = await this.i2DB<PhaseTblEntity>('phase_tbl').whereIn(
      'phaseId',
      uniq(map(i2Sensors, 'phase'))
    )
    const phaseMap = phases.reduce((map, phase) => {
      map.set(phase.phaseId, phase)
      return map
    }, new Map<number, PhaseTblEntity>())

    // 根据 sensor 的 lnClass 和组中的 lnClass 查询传感器表
    const sensors = await this.cfgDB<SenCfgTblEntity>('sen_cfg_tbl').whereIn(
      ['lnClass', 'lnInst'],
      i2Sensors.map(({ lnInst, groupId }) => {
        const group = groupMap.get(groupId)
        return [group.lnName, lnInst]
      })
    )
    const sensorMap = sensors.reduce((map, sensor) => {
      // 用 lnClass 和 lnInst 作为 key
      const key = `${sensor.lnClass}-${sensor.lnInst}`
      map.set(key, sensor)
      return map
    }, new Map<string, SenCfgTblEntity>())

    const items = i2Sensors.map(
      ({
        sensorId,
        sensorCode,
        datauploadPeriod,
        nextDatauploadTime,
        phase: phaseId,
        ...rest
      }) => {
        const group = groupMap.get(rest.groupId)
        const phase = phaseMap.get(phaseId)
        const sensor = sensorMap.get(`${group.lnName}-${rest.lnInst}`)

        return {
          ...rest,
          id: sensorId,
          code: sensorCode,
          dataUploadPeriod: datauploadPeriod,
          nextDataUploadTime: nextDatauploadTime,
          groupName: group.groupName,
          phaseName: phase.phaseName,
          sensorDescCn: sensor?.descCn || ''
        }
      }
    )

    return {
      total: count,
      items,
      pn,
      ps
    }
  }

  delete = (id: number) =>
    this.i2DB<I2SensorTblEntity>('i2_sensor_tbl').where('sensorId', id).delete()

  // 查询 I2 传感器分组
  getAllGroup = async () => {
    const rows = await this.i2DB<I2GroupTblEntity>('i2_group_tbl').select()

    return rows.map((row) => ({
      id: row.groupId,
      name: row.groupName,
      code: row.groupCode,
      lnClass: row.lnName // 设备类型
    }))
  }

  isGroupExists = async (groupId: number, throwError = false) => {
    const group = await this.i2DB<I2GroupTblEntity>('i2_group_tbl')
      .where('groupId', groupId)
      .first()

    if (throwError && !group) {
      throw new NotFoundException(`ID 为 ${groupId} 的分组不存在`)
    }

    return !!group
  }

  // 查询 I2 传感器相别
  getAllPhase = async () => {
    const rows = await this.i2DB<PhaseTblEntity>('phase_tbl').select()

    return rows.map((row) => ({
      id: row.phaseId,
      name: row.phaseName
    }))
  }

  isPhaseExists = async (phaseId: number, throwError = false) => {
    const phase = await this.i2DB<PhaseTblEntity>('phase_tbl')
      .where('phaseId', phaseId)
      .first()

    if (throwError && !phase) {
      throw new NotFoundException(`ID 为 ${phaseId} 的相别不存在`)
    }

    return !!phase
  }
}

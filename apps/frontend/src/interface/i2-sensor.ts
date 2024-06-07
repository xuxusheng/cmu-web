export interface I2Sensor {
  id: number // 自增 ID

  code: string // 传感器编码

  lnInst: string // 传感器编号

  groupId: number // 分组 ID

  equipmentId: string // 一次设备编码

  descCn: string // i2 设备描述

  dataUploadPeriod: number // 数据上传周期

  nextDataUploadTime: string // 时间

  phaseId: number // 相别
}

export interface I2SensorPageVO {
  id: number
  lnInst: string // 设备号
  descCn: string
  deviceId: string
  equipmentId: string
  code: string
  dataUploadPeriod: number
  nextDataUploadTime: string
  groupName: string
  phaseName: string
  sensorDescCn: string
}

export type CreateI2SensorDto = Omit<I2Sensor, 'id'>

export type UpdateI2SensorDto = I2Sensor

export interface I2Group {
  id: number
  code: string
  name: string
  lnClass: string // 设备类型
}

export interface I2Phase {
  id: number
  name: string
}

export interface I2SensorTblEntity {
  sensorId: number // 自增 ID

  sensorCode: string // 传感器编码

  lnInst: string // 传感器名称

  groupId: number // 分组 ID

  equipmentId: string // 一次设备编码

  descCn: string // i2 设备描述

  datauploadPeriod: number // 数据上传周期

  nextDatauploadTime: string // 时间

  phase: number // 相别

  deviceId: string
}

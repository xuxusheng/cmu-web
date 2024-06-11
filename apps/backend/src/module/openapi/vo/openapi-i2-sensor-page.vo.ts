export interface OpenapiI2SensorPageVo {
  // 所属站编码
  // 取 cac 配置的 cac 编码
  linkedStationCode: string

  // 设备名称
  // equipmentName: string

  // 设备编码
  // 取 i2_sensor 中的【一次设备编码】字段
  equipmentCode: string

  // equipmentType: string // 设备类型

  // 传感器编码
  // 取 i2_sensor 中的【传感器编码】字段
  sensorCode: string

  // 传感器名称
  // 取 i2_sensor 中的 【i2 设备描述】字段
  sensorName: string

  // 传感器监测类型
  // 取 i2_sensor 中的 group_id 对应的 group_name
  sensorMonitorType: string

  // 相别
  // 取 i2_sensor 中的 phase_id 对应的值
  phase: string
}

export interface Sensor {
  id: number
  lnClass: string // 设备类型
  sensorType: string // 设备型号
  commType: number // 通信类型
  lnInst: string // 设备号
  sAddr: string // 短地址
  descCn: string // 设备描述
}

export interface SensorAttr {
  key: string // 属性字段名
  label: string // 属性中文名
  defaultValue: string // 属性默认值
}

// 传感器上报的数据类型
export interface SensorReportDataEntity {
  dataId: number // 自增 ID
  lnInst: number // 设备号
  des: string
  dataTime: string // 数据上报时间
  [key: string]: unknown // 其他数据
}

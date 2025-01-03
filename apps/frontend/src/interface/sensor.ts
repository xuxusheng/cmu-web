export interface Sensor {
  commu_type: number
  commu_type_cn: string // 通信类型
  desc_cn: string // 设备描述
  ln_class: string
  ln_inst: number // 设备号
  s_addr: string // 短地址
  sen_id: number
  sen_type: string // 设备型号
  attrs: {
    attr: string
    value: string
  }[]
}

export interface SensorStatus {
  id: number // 自增 ID
  sensorId: number // 传感器 ID
  sensorDescCn: string // 设备描述
  sAddr: string // 设备短地址
  dataTime: Date // YYYY-MM-DD HH:mm:ss
  movDevConf: number // 通信异常 0:正常 1:预警 2:告警 -1:未知
  supDevRun: number // 运行异常
  dataStatus: number // 数据异常
  almIgnored: number // 告警是否忽略
}

// 传感器上报数据字段信息
export interface SensorReportDataField {
  key: string // 字段名
  label: string // 字段标签
  cdcTypeId: number
  doOrder: number
  shortAddr: number
  importLevel: number
  unit: string // 单位
  precision: number
  ratio: string
}

// 传感器上报数据
export interface SensorReportData {
  id: number
  reportTime: string

  [key: string]: string | number
}

export interface SensorVO {
  id: number
  lnClass: string
  lnClassNameCn: string // 设备类型中文名
  sensorType: string
  sensorTypeNameCn: string // 设备型号英文名
  lnInst: string
  sAddr: string
  descCn: string
  commType: number
  attrs: {
    key: string
    value: string
  }[]
}

// 传感器具备的属性
export interface SensorAttr {
  key: string // 属性字段名
  label: string // 属性中文名
  defaultValue: string // 属性默认值
}

export interface SensorBasicStatus {
  attrs: Array<{
    attr: string
    descCn: string
    value: string
  }>
  commuType: number
  commuTypeCn: string
  descCn: string
  lnClass: string
  lnClassCn: string
  lnInst: string
  sAddr: string
  senId: number
  senType: string
}

export interface SensorRealtimeStatus {
  CGAmp: number
  CGAmpAlm: number
  CGAmpAlmThd: number
  DisRecomm: number
  MoDevConf: number
  RunStatus: 1
  dataTime: string
  senId: number
}

export interface CreateSensorDto {
  lnClass: string // 设备类型
  sensorType: string // 设备型号
  commType: number // 通信类型
  descCn: string // 设备描述
  lnInst: string // 设备号
  sAddr: string // 短地址
  attrs: Array<{
    key: string // 属性字段名
    value: string // 属性值
  }>
}

export type UpdateSensorDto = CreateSensorDto & {
  id: number
}

export interface PageSensorDto {
  pn: number
  ps: number
  lnClass?: string // 设备类型
  sensorType?: string // 设备型号
  commType?: number // 通信类型
}

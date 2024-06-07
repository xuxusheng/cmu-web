// 存放了传感器上报的数据字段
export interface DoMapModelEntity {
  doId: number

  lnClass: string // 设备类型

  doName: string // 字段名，在 ied_data 数据库的 data_xxx 表中，会作为列名来存放数据

  descCn: string // 字段描述

  cdcTypeId: number

  doOrder: number

  shortAddr: number

  importLevel: number // 是否展示

  unit: string // 单位

  precision: number

  ratio: number
}

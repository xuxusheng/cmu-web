// 存放了传感器监测的数据被上报时，使用的 key 的转换规则
export interface I2ParamgroupTblEntity {
  i2ParamgroupId: number // 自增 ID

  groupId: number // group 表中的 id，其实业务上就是对应某个 lnClass

  // 字段 key，对应的就是 do_model 表中定义的 doName，也就是采集上来的数据的字段
  // 在 ied_data 数据库中，data_xxx 表中的那些存数据的列名
  paramCode: string

  // 对外输出时使用的 key 名
  paramName: string

  parmaAlmName: string

  rate: number

  dataType: number
}

// 传感器属性字段值表
export interface SenAttrTblEntity {
  sen_id: number

  key: string

  value: string
}

// 传感器属性字段表
export interface SenAttrModelEntity {
  ln_class: string // 设备类型

  sen_type: string // 设备型号

  attr: string // 字段名

  desc_cn: string // 字段中文名

  attr_def_val: string // 字段默认值
}

// 传感器表
export interface SenCfgTblEntity {
  sen_id: number

  sen_type: string

  ln_class: string

  ln_inst: string

  s_addr: string

  commu_type: number

  desc_cn: string
}

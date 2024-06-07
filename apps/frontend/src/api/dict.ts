export interface Root {
  // 设备型号
  map_sen_type: MapSenType[]
  // 设备类型
  map_ln_class: MapLnClass[]
  // 通信类型
  map_commu_type: MapCommuType[]
  map_phase: MapPhase[]
  map_sen_attr: MapSenAttr[]
  map_sen_debug: MapSenDebug[]
  map_cdc_type: MapCdcType[]
  map_i2_group: MapI2Group[]
  map_i2_debug: MapI2Debug[]
  map_i2_data_type: MapI2DataType[]
}

export interface MapSenType {
  value: string
  label: string
}

export interface MapLnClass {
  value: string
  label: string
}

export interface MapCommuType {
  value: number
  label: string
}

export interface MapPhase {
  value: number
  label: string
}

export interface MapSenAttr {
  ln_class: string
  sen_type: string
  attrs: Attr[]
}

export interface Attr {
  attr: string
  desc_cn: string
  attr_def_val: string
}

export interface MapSenDebug {
  ln_class: string
  sen_type: string
  attrs: Attr2[]
}

export interface Attr2 {
  cmd: number
  desc_cn: string
  comment?: string
  def_data?: string
}

export interface MapCdcType {
  cdc_type_id: number
  cdc_type_name: string
  desc_cn: string
}

export interface MapI2Group {
  group_id: number
  ln_name: string
  group_name: string
  group_code: string
}

export interface MapI2Debug {
  value: number
  label: string
}

export interface MapI2DataType {
  data_type_id: number
  data_type_name: string
}

// 字典表相关 API
class DictApi {}

export const dictApi = new DictApi()

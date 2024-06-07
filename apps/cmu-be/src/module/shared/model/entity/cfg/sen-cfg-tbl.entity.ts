export interface SenCfgTblEntity {
  senId: number

  // 设备型号
  senType: string

  // 设备类型
  lnClass: string

  // 设备号
  lnInst: string

  // 短地址
  sAddr: string

  // 通信类型
  commuType: number

  // 设备描述
  descCn: string
}

// 逻辑设备信息 Login Device
import { existsSync } from 'node:fs'
import ora from 'ora'
import { exit } from 'process'
import XLSX from 'xlsx'
import { logger } from '../../utils/logger'

export interface LDInfoFromExcel {
  ld_id: string // 1 2 3 4 5 6
  IEDName: string // YNZHJCCMD
  LDevice: string // T1aMONT
  LDevice_desc: string // #1主变C相
  //  每个逻辑设备对应一个组，组内第一个 LN 对应的短地址的值填写在此处。
  //  例如101表示在T1aMONT这个逻辑设备组中开始的第一个短地址是101 ，
  //  该组内其他LN依次往后排是102，103 等。
  //  101字面意思第1组的01号LN ,1201的字面意思表示第12组的第01号LN.
  GroupNoStartID: string //101 201 301 401 501
  device_id: string // 1162304857722322947
  ip: string
  port: string
}

export type LNDescriptionFromExcelNumberKey = keyof Omit<
  LNDescriptionFromExcel,
  'vcard_id' | 'group_no' | 'vcard_desc'
>

// 逻辑节点描述信息 Logic Node
export interface LNDescriptionFromExcel {
  vcard_id: string
  group_no: string
  vcard_desc: string

  // 下面这些数字，其实指的是 LD 逻辑设备 GroupNoStartID/100 的值，对应的是第几组
  [key: number]: string
}

// 逻辑节点模版 Logic Node Template
export interface LNTemplateFromExcel {
  vcard_id: string
  ln_class: string
  desc_cn: string
  sen_type: string
  commu_type: string
  ln_inst: string
  s_addr: string
  channel: string
  smpInterval: string
  nxtSmpTime: string
  device_id: string
  ip: string
  port: string
}

export const parseExcel = (
  excelFilePath: string
): {
  ldInfoFromExcel: LDInfoFromExcel[]
  lnDescriptionFromExcel: LNDescriptionFromExcel[]
  lnTemplateFromExcel: LNTemplateFromExcel[]
} => {
  if (!existsSync(excelFilePath)) {
    logger.error('数据 Excel 文件不存在，路径：', [excelFilePath])
    exit()
  }

  const loading = ora(
    `正在解析数据 Excel 文件，文件路径：${excelFilePath}`
  ).start()

  const workbook = XLSX.readFile(excelFilePath)
  const sheetNames = workbook.SheetNames

  const ldInfoFromExcel: LDInfoFromExcel[] = XLSX.utils.sheet_to_json(
    workbook.Sheets[sheetNames[0]]
  )

  const lnDescriptionFromExcel: LNDescriptionFromExcel[] =
    XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[1]])

  const lnTemplateFromExcel: LNTemplateFromExcel[] = XLSX.utils.sheet_to_json(
    workbook.Sheets[sheetNames[2]]
  )
  loading.succeed('Excel 文件解析完成')

  return {
    ldInfoFromExcel,
    lnDescriptionFromExcel,
    lnTemplateFromExcel
  }
}

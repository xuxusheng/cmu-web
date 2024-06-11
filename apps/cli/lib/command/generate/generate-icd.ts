import { Dayjs } from 'dayjs'
import { writeFileSync } from 'node:fs'
import path from 'node:path'
import ora from 'ora'
import { exit } from 'process'
import xml2js from 'xml2js'
import { generateOutputFilename } from '../../utils/file'
import { logger } from '../../utils/logger'
import { parseExcel } from './excel'
import { parseIcdXml } from './icd'

export interface GenerateIcdOptions {
  time: Dayjs
  icdFilePath: string
  excelFilePath: string
  level: number
}

export const generateIcd = async (options: GenerateIcdOptions) => {
  const { time, icdFilePath, excelFilePath, level } = options

  logger.divider('生成 ICD 文件开始')

  // 解析 excel
  const { ldInfoFromExcel, lnDescriptionFromExcel } = parseExcel(excelFilePath)

  // 解析 icd
  const icdXml = await parseIcdXml(icdFilePath)

  const iedNode = icdXml.SCL.IED
  const accessPointNode = iedNode[0].AccessPoint[0]
  const serverNode = accessPointNode.Server[0]
  const lDeviceNodes = serverNode.LDevice

  // todo 节点数量究竟是不能等于 1，还是不能小于 1 ？
  if (lDeviceNodes.length != 1) {
    logger.error(
      'SCL.IED.AccessPoint.Server.LDevice 节点数量不为 1，请检查 ICD 模版是否正确'
    )
    exit()
  }

  let loading = ora('LDevice 节点生成中').start()

  // 构造新的 LDevice 节点
  serverNode.LDevice = ldInfoFromExcel.map((ldInfo) => {
    // 将 ICD 模版文件中的第一个 lDeviceNode 节点当做一个模版
    const ldNode = JSON.parse(
      JSON.stringify(lDeviceNodes[0])
    ) as (typeof lDeviceNodes)[number]

    ldNode.$.desc = ldInfo.LDevice_desc
    ldNode.$.inst = ldInfo.LDevice

    let addr = Number(ldInfo.GroupNoStartID)
    const ln0 = ldNode.LN0[0]
    for (const ds of ln0.DataSet) {
      for (const fcda of ds.FCDA) fcda.$.ldInst = ldInfo.LDevice
    }
    for (const lc of ln0.LogControl) {
      lc.$.logName = ldInfo.LDevice
    }

    let lnIdx = 0

    for (const ln of ldNode.LN) {
      const group = ln?.Private?.[0]?.$
      if (!group) continue
      if (!group['whjy:Group']) continue

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { vcard_id, vcard_desc, group_no, ...subNames } =
        lnDescriptionFromExcel[lnIdx]

      ln.$.desc =
        ldInfo.LDevice_desc +
        '_' +
        lnDescriptionFromExcel[lnIdx]?.vcard_desc +
        '|' +
        subNames[Number(ldInfo.ld_id)]

      //       ln.$.desc = `${ldInfo.ldDesc}_${names[lnIdx]?.lnDesc}|${names[lnIdx]?.subNames?.[ldIdx]}`

      group['whjy:Group'] = addr.toString()
      ++addr
      ++lnIdx

      if (level == 1 || level == 3) {
        ln.DOI?.forEach((doi) => {
          doi.$.desc = `${ln.$.desc}|${doi.$.desc}`
        })
      }

      if (level == 2 || level == 3) {
        ln.DOI?.forEach((doi) => {
          doi.DAI.forEach((dai) => {
            if (dai.$?.name == 'dU' && dai.Val?.[0]) {
              const v = dai.Val[0]
              dai.Val[0] = `${ln.$.desc}|${v}`
            }
          })
        })
      }
    }

    return ldNode
  })

  loading.succeed(`生成 ${ldInfoFromExcel.length} 个 LDevice 节点`)

  loading = ora('写入 XML 文件').start()

  // 构造一个新的 xml 文件
  const newIcdXml = new xml2js.Builder().buildObject(icdXml)
  const outputFileName = generateOutputFilename(icdFilePath, 'icd', time)
  const outputFilePath = path.join(process.cwd(), outputFileName)

  writeFileSync(outputFilePath, newIcdXml)

  loading.succeed(`写入 XML 文件完成`)

  logger.divider('生成 ICD 文件结束')
  logger.success(`ICD 文件生成成功，路径：${outputFilePath}`)
}

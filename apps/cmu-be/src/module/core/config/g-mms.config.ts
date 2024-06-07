import { registerAs } from '@nestjs/config'

export const gMmsConfig = registerAs('gMms', () => {
  const gMmsHome = process.env.COLLECTOR_IED_PATH || '/mnt/whjy_collector'
  const gNandHome = process.env.IED_NAND_PATH || '/mnt/nand'
  const gMmsEtcHome = gMmsHome + '/etc'
  const gMmsDataHome = gMmsHome + '/data'
  const gMmsBinHome = gMmsHome + '/bin'
  const gMmsIcdHome = gMmsHome + '/icd'
  const gMmsPidHome = gMmsHome + '/pid'
  const gMmsDocHome = gMmsHome + '/doc'
  const gMmsUpdateHome = gMmsHome + '/update'
  const gMmsToolHome = gNandHome + '/software' //add 常用工具目录
  const gMmsHelpHome = gNandHome + '/help' //add 帮助文档目录
  const gNetCfgFilePath = '/etc/network/interfaces'
  const gI2LogFilename = gNandHome + '/log/soap_proxy.log'

  return {
    gMmsHome,
    gNandHome,
    gMmsEtcHome,
    gMmsDataHome,
    gMmsBinHome,
    gMmsIcdHome,
    gMmsPidHome,
    gMmsDocHome,
    gMmsUpdateHome,
    gMmsToolHome,
    gMmsHelpHome,
    gNetCfgFilePath,
    gI2LogFilename
  }
})

import { Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { sleep } from '@nestjs/terminus/dist/utils'
import dayjs from 'dayjs'
import { XMLBuilder, XMLParser } from 'fast-xml-parser'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { ensureDirSync } from 'fs-extra'
import { parse, stringify } from 'ini'
import JSZip from 'jszip'
import fs from 'node:fs'
import path from 'node:path'
import { join } from 'path'

import { gMmsConfig } from '../core/config/g-mms.config'
import { serverConfig } from '../core/config/server.config'
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException
} from '../core/exception/custom-exception'
import {
  CollectConfig,
  LogConfig,
  LogXmlConfig,
  MmsConfig,
  MmsXmlConfig,
  NtpConfig,
  NtpIniConfig
} from '../shared/interface/system-config'
import { SysCfgTblEntity } from '../shared/model/entity/cfg/sys-cfg-tbl.entity'
import { KnexService } from '../shared/service/knex.service'
import { SetLogConfigDto } from './dto/set-log-config.dto'
import { SetMmsConfigDto } from './dto/set-mms-config.dto'
import { SetNtpConfigDto } from './dto/set-ntp-config.dto'
import { UpdateCollectConfigDto } from './dto/update-collect-config.dto'

@Injectable()
export class SystemConfigService {
  private readonly logger = new Logger(SystemConfigService.name)

  private readonly cfgDB = this.knexService.getCfgDB()

  // 备份目录路径
  private readonly backupDir: string

  constructor(
    // 配置
    @Inject(gMmsConfig.KEY)
    private gMmsConf: ConfigType<typeof gMmsConfig>,
    @Inject(serverConfig.KEY)
    private serverConf: ConfigType<typeof serverConfig>,
    private knexService: KnexService
  ) {
    this.backupDir = path.join(this.serverConf.dataDir, 'backup')
    // 确保目录存在
    ensureDirSync(this.backupDir)
  }

  private getMmsXmlPath = () => {
    const path = `${this.gMmsConf.gMmsEtcHome}/mms_config.xml`

    // 判断文件是否存在
    if (!existsSync(path)) {
      throw new InternalServerErrorException(`文件 ${path} 不存在`)
    }

    return path
  }

  private getLogXmlPath = () => {
    const path = `${this.gMmsConf.gMmsEtcHome}/logcfg.xml`

    // 判断文件是否存在
    if (!existsSync(path)) {
      throw new InternalServerErrorException(`文件 ${path} 不存在`)
    }

    return path
  }

  private getNtpIniPath = () => {
    const path = `${this.gMmsConf.gMmsEtcHome}/ntp.ini`

    // 判断文件是否存在
    if (!existsSync(path)) {
      throw new InternalServerErrorException(`文件 ${path} 不存在`)
    }

    return path
  }

  private getMmsXmlConfig = () => {
    // 读取文件内容
    const xmlStr = readFileSync(this.getMmsXmlPath()).toString()

    // 解析xml
    const parser = new XMLParser({
      ignoreAttributes: false,
      allowBooleanAttributes: true
    })
    return parser.parse(xmlStr) as MmsXmlConfig
  }

  private getLogXmlConfig = (): LogXmlConfig => {
    const path = this.getLogXmlPath()

    // 读取文件内容
    const xmlStr = readFileSync(path).toString()

    // 解析 xml
    const parser = new XMLParser({
      ignoreAttributes: false,
      allowBooleanAttributes: true
    })
    return parser.parse(xmlStr)
  }

  private getNtpIniConfig = () => {
    const path = this.getNtpIniPath()

    const iniStr = readFileSync(path).toString()

    return parse(iniStr) as NtpIniConfig
  }

  // MMS 相关配置
  getMmsConfig = (): MmsConfig => {
    const mmsConfig = this.getMmsXmlConfig().MMS_CFG

    return {
      icdFileDir: mmsConfig.SclFile.IcdFileDir,
      icdFileName: mmsConfig.SclFile.IcdFileName,
      iedName: mmsConfig.SclFile.IedName,
      apName: mmsConfig.SclFile.APName,
      mmsReportScanRate: mmsConfig.MmsReport.ReportScanRate,
      mmsReportCacheSize: mmsConfig.MmsReport.BRCBBufferSize,
      mmsLogScanRate: mmsConfig.MmsLog.LogScanRate,
      mmsLogMaxEntry: mmsConfig.MmsLog.LogMaxEntries,
      mmsLogTagName: mmsConfig.MmsLog.LogReasonTag,
      mmsLogFile: mmsConfig.MmsLog.SqliteFileName,
      mmsLogEntry: mmsConfig.MmsLog.SqliteMaxRows,
      mmsFileDir: mmsConfig.MmsFile.RootDir
    }
  }

  getIedAndApName = (icdFileName: string) => {
    const path = join(this.gMmsConf.gMmsIcdHome, icdFileName)

    if (!existsSync(path)) {
      throw new NotFoundException(`文件 ${path} 不存在`)
    }

    const xmlStr = readFileSync(path).toString()
    const parser = new XMLParser({
      ignoreAttributes: false,
      allowBooleanAttributes: true
    })
    const icd = parser.parse(xmlStr)
    const connectedAP = icd?.SCL?.Communication?.SubNetwork?.ConnectedAP

    if (!connectedAP) {
      throw new BadRequestException(
        `文件 ${path} 解析出错，未找到 ConnectedAP 配置`
      )
    }

    // connectedAP 可能为数组或对象
    if (Array.isArray(connectedAP)) {
      // 连接多个 ap
      return {
        iedName: connectedAP[0]['@_iedName'],
        apNameList: connectedAP.map((ap) => ap['@_apName'])
      }
    }

    return {
      iedName: connectedAP['@_iedName'],
      apNameList: [connectedAP['@_apName']]
    }
  }

  setMmsConfig = (dto: SetMmsConfigDto) => {
    const config = this.getMmsXmlConfig()

    config.MMS_CFG.SclFile.IcdFileDir = dto.icdFileDir
    config.MMS_CFG.SclFile.IcdFileName = dto.icdFileName
    config.MMS_CFG.SclFile.IedName = dto.iedName
    config.MMS_CFG.SclFile.APName = dto.apName
    config.MMS_CFG.MmsReport.ReportScanRate = dto.mmsReportScanRate
    config.MMS_CFG.MmsReport.BRCBBufferSize = dto.mmsReportCacheSize
    config.MMS_CFG.MmsLog.LogScanRate = dto.mmsLogScanRate
    config.MMS_CFG.MmsLog.LogMaxEntries = dto.mmsLogMaxEntry
    config.MMS_CFG.MmsLog.LogReasonTag = dto.mmsLogTagName
    config.MMS_CFG.MmsLog.SqliteFileName = dto.mmsLogFile
    config.MMS_CFG.MmsLog.SqliteMaxRows = dto.mmsLogEntry
    config.MMS_CFG.MmsFile.RootDir = dto.mmsFileDir

    const builder = new XMLBuilder({
      format: true,
      ignoreAttributes: false,
      suppressBooleanAttributes: true
    })

    const xmlStr = builder.build(config)

    const path = this.getMmsXmlPath()

    // 写入文件
    writeFileSync(path, xmlStr)
  }

  getLogConfig = (): LogConfig => {
    const logConfig = this.getLogXmlConfig().LOG_CFG.LogControl

    return {
      // 是否启用日志文件
      logFileEnable: logConfig.LogFileEnable === 'On',
      // 日志文件大小
      logFileSize: logConfig.LogFileSize,
      // 启用缓存
      logCacheEnable: logConfig.Setbuf === 'On',
      // 缓存大小
      logBufferSize: logConfig.LogBufferSize,
      // 日志目录
      logDir: logConfig.LogDir,
      // 最大日志文件个数
      logFileMaxNum: logConfig.LogCnt,
      // 日志文件名
      logFileName: logConfig.LogFileName,
      // 是否分割日志
      logFileSplitEnable: logConfig.Wrap === 'On'
    }
  }

  setLogConfig = (dto: SetLogConfigDto) => {
    const config = this.getLogXmlConfig()

    config.LOG_CFG.LogControl.LogFileEnable = dto.logFileEnable ? 'On' : 'Off'
    config.LOG_CFG.LogControl.LogFileSize = dto.logFileSize
    config.LOG_CFG.LogControl.Setbuf = dto.logCacheEnable ? 'On' : 'Off'
    config.LOG_CFG.LogControl.LogBufferSize = dto.logBufferSize
    config.LOG_CFG.LogControl.LogDir = dto.logDir
    config.LOG_CFG.LogControl.LogCnt = dto.logFileMaxNum
    config.LOG_CFG.LogControl.LogFileName = dto.logFileName
    config.LOG_CFG.LogControl.Wrap = dto.logFileSplitEnable ? 'On' : 'Off'

    const builder = new XMLBuilder({
      format: true,
      ignoreAttributes: false,
      suppressBooleanAttributes: true
    })
    const xmlStr = builder.build(config)

    const path = this.getLogXmlPath()

    // 写入文件
    writeFileSync(path, xmlStr)
  }

  getNtpConfig = (): NtpConfig => {
    const ntpConfig = this.getNtpIniConfig().ntp
    return {
      isUseSharedMem: ntpConfig.is_use_sharedMem === '1',
      ntpServerIp: ntpConfig.ntp_server_ip,
      outTime: Number(ntpConfig.out_time),
      syncCycle: Number(ntpConfig.sync_cycle)
    }
  }

  setNtpConfig = (dto: SetNtpConfigDto) => {
    const config = this.getNtpIniConfig()

    config.ntp.ntp_server_ip = dto.ntpServerIp
    config.ntp.sync_cycle = dto.syncCycle.toString()
    config.ntp.is_use_sharedMem = dto.isUseSharedMem ? '1' : '0'
    config.ntp.out_time = dto.outTime.toString()

    const path = this.getNtpIniPath()

    // 写入文件
    const iniStr = stringify(config)

    writeFileSync(path, iniStr)
  }

  // 获取采集参数
  getCollectConfig = async (): Promise<CollectConfig> => {
    const rows = await this.cfgDB<SysCfgTblEntity>('sys_cfg_tbl').select()

    // 转 map, 用 reduce 方法
    const configMap = rows.reduce((map, row) => {
      map.set(row.key, row.value)
      return map
    }, new Map<string, string>())

    return {
      autoRun: Number(configMap.get('autoRun')),
      cpuTh: Number(configMap.get('cpuTh')),
      invalidData: Number(configMap.get('invalidData')),
      invalidQuality: Number(configMap.get('invalidQuality')),
      memoryTh: Number(configMap.get('memoryTh')),
      saveMode: Number(configMap.get('saveMode')),
      sendMsg: Number(configMap.get('sendMsg')),
      destStaticFile: configMap.get('destStaticFile'),
      sourceStaticFile: configMap.get('sourceStaticFile'),
      soundAlmDo: Number(configMap.get('soundAlmDo'))
    }
  }

  // 设置采集参数
  updateCollectConfig = async (dto: UpdateCollectConfigDto) => {
    this.logger.log(`设置采集参数：${dto}`)

    // 更新所有字段 开事务
    await this.cfgDB.transaction(async (trx) => {
      for (const [key, value] of Object.entries(dto)) {
        console.log('key', key, 'value', value)
        await trx<SysCfgTblEntity>('sys_cfg_tbl')
          .update({
            value: value.toString()
          })
          .where({ key })
      }
    })
  }

  // 一键备份
  generateBackupFile = async () => {
    const { gMmsEtcHome, gMmsIcdHome } = this.gMmsConf

    const mmsConfigFilePath = this.getMmsXmlPath()
    if (!fs.existsSync(mmsConfigFilePath)) {
      throw new InternalServerErrorException(`文件 ${mmsConfigFilePath} 不存在`)
    }

    const cfgSqlite3FilePath = path.join(gMmsEtcHome, 'cfg.sqlite3')
    if (!fs.existsSync(cfgSqlite3FilePath)) {
      throw new InternalServerErrorException(
        `文件 ${cfgSqlite3FilePath} 不存在`
      )
    }

    const cfgI2Sqlite3FilePath = path.join(gMmsEtcHome, 'cfg_i2.sqlite3')
    if (!fs.existsSync(cfgI2Sqlite3FilePath)) {
      throw new InternalServerErrorException(
        `文件 ${cfgI2Sqlite3FilePath} 不存在`
      )
    }

    if (!fs.existsSync(gMmsIcdHome)) {
      throw new InternalServerErrorException(`目录 ${gMmsIcdHome} 不存在`)
    }

    // 制作压缩包
    const zip = new JSZip()

    zip.file('mms_config.xml', fs.readFileSync(mmsConfigFilePath))

    zip.file('cfg.sqlite3', fs.readFileSync(cfgSqlite3FilePath))

    zip.file('cfg_i2.sqlite3', fs.readFileSync(cfgI2Sqlite3FilePath))

    // 压缩包中创建一个 icd 目录，用来存放 icd 文件
    const zipIcdDir = zip.folder('icd')
    for (const file of fs.readdirSync(gMmsIcdHome)) {
      if (file.endsWith('.icd')) {
        zipIcdDir.file(file, fs.readFileSync(path.join(gMmsIcdHome, file)))
      }
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })

    // 备份文件存储的路径
    const now = dayjs()
    const backupFileName = `CMU一键备份文件_${now.format('YYYYMMDD')}_${now.format('HHmmss')}.zip`
    const backupFilePath = path.join(this.backupDir, backupFileName)

    // 等待 1s，避免请求太快，用户 1s 内点击多次
    await sleep(1000)
    fs.writeFileSync(backupFilePath, zipBuffer)
  }

  // 查询备份文件
  getBackupFiles = () => {
    return fs.readdirSync(this.backupDir).map((filename) => {
      const filePath = path.join(this.backupDir, filename)
      const stat = fs.statSync(filePath)
      return {
        filename,
        filePath,
        size: stat.size,
        lastModified: stat.mtime
      }
    })
  }

  // 删除备份文件
  deleteBackupFile = (filename: string) => {
    const filePath = this.getBackupFilePath(filename)
    fs.unlinkSync(filePath)
  }

  // --------------------------------------------------------------------------
  getBackupFilePath = (filename: string) => {
    const filePath = path.join(this.backupDir, filename)

    if (!this.backupDir || !fs.existsSync(filePath)) {
      throw new NotFoundException(`文件 ${filename} 不存在`)
    }

    return filePath
  }
}

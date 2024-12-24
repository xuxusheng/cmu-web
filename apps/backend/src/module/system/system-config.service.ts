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
import YAML from 'yaml'

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

    // 加入 mms_config 文件
    zip.file('mms_config.xml', fs.readFileSync(mmsConfigFilePath))

    // icd 文件具体备份哪一个，需要从 mms_config 中读取
    const mmsConfig = this.getMmsXmlConfig()
    const icdFileName = mmsConfig.MMS_CFG.SclFile.IcdFileName
    const icdFilePath = path.join(gMmsIcdHome, icdFileName)
    if (!fs.existsSync(icdFilePath)) {
      throw new InternalServerErrorException(`ICD 文件 ${icdFilePath} 不存在`)
    }
    zip.file(icdFileName, fs.readFileSync(icdFilePath))

    // cfg.sqlite3 和 cfg_i2.sqlite3 两个文件如果都是软链接，备份时，需要备份原始文件
    if (fs.lstatSync(cfgSqlite3FilePath).isSymbolicLink()) {
      let realPath = fs.realpathSync(cfgSqlite3FilePath)
      console.log(`cfg.sqlite3 软链接指向路径 ${realPath}`)
      // 如果 realPath 为相对路径，需要计算一下绝对路径
      if (!path.isAbsolute(realPath)) {
        realPath = path.join(path.dirname(cfgSqlite3FilePath), realPath)
      }
      this.logger.log(
        `cfg.sqlite3 软链接指向路径 ${realPath}，文件名为 ${path.basename(realPath)}`
      )
      zip.file(path.basename(realPath), fs.readFileSync(realPath))
    } else {
      zip.file('cfg.sqlite3', fs.readFileSync(cfgSqlite3FilePath))
    }

    if (fs.lstatSync(cfgI2Sqlite3FilePath).isSymbolicLink()) {
      let realPath = fs.realpathSync(cfgI2Sqlite3FilePath)
      if (!path.isAbsolute(realPath)) {
        realPath = path.join(path.dirname(cfgI2Sqlite3FilePath), realPath)
      }
      this.logger.log(
        `cfg_i2.sqlite3 软链接指向路径 ${realPath}，文件名为 ${path.basename(realPath)}`
      )
      zip.file(path.basename(realPath), fs.readFileSync(realPath))
    } else {
      zip.file('cfg_i2.sqlite3', fs.readFileSync(cfgI2Sqlite3FilePath))
    }

    const now = dayjs()

    const appVersion = process.env.APP_VERSION
    if (appVersion) {
      zip.file(
        'version.txt',
        YAML.stringify({
          备份时间: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          'CMU-WEB 版本': appVersion,
          'CMU-COLLECTOR 版本': '未知'
        })
      )
    }

    // 备份文件存储的路径
    const backupFileName = `CMU一键备份文件${
      appVersion ? `_v${appVersion}` : ''
    }_${now.format('YYYYMMDD')}_${now.format('HHmmss')}.zip`
    const backupFilePath = path.join(this.backupDir, backupFileName)

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })
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

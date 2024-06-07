import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { XMLParser } from 'fast-xml-parser'
import { compact } from 'lodash'
import fs from 'node:fs'
import path from 'node:path'
import { gMmsConfig } from '../../core/config/g-mms.config'
import {
  InternalServerErrorException,
  NotFoundException
} from '../../core/exception/custom-exception'

@Injectable()
export class LogFileService {
  private logConfigPath = `${this.gMmsConf.gMmsEtcHome}/logcfg.xml`

  constructor(
    @Inject(gMmsConfig.KEY)
    private gMmsConf: ConfigType<typeof gMmsConfig>
  ) {}

  // ----------------------------------- Read -----------------------------------

  // 获取日志文件列表
  getLogFiles = () => {
    const logDir = this.getLogDirAndFileName().logDir

    // 列出 logDir 目录下所有扩展名为 log 的文件
    const files = fs.readdirSync(logDir).map((file) => {
      const stat = fs.statSync(path.join(logDir, file))

      if (!stat.isFile() || !file.includes('log')) {
        return
      }

      return {
        filename: file,
        size: stat.size, // 字节
        lastModified: stat.mtime
      }
    })

    return compact(files)
  }

  // ----------------------------------- Other -----------------------------------
  // 从配置文件中读取日志目录和文件名
  getLogDirAndFileName = () => {
    const logConfig = new XMLParser().parse(
      fs.readFileSync(this.logConfigPath).toString()
    )

    // 提取出日志文件存放目录
    const logDir = logConfig?.LOG_CFG?.LogControl?.LogDir

    if (!logDir) {
      throw new InternalServerErrorException(
        'logcfg.xml 配置文件错误，未找到日志目录配置，请联系管理员'
      )
    }

    const logFileName = logConfig?.LOG_CFG?.LogControl?.LogFileName

    if (!logFileName) {
      throw new InternalServerErrorException(
        'logcfg.xml 配置文件错误，未找到日志文件配置，请联系管理员'
      )
    }

    return {
      logDir,
      logFileName
    }
  }

  getFilePath = (filename: string) => {
    const logDir = this.getLogDirAndFileName().logDir

    const filePath = path.join(logDir, filename)

    if (!logDir || !fs.existsSync(filePath)) {
      throw new NotFoundException(`文件 ${filename} 不存在`)
    }

    return filePath
  }

  // 删除日志文件
  delete = (filename: string) => {
    const filePath = this.getFilePath(filename)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  }
}

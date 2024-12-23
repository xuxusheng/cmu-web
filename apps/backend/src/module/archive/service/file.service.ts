import { Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { spawnSync } from 'child_process'
import { existsSync, lstatSync, readdirSync, unlinkSync } from 'fs'
import { chdir } from 'process'

import { gMmsConfig } from '../../core/config/g-mms.config'
import { getLogDirAndFileName } from '../../shared/utils/file'

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name)

  constructor(
    @Inject(gMmsConfig.KEY)
    private gMmsConf: ConfigType<typeof gMmsConfig>
  ) {}

  getFilesList = (type, suffix, dir) => {
    if (!lstatSync(dir).isDirectory()) {
      this.logger.warn('cannot chdir to ', dir)
      throw new Error(`chdir ${dir} failed`)
    }

    const RET = []
    readdirSync(dir, { withFileTypes: true })
      .filter((item) => !item.isDirectory())
      .filter((item) => item.name.endsWith(`.${suffix}`))
      .map((item) => {
        return { ...lstatSync(`${dir}/${item.name}`), name: item.name }
      })
      .forEach((info) => {
        const item = {
          name: info.name,
          size: info.size,
          uptime: info.mtime.getTime() / 1000,
          url: `file_download?type=${type}&filename=${encodeURIComponent(
            info.name
          )}`
        }

        RET.push(item)
      })

    return RET
  }

  isFile = (dir, filename) => {
    const stat = lstatSync(`${dir}/${filename}`)
    if (!stat.isFile()) {
      this.logger.warn(`${filename} is not a file `)
      return false
      // throw new Error(`${filename} is not a file `)
    }

    return true
  }

  getLogFileList = () => {
    const { logDir, logFile } = getLogDirAndFileName(this.gMmsConf.gMmsEtcHome)
    chdir(this.gMmsConf.gMmsHome)
    return this.getFilesList('log', 'log', logDir)
  }

  getCfgFileList = () => {
    return this.getFilesList('cfg', 'sqlite3', this.gMmsConf.gMmsEtcHome)
  }

  getIcdFileList = () => {
    return this.getFilesList('icd', 'icd', this.gMmsConf.gMmsIcdHome)
  }

  getToolsFileList = () => {
    chdir(this.gMmsConf.gMmsHome)
    return this.getFilesList('tool', '', this.gMmsConf.gMmsToolHome)
  }

  getHelpFileList = () => {
    chdir(this.gMmsConf.gMmsHome)
    return this.getFilesList('help', '*', this.gMmsConf.gMmsToolHome)
  }

  getCmuFileList = () => {
    return {
      logFiles: this.getLogFileList(),
      cfgFiles: this.getCfgFileList(),
      icdFiles: this.getIcdFileList()
    }
  }

  getFile = (type, filename) => {
    let dir = ''
    if (type == 'log') {
      dir = getLogDirAndFileName(this.gMmsConf.gMmsEtcHome).logDir
    } else if (type == 'cfg') dir = this.gMmsConf.gMmsEtcHome
    else if (type == 'icd') dir = this.gMmsConf.gMmsIcdHome
    else if (type == 'tool') dir = this.gMmsConf.gMmsToolHome
    else if (type == 'help') dir = this.gMmsConf.gMmsHelpHome

    return this.isFile(dir, filename) ? { dir, filename } : null
  }

  onUploadFile = (files) => {
    const f = files.newfile
    if (!f) return

    f.mv(`${this.gMmsConf.gMmsIcdHome}/${f.name}`)
    return this.getIcdFileList()
  }

  getConfigTarFile = () => {
    const filenamePath = '/mnt/f/config.tar.gz'
    if (existsSync(filenamePath)) unlinkSync(filenamePath)

    const RET = spawnSync('tar', `zcf ${filenamePath} etc data`.split(/\s+/), {
      cwd: this.gMmsConf.gMmsHome
    })
    if (RET.error) throw RET.error

    return filenamePath
  }
}

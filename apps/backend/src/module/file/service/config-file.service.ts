import { Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { execSync } from 'child_process'
import { compact } from 'lodash'
import fs from 'node:fs'
import path from 'node:path'

import { gMmsConfig } from '../../core/config/g-mms.config'
import {
  InternalServerErrorException,
  NotFoundException
} from '../../core/exception/custom-exception'
import { ApplyConfigDto } from '../dto/apply-config.dto'
import { ConfigFileType } from '../enum/config'

@Injectable()
export class ConfigFileService {
  private readonly logger = new Logger(ConfigFileService.name)

  private configDir = this.gMmsConf.gMmsEtcHome

  constructor(
    @Inject(gMmsConfig.KEY)
    private gMmsConf: ConfigType<typeof gMmsConfig>
  ) {}

  // ----------------------------------- Create -----------------------------------

  // 上传配置文件（其实就是 sqlite 数据库文件）
  upload = (files: Express.Multer.File[]) => {
    files.forEach((file) => {
      // 验证一下上传的文件是否都是 sqlite3 后缀
      if (!file.originalname.endsWith('.sqlite3')) {
        throw new InternalServerErrorException('上传的文件必须是 sqlite3 文件')
      }

      // 文件名不能是 cfg.sqlite3 或者 cfg_i2.sqlite3
      if (
        ([ConfigFileType.N, ConfigFileType.S] as string[]).includes(
          file.originalname
        )
      ) {
        throw new InternalServerErrorException(
          `文件名不能是 ${ConfigFileType.N} 或 ${ConfigFileType.S}`
        )
      }

      // 文件不能重复
      const FilePath = path.join(this.configDir, file.originalname)
      if (fs.existsSync(FilePath)) {
        throw new InternalServerErrorException(
          `文件 ${file.originalname} 已存在`
        )
      }
    })

    // 将文件写入到 config 目录下
    files.forEach((file) => {
      const filePath = path.join(this.configDir, file.originalname)
      fs.createWriteStream(filePath).write(file.buffer)
    })
  }

  // ----------------------------------- Update -----------------------------------
  // 应用配置文件
  apply = (dto: ApplyConfigDto) => {
    const { filename, type } = dto

    // 软连接要指向的目标文件
    const targetFilePath = path.join(this.configDir, filename)

    if (!fs.existsSync(targetFilePath)) {
      throw new NotFoundException(`目标文件 ${filename} 不存在`)
    }

    const configFilePath = path.join(this.configDir, `${type}`)
    // 删掉同名软链文件，避免创建时报错
    try {
      fs.unlinkSync(configFilePath)
    } catch (e) {
      this.logger.error(e)
    }

    // 如果用 node 的 api 来创建的话，无法创建相对路径的软链接，这样当容器内外绝对路径不一样时，就容易有问题
    // 所以使用 node 调用 linux 系统，先 cd 到目录中，然后 ln -s 命令的方式来执行
    const cmd = `cd ${this.configDir} && ln -s ./${filename} ${type}`
    this.logger.log(`执行命令：${cmd}`)
    execSync(cmd)
  }

  // ----------------------------------- Read -----------------------------------

  // 获取配置文件列表
  getConfigFiles = () => {
    // 目录地址

    const files = fs.readdirSync(this.configDir).map((filename) => {
      if (!filename.endsWith('sqlite3')) {
        return
      }

      const filePath = path.join(this.configDir, filename)

      const stat = fs.lstatSync(filePath)

      // 判断是否为符号链接
      if (stat.isSymbolicLink()) {
        return {
          filename,
          filePath,
          size: stat.size,
          lastModified: stat.mtime,
          isSymbolicLink: true,
          target: path.basename(fs.readlinkSync(filePath))
        }
      }

      if (stat.isFile()) {
        return {
          filename,
          filePath,
          size: stat.size,
          lastModified: stat.mtime,
          isSymbolicLink: false
        }
      }
    })

    return compact(files)
  }

  // ----------------------------------- Other -----------------------------------

  getFilePath = (filename: string) => {
    const filePath = path.join(this.configDir, filename)

    if (!this.configDir || !fs.existsSync(filePath)) {
      throw new NotFoundException(`文件 ${filename} 不存在`)
    }

    return filePath
  }
}

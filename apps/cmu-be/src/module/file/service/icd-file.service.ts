import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { Express } from 'express'
import { compact } from 'lodash'
import fs from 'node:fs'
import path from 'node:path'
import { gMmsConfig } from '../../core/config/g-mms.config'
import { NotFoundException } from '../../core/exception/custom-exception'

@Injectable()
export class IcdFileService {
  private icdDir = this.gMmsConf.gMmsIcdHome

  constructor(
    @Inject(gMmsConfig.KEY)
    private gMmsConf: ConfigType<typeof gMmsConfig>
  ) {}

  // ----------------------------------- Create -----------------------------------

  // 上传 ICD 文件
  uploadIcdFiles = (files: Express.Multer.File[]) => {
    // 将文件写入到 icd 目录下
    files.forEach((file) => {
      fs.createWriteStream(path.join(this.icdDir, file.originalname)).write(
        file.buffer
      )
    })
  }

  // ----------------------------------- Read -----------------------------------

  // 获取所有 ICD 文件
  getIcdFiles = () => {
    const files = fs.readdirSync(this.icdDir).map((file) => {
      const stat = fs.statSync(path.join(this.icdDir, file))

      if (!stat.isFile()) {
        return
      }

      return {
        filename: file,
        size: stat.size,
        lastModified: stat.mtime
      }
    })

    return compact(files)
  }

  // 获取文件内容
  getFileContent = (filename: string) => {
    const filePath = this.getFilePath(filename)
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`文件 ${filename} 不存在`)
    }

    return fs.readFileSync(filePath).toString()
  }

  // ----------------------------------- Other -----------------------------------

  getFilePath = (filename: string) => {
    const filePath = path.join(this.icdDir, filename)

    if (!this.icdDir || !fs.existsSync(filePath)) {
      throw new NotFoundException(`文件 ${filename} 不存在`)
    }

    return filePath
  }
}

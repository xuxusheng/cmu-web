import dayjs from 'dayjs'

import { logger } from '../../utils/logger'
import { generateDb } from './generate-db'
import { generateIcd } from './generate-icd'

export enum GenerateFileType {
  DB = 'DB', // Sqlite 数据库文件
  ICD = 'ICD' // ICD 文件
}

interface GenerateOptions {
  fileTypes: GenerateFileType[]
  sqliteFilePath: string
  icdFilePath: string
  icdLevel: number
  excelFilePath: string
}

export const generate = async (options: GenerateOptions) => {
  const { fileTypes, sqliteFilePath, icdFilePath, excelFilePath, icdLevel } =
    options

  const now = dayjs()
  logger.info(`任务开始，时间：${now.format()}`)

  if (fileTypes.includes(GenerateFileType.DB)) {
    // 生成数据库文件
    await generateDb({
      time: now,
      sqliteFilePath,
      excelFilePath
    })
  }

  if (fileTypes.includes(GenerateFileType.ICD)) {
    // 生成icd文件
    await generateIcd({
      time: now,
      icdFilePath,
      excelFilePath,
      level: icdLevel
    })
  }
}

import inquirer from 'inquirer'
import * as path from 'path'
import { getTemplateFiles } from '../../utils/file'
import { logger } from '../../utils/logger'
import { generate, GenerateFileType } from './generate'

export const handleGenerateCommand = async () => {
  // 选择需要生成的文件种类
  const { fileTypes } = await inquirer.prompt({
    type: 'checkbox',
    name: 'fileTypes',
    message: '请选择需要生成的文件种类',
    choices: [
      {
        name: '数据库文件',
        value: GenerateFileType.DB,
        checked: true
      },
      {
        name: 'ICD 文件',
        value: GenerateFileType.ICD,
        checked: true
      }
    ],
    validate: (input: GenerateFileType[]) => {
      if (input.length === 0) {
        return '请至少选择一个文件种类'
      }
      return true
    }
  })

  const sqliteFiles = getTemplateFiles('sqlite3')
  const icdFiles = getTemplateFiles('icd')
  const excelFiles = getTemplateFiles('xlsx')

  // 先校验一下当前目录下是否存在所选的文件类型的模版
  if (fileTypes.includes(GenerateFileType.DB) && sqliteFiles.length === 0) {
    logger.error(
      '当前目录下没有找到合适的数据库文件（文件名不以【_out_时间】结尾，且后缀为 .sqlite3）'
    )
    process.exit(1)
  }
  if (fileTypes.includes(GenerateFileType.ICD) && icdFiles.length === 0) {
    logger.error('当前目录下没有找到 icd 文件')
    process.exit(1)
  }
  if (excelFiles.length === 0) {
    logger.error('当前目录下没有找到 excel 文件')
    process.exit(1)
  }

  // 如果选择了生成数据库，需要选择模版数据库
  let sqliteFilePath = ''
  if (fileTypes.includes(GenerateFileType.DB)) {
    // 选择需要使用的数据库模版
    const { file } = await inquirer.prompt({
      type: 'list',
      name: 'file',
      message: '请选择使用的数据库模版',
      choices: sqliteFiles,
      validate: (input: string) => {
        if (!input) {
          return '请至少选择一个数据库模版'
        }
        return true
      }
    })
    sqliteFilePath = path.join(process.cwd(), file)
  }

  // 如果选择了生成 icd 文件，需要选择 icd 模版和描述组合方式
  let icdFilePath = ''
  let icdLevel: number = 3
  if (fileTypes.includes(GenerateFileType.ICD)) {
    const { file } = await inquirer.prompt({
      type: 'list',
      name: 'file',
      message: '请选择使用的 ICD 模版',
      choices: icdFiles,
      validate: (input: string) => {
        if (!input) {
          return '请至少选择一个 ICD 模版'
        }
        return true
      }
    })
    icdFilePath = path.join(process.cwd(), file)

    const { level } = await inquirer.prompt({
      type: 'list',
      name: 'level',
      message: '请选择 ICD 文件中描述信息组合方式',
      choices: ['1', '2', '3'],
      default: '3',
      validate: (input: string) => {
        if (!input) {
          return '请选择 ICD 文件中描述信息组合方式'
        }
        return true
      }
    })
    icdLevel = Number(level)
  }

  // 选择数据 Excel 文件
  const { file: excelFilePath } = await inquirer.prompt({
    type: 'list',
    name: 'file',
    message: '请选择数据 Excel 文件',
    choices: excelFiles,
    validate: (input: string) => {
      if (!input) {
        return '请至少选择一个数据 Excel 文件'
      }
      return true
    }
  })

  await generate({
    fileTypes,
    sqliteFilePath,
    icdFilePath,
    excelFilePath,
    icdLevel
  })
}

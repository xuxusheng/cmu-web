import { Dayjs } from 'dayjs'
import { readdirSync } from 'node:fs'
import path from 'node:path'

// 通过输入的模版文件路径，计算输出的文件名
export const generateOutputFilename = (
  inputFilePath: string, // 输入的文件路径
  ext: string, // 文件后缀
  time: Dayjs
) => {
  ext = ext.startsWith('.') ? ext : '.' + ext
  const inputFileName = path.basename(inputFilePath, ext)
  const now = time.format('YYYYMMDDHHmmss')
  return `${inputFileName}_out_${now}${ext}`
}

// 查询目录下符合模版文件规则的文件
export const getTemplateFiles = (ext: string) =>
  readdirSync(process.cwd()).filter(
    (file) =>
      // 文件名不能以 _out_数字.${ext} 的形式结尾，使用正则
      !/_out_\d+\./.test(file) &&
      path.extname(file) === (ext.startsWith('.') ? ext : '.' + ext)
  )

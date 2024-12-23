import { Command } from 'commander'
import * as process from 'process'

import { handleGenerateCommand } from './command/generate'
import { handleImageSaveCommand } from './command/image-save'
import { name, version } from './utils/package-json'

const program = new Command()

program
  .name(name)
  .version(version, '-v --version')
  .description('九宇 - 变电设备综合监测系统 CLI 工具')

program
  .command('generate')
  .alias('g')
  .description(
    '根据模版（数据库、icd）和数据 excel，生成实际使用的数据库和 icd 文件'
  )
  .action(handleGenerateCommand)

program
  .command('image-save')
  .description('保存 cmu-web 前后端 docker 镜像到本地压缩包')
  .action(handleImageSaveCommand)

program.parse(process.argv)

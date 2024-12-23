// 保存镜像为 tar 包
import { execa } from 'execa'
import { exit } from 'process'

import { logger } from '../../utils/logger'

export const saveImage = async (image: string, fileName: string) => {
  try {
    await execa('docker', ['save', image, '-o', fileName])
  } catch (e) {
    logger.error(
      `
保存镜像 ${image} 出错：` + e
    )
    exit(1)
  }
}

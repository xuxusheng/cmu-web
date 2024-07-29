import { execa } from 'execa'
import { exit } from 'process'
import { logger } from '../../utils/logger'

// 拉取镜像
export const pullImage = async (image: string, platform: string) => {
  try {
    await execa('docker', ['pull', '--platform', platform, image])
  } catch (e) {
    logger.error(
      `
拉取镜像 ${image} 出错：` + e
    )
    exit(1)
  }
}

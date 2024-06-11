import inquirer from 'inquirer'
import { execSync } from 'node:child_process'
import ora from 'ora'
import semver from 'semver/preload'
import { logger } from '../../utils/logger'
import { BE_IMAGE, FE_IMAGE } from './const'
import { pullImage } from './pull-image'
import { saveImage } from './save-image'

// 保存 docker 镜像到本地
export const handleImageSaveCommand = async () => {
  // 检测当前系统是否存在 docker
  try {
    execSync('docker -v', { stdio: 'ignore' })
  } catch (error) {
    logger.error(
      '当前系统不存在 docker 环境，请先安装，参考文档：https://na1vmyjvh4o.feishu.cn/wiki/CeOrwVEppiLd8GklYK6cSVmVnBf#NQAydO4dXodzhGxKY7NcQoM4nuc'
    )
    process.exit(1)
  }

  // 检测 docker 是否启动
  try {
    execSync('docker ps', { stdio: 'ignore' })
  } catch (error) {
    logger.error('docker 没有启动，请先启动')
    process.exit(1)
  }

  logger.success(
    `离线部署参考文档：https://na1vmyjvh4o.feishu.cn/wiki/Una1wN1ZRiOxeokzPd7cjPZOnNh
请在更新日志中查询最新版本号：`
  )

  logger.info(`1. CMU 前端更新日志：https://na1vmyjvh4o.feishu.cn/wiki/PK1UwpsaWikwrvkQZFuc0AKFnpg
2. CMU 后端更新日志：https://na1vmyjvh4o.feishu.cn/wiki/GBsJwmaPHias8rkzox7cFvn4ngL
  `)

  const { feVersion } = await inquirer.prompt({
    type: 'input',
    name: 'feVersion',
    message: '请输入前端版本号',
    default: '0.3.14',
    validate: (input) => {
      if (!input) {
        return '请输入前端版本号'
      }
      if (!semver.valid(input)) {
        return '请输入正确的前端版本号，如：1.0.0'
      }
      // 必要许
      return true
    }
  })

  const { beVersion } = await inquirer.prompt({
    type: 'input',
    name: 'beVersion',
    message: '请输入后端版本号',
    default: '0.3.13',
    validate: (input) => {
      if (!input) {
        return '请输入后端版本号'
      }
      if (!semver.valid(input)) {
        return '请输入正确的后端版本号，如：1.0.0'
      }
      return true
    }
  })

  const { platform } = await inquirer.prompt({
    type: 'list',
    name: 'platform',
    message: '请选择需要部署的机器架构',
    choices: [
      {
        name: 'amd64（x86_64）',
        value: 'amd64'
      },
      {
        name: 'arm64',
        value: 'arm64'
      },
      {
        name: 'arm',
        value: 'arm'
      }
    ],
    validate: (input) => {
      if (!input) {
        return '请选择需要部署的机器架构'
      }
      return true
    }
  })

  const feImage = `${FE_IMAGE}:${feVersion}`
  const beImage = `${BE_IMAGE}:${beVersion}`

  const fePullLoading = ora().start('正在拉取前端镜像')
  await pullImage(feImage, platform)
  fePullLoading.succeed('拉取前端镜像成功，镜像地址：' + feImage)

  const bePullLoading = ora().start('正在拉取后端镜像')
  await pullImage(beImage, platform)
  bePullLoading.succeed('拉取后端镜像成功，镜像地址：' + beImage)

  const feTarFileName = `cmu-fe_${platform}_${feVersion}.tar`
  const beTarFileName = `cmu-be_${platform}_${beVersion}.tar`

  // 保存镜像
  const feSaveLoading = ora().start('正在保存前端镜像')
  await saveImage(feImage, feTarFileName)
  feSaveLoading.succeed('保存前端镜像成功，文件地址：' + feTarFileName)

  const beSaveLoading = ora().start('正在保存后端镜像')
  await saveImage(beImage, beTarFileName)
  beSaveLoading.succeed('保存后端镜像成功，文件地址：' + beTarFileName)

  logger.success(`镜像保存成功，请参考以下步骤继续操作 ~`)

  logger.success(`1. 使用 scp 命令或其他方式将文件拷贝到目标机器的 /mnt/cmu-web 目录下
    scp ${feTarFileName} root@<机器IP>:/mnt/cmu-web
    scp ${beTarFileName} root@<机器IP>:/mnt/cmu-web
  `)

  logger.success(`2. 登录机器并进入相应目录，执行 docker 镜像载入命令
    cd /mnt/cmu-web
    docker load -i ${feTarFileName}
    docker load -i ${beTarFileName}
  `)

  logger.success(`3. 修改 docker-compose.yaml 文件中镜像版本号
    vim docker-compose.yaml
    修改前后端镜像版本号分别为 ${feVersion} 和 ${beVersion}
  `)

  logger.success(`4. 重新启动容器
    docker compose up -d
  `)
}

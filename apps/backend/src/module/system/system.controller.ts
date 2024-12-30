import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put
} from '@nestjs/common'
import dayjs from 'dayjs'
import { readFileSync } from 'fs'
import fs from 'node:fs'
import path from 'node:path'

import { Public } from '../shared/decorator/public'
import { Result } from '../shared/model/result'
import { RestartProcessDto } from './dto/restart-process.dto'
import { SetLicenseDto } from './dto/set-license.dto'
import { SetSystemTimeDto } from './dto/set-system-time.dto'
import { UpdateIpAddressDto } from './dto/update-ip-address.dto'
import { SystemService } from './system.service'

@Controller('api/system')
export class SystemController {
  constructor(private readonly systemSvc: SystemService) {}

  /**
   * 查询应用版本
   */
  @Public()
  @Get('version')
  getVersion() {
    return {
      version: process.env.APP_VERSION || ''
    }
  }

  /**
   * 更新日志
   */
  @Public()
  @Get('changelog')
  getChangelog() {
    const filePath = path.join(process.cwd(), 'CHANGELOG.md')

    // 文件不存在
    if (!fs.existsSync(filePath)) {
      return {
        content: ''
      }
    }

    return {
      content: readFileSync(filePath, 'utf8')
    }
  }

  /**
   * Collector 版本号
   */
  @Public()
  @Get('collector/version')
  getCollectorVersion() {
    return {
      version: this.systemSvc.getCollectorVersion()
    }
  }

  /**
   * Collector 更新日志
   */
  @Public()
  @Get('collector/changelog')
  getCollectorChangelog() {
    return {
      content: this.systemSvc.getCollectorChangelog()
    }
  }

  /**
   * 设置系统时间
   */
  @Put('time')
  @HttpCode(HttpStatus.OK)
  async setSystemTime(@Body() dto: SetSystemTimeDto) {
    await this.systemSvc.setSystemTime(dto)
  }

  /**
   * 获取系统时间
   */
  @Get('time')
  getSystemTime() {
    return Result.ok({
      systemTime: dayjs().toISOString()
    })
  }

  /**
   * 获取网卡信息
   */
  @Get('network-interfaces')
  getNetworkInterfaces() {
    return Result.ok(this.systemSvc.getNetworkInterfaces())
  }

  /**
   * 获取网卡信息
   */
  @Get('ip-address')
  getIpAddress() {
    return this.systemSvc.getIpAddress()
  }

  // 通过网卡名称查询网卡信息
  @Get('ip-address/:name')
  getIpAddressByName(@Param('name') name: string) {
    return this.systemSvc.getIpAddressByName(name)
  }

  // 更新网卡信息
  @Put('ip-address/:name')
  updateIpAddress(
    @Param('name') name: string,
    @Body() dto: UpdateIpAddressDto
  ) {
    return this.systemSvc.updateIpAddressByName(name, dto)
  }

  @Get('ip-route')
  async getIpRoute() {
    return this.systemSvc.getIpRoute()
  }

  /**
   * 获取宿主机状态
   */
  // @Get('host-status')
  // getHostStatus() {
  //   const cpuStatus = this.systemSvc.getCPUInfo()
  //   const memoryStatus = this.systemSvc.getMemoryInfo()
  //   const diskStatus = this.systemSvc.getDiskInfo()
  //
  //   return Result.ok({
  //     cpuStatus,
  //     memoryStatus,
  //     diskStatus
  //   })
  // }

  // 获取运行时间
  @Get('uptime')
  getUptime() {
    const uptime = this.systemSvc.getUptime()
    return Result.ok({
      uptime
    })
  }

  // 获取 CPU 信息
  @Get('cpu')
  getCpu() {
    const data = this.systemSvc.getCpu()
    return Result.ok(data)
  }

  // 获取内存信息
  @Get('memory')
  getMemory() {
    const data = this.systemSvc.getMemory()
    return Result.ok(data)
  }

  // 获取进程状态
  @Get('process')
  getProcessStatus() {
    return this.systemSvc.getProcessStatus()
  }

  /**
   * 重启进程
   */
  @Post('process/restart')
  restartProcess(@Body() dto: RestartProcessDto) {
    const { processName } = dto
    return this.systemSvc.restartProcess(processName)
  }

  // 查询 license hash
  @Get('license-hash')
  getLicenseHash() {
    const licenseHash = this.systemSvc.getLicenseHash()
    return {
      licenseHash
    }
  }

  // 查询 license
  @Get('license')
  getLicense() {
    const license = this.systemSvc.getLicense()

    if (!license) {
      return { license: '' }
    }

    const len = license.length
    if (len <= 8) {
      // 全部用信号代替
      return { license: '*'.repeat(len) }
    }

    // 只保留前四位和后四位，中间都用 * 代替
    const licenseStr = license

    return {
      license:
        licenseStr.slice(0, 4) + '*'.repeat(len - 8) + licenseStr.slice(-4)
    }
  }

  // 设置 License
  @Post('license')
  setLicense(@Body() dto: SetLicenseDto) {
    this.systemSvc.setLicense(dto.license)
  }

  // 重启
  @Post('reboot')
  async reboot() {
    try {
      await this.systemSvc.reboot()
    } catch (e) {
      // 重启命令会导致连接终端，触发 socket hang up 错误
      // 所以如果是 socket hang up 错误的话，不做处理，其他错误正常抛出
      if (e.message !== 'socket hang up') {
        throw e
      }
    }
  }
}

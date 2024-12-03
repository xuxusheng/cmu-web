import { Body, Controller, Get, Put, Query } from '@nestjs/common'

import { GetIedAndApNameDto } from './dto/get-ied-and-ap-name.dto'
import { SetLogConfigDto } from './dto/set-log-config.dto'
import { SetMmsConfigDto } from './dto/set-mms-config.dto'
import { SetNtpConfigDto } from './dto/set-ntp-config.dto'
import { UpdateCollectConfigDto } from './dto/update-collect-config.dto'
import { SystemConfigService } from './system-config.service'

@Controller('api/system-config')
export class SystemConfigController {
  constructor(private systemConfigSvc: SystemConfigService) {}

  @Get('mms')
  getMmsConfig() {
    return this.systemConfigSvc.getMmsConfig()
  }

  @Get('get-ied-and-ap-name')
  getIedAndApName(@Query() dto: GetIedAndApNameDto) {
    return this.systemConfigSvc.getIedAndApName(dto.icdFileName)
  }

  @Put('mms')
  setMmsConfig(@Body() dto: SetMmsConfigDto) {
    return this.systemConfigSvc.setMmsConfig(dto)
  }

  @Get('log')
  getLogConfig() {
    return this.systemConfigSvc.getLogConfig()
  }

  @Put('log')
  setLogConfig(@Body() dto: SetLogConfigDto) {
    return this.systemConfigSvc.setLogConfig(dto)
  }

  @Get('ntp')
  getNtpConfig() {
    return this.systemConfigSvc.getNtpConfig()
  }

  @Put('ntp')
  setNtfConfig(@Body() dto: SetNtpConfigDto) {
    return this.systemConfigSvc.setNtpConfig(dto)
  }

  @Get('collect')
  getCollectConfig() {
    return this.systemConfigSvc.getCollectConfig()
  }

  @Put('collect')
  updateCollectConfig(@Body() dto: UpdateCollectConfigDto) {
    return this.systemConfigSvc.updateCollectConfig(dto)
  }
}

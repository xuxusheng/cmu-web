import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res
} from '@nestjs/common'
import { Response } from 'express'
import { createReadStream } from 'fs'

import { BadRequestException } from '../core/exception/custom-exception'
import { Public } from '../shared/decorator/public'
import { sortByLastModified } from '../shared/utils/sort'
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

  // 查询一键备份文件列表
  @Get('backup-file/list')
  listBackupFiles() {
    return this.systemConfigSvc.getBackupFiles().sort(sortByLastModified)
  }

  // 生成一键备份文件
  @Post('backup-file/generate')
  generateBackupFile() {
    return this.systemConfigSvc.generateBackupFile()
  }

  // 删除备份文件
  @Delete('backup-file/:filename')
  deleteBackupFile(@Param('filename') filename: string) {
    return this.systemConfigSvc.deleteBackupFile(filename)
  }

  // 下载一键备份文件
  @Public()
  @Get('backup-file/download')
  downloadConfig(@Query('filename') filename: string, @Res() res: Response) {
    if (!filename) {
      throw new BadRequestException('参数 filename 不能为空')
    }

    const path = this.systemConfigSvc.getBackupFilePath(filename)

    console.log(`下载路径`, path)

    res.set({
      'Content-Disposition': `attachment; filename=${encodeURIComponent(
        filename
      )}`
    })

    const file = createReadStream(path)
    file.pipe(res)
  }
}

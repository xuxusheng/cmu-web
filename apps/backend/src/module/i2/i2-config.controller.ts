import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'

import { CacConfigDto } from './dto/cac-config.dto'
import { CagConfigDto } from './dto/cag-config.dto'
import { I2ConfigService } from './i2-config.service'

@Controller('/api/i2/config')
export class I2ConfigController {
  constructor(private i2ConfigSvc: I2ConfigService) {}

  // 查询 CAC 配置
  @Get('cac')
  getCac() {
    return this.i2ConfigSvc.getCac()
  }

  // 更新 CAC 配置
  @Put('cac')
  async updateCac(@Body() dto: CacConfigDto) {
    await this.i2ConfigSvc.updateCac(dto)
  }

  // ------------------------------------------------------------ CAG ------------------------------------------------------------

  @Get('cag/:id')
  getCag(@Param('id') id: number) {
    return this.i2ConfigSvc.getCag(id)
  }

  // 查询 CAG 配置列表
  @Get('cag')
  getCagList() {
    return this.i2ConfigSvc.getCagList()
  }

  // 新建 CAG 配置
  @Post('cag')
  async createCag(@Body() dto: CagConfigDto) {
    await this.i2ConfigSvc.createCag(dto)
  }

  // 更新 CAG 配置
  @Put('cag/:id')
  async updateCag(@Param('id') id: number, @Body() dto: CagConfigDto) {
    await this.i2ConfigSvc.updateCag(id, dto)
  }

  // 删除 CAG 配置
  @Delete('cag/:id')
  async deleteCag(@Param('id') id: number) {
    await this.i2ConfigSvc.deleteCag(id)
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res
} from '@nestjs/common'
import { Response } from 'express'
import { Readable } from 'stream'
import { Public } from '../shared/decorator/public'
import { SelectOption } from '../shared/interface/common'
import { Page } from '../shared/interface/page'
import { Sensor, SensorAttr } from '../shared/interface/sensor'
import { Result } from '../shared/model/result'
import { CreateSensorDto } from './dto/create-sensor.dto'
import { GetReportDataDto } from './dto/get-report-data.dto'
import { GetSensorAttrsDto } from './dto/get-sensor-attrs.dto'
import { ListSensorDto } from './dto/list-sensor.dto'
import { PageSensorDto } from './dto/page-sensor.dto'
import { UpdateSensorDto } from './dto/update-sensor.dto'
import { SensorService } from './sensor.service'

@Controller('api/sensor')
export class SensorController {
  constructor(private sensorSvc: SensorService) {}

  // ------------------------------- C -------------------------------

  // 添加传感器
  @Post()
  async addSensor(@Body() dto: CreateSensorDto) {
    await this.sensorSvc.create(dto)
  }

  // ------------------------------- U -------------------------------

  // 更新传感器
  @Put()
  @HttpCode(HttpStatus.OK)
  async updateSensor(@Body() dto: UpdateSensorDto) {
    await this.sensorSvc.update(dto)
  }

  // ------------------------------- R -------------------------------

  // 查询所有设备状态
  @Get('all-status')
  getAllSensorStatus() {
    return this.sensorSvc.getAllSensorStatus()
  }

  // 查询所有设备最新数据
  @Get('all-latest-data')
  getLatestData() {
    return this.sensorSvc.getAllLatestReportData()
  }

  // 查询设备类型
  @Get('ln-class-options')
  async getLnClassOptions(): Promise<Result<SelectOption[]>> {
    const options = await this.sensorSvc.getLnClassOptions()
    return Result.ok(options)
  }

  // 查询设备型号
  @Get('sensor-type-options')
  async getSensorTypeOptions(
    @Query('lnClass') lnClass: string
  ): Promise<Result<SelectOption[]>> {
    const options = await this.sensorSvc.getSensorTypeOptions(lnClass)
    return Result.ok(options)
  }

  // 查询通讯类型
  @Get('comm-type-options')
  async getCommTypeOptions(): Promise<Result<SelectOption<number>[]>> {
    const options = await this.sensorSvc.getCommTypeOptions()
    return Result.ok(options)
  }

  // 查询传感器属性字段（根据设备类型和设备型号）
  @Get('sensor-attrs')
  async getSensorAttrs(
    @Query() dto: GetSensorAttrsDto
  ): Promise<Result<SensorAttr[]>> {
    const { lnClass, sensorType } = dto

    const attrs = await this.sensorSvc.getSensorAttrs({
      lnClass,
      sensorType
    })
    return Result.ok(attrs)
  }

  // 查询所有设备类型和设备型号对应的属性字段
  @Get('all-sensor-attrs')
  async getAllSensorAttrs(): Promise<
    Result<
      {
        lnClass: string
        sensorType: string
        attrs: SensorAttr[]
      }[]
    >
  > {
    const attrs = await this.sensorSvc.getAllSensorAttrs()
    return Result.ok(attrs)
  }

  // 查询传感器列表（分页）
  @Get('page')
  async page(@Query() dto: PageSensorDto): Promise<Result<Page<Sensor>>> {
    const data = await this.sensorSvc.page(dto)
    return Result.ok(data)
  }

  // 查询设备列表
  @Get('list')
  async list(@Query() dto: ListSensorDto) {
    const list = await this.sensorSvc.list(dto)
    return Result.ok(list)
  }

  // 查询指定设备上报数据
  @Get(':id/report-data')
  getReportData(@Param('id') id: number, @Query() dto: GetReportDataDto) {
    return this.sensorSvc.getReportDataById(id, dto)
  }

  // 查询指定设备上报数据的字段信息
  @Get(':id/report-data-fields')
  getReportDataFields(@Param('id') sensorId: number) {
    return this.sensorSvc.getReportDataFields(sensorId)
  }

  // 导出指定设备历史上报数据
  @Public()
  @Get(':id/export-report-data')
  async exportReportData(@Param('id') id: number, @Res() res: Response) {
    const { filename, buffer } = await this.sensorSvc.exportReportData(id)

    res.set({
      'Content-Disposition': `attachment; filename=${encodeURIComponent(
        filename
      )}`
    })

    const file = Readable.from(buffer)
    file.pipe(res)
  }

  @Get(':id')
  getSensor(@Param('id') id: number) {
    return this.sensorSvc.getByIdWithAttrs(id)
  }

  // ------------------------------- D -------------------------------

  // 删除传感器
  @Delete(':id')
  async deleteSensor(@Param('id') id: number) {
    await this.sensorSvc.delete(id)
  }
}

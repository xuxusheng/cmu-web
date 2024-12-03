import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res
} from '@nestjs/common'
import { Response } from 'express'

import { Result } from '../../shared/model/result'
import { SensorService } from '../service/sensor.service'

@Controller('api/sensors')
export class SensorsController {
  constructor(private sensorSvc: SensorService) {}

  @Get('all')
  async findAll() {
    const sensors = await this.sensorSvc.queryAll()
    return Result.ok(sensors as any[])
  }

  @Get('sen_basic_status')
  async getSenBasicStatus() {
    const list = await this.sensorSvc.queryAll()
    return Result.ok({ list })
  }

  @Get('sen_update')
  async getSenUpdate(@Query() query) {
    const list = await this.sensorSvc.getUpdateSensorInfo(query)
    return Result.ok({ list })
  }

  @Get(':id/sen_datas')
  async getSenDatas(@Param('id') id: string, @Query() query) {
    return this.sensorSvc.getSensorDataById(id, query)
  }

  @Post()
  async create(@Body() body) {
    return this.sensorSvc.addSensor(body)
  }

  @Post(':id')
  async update(@Param('id') id: string, @Body() body) {
    return this.sensorSvc.updateSensor(id, body)
  }

  // fixme: params 支持数组？？？
  @Delete(':ids')
  async delete(@Param('ids') ids: string) {
    return this.sensorSvc.onDeleteSensor(ids)
  }

  @Post(':id/debug_orders')
  debugOrders(@Param('id') id: string, @Body() body) {
    const { cmd, param } = body
    return this.sensorSvc.onDebug(id, cmd, param)
  }

  @Get(':id/sen_csv')
  async getSenCsv(
    @Param('id') id: string,
    @Query() query,
    @Res() res: Response
  ) {
    // todo 确认功能正常
    const filePath = await this.sensorSvc.onExportCSV(id, query)
    return res.download(filePath)
  }
}

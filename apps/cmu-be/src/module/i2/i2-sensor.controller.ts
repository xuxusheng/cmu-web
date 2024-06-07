import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common'
import { I2SensorDto } from './dto/i2-sensor.dto'
import { PageI2SensorDto } from './dto/page-i2-sensor.dto'
import { I2SensorService } from './i2-sensor.service'

@Controller('api/i2/sensor')
export class I2SensorController {
  constructor(private i2SensorSvc: I2SensorService) {}

  @Post()
  create(@Body() dto: I2SensorDto) {
    return this.i2SensorSvc.create(dto)
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: I2SensorDto) {
    return this.i2SensorSvc.update(id, dto)
  }

  // 查询所有 I2 Sensor
  @Get('list')
  list() {
    return this.i2SensorSvc.list()
  }

  @Get('page')
  page(@Query() dto: PageI2SensorDto) {
    return this.i2SensorSvc.page(dto)
  }

  // 查询传感器的分组
  @Get('group')
  getAllGroup() {
    return this.i2SensorSvc.getAllGroup()
  }

  // 查询传感器的相别
  @Get('phase')
  getAllPhase() {
    return this.i2SensorSvc.getAllPhase()
  }

  @Get(':id')
  getById(@Param('id') id: number) {
    return this.i2SensorSvc.getById(id)
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.i2SensorSvc.delete(id)
  }
}

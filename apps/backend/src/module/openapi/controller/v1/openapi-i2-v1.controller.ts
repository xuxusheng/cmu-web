import { Controller, Get, Query } from '@nestjs/common'

import { OpenapiI2SensorDataPageDto } from '../../dto/openapi-i2-sensor-data-page.dto'
import { OpenapiI2SensorPageDto } from '../../dto/openapi-i2-sensor-page.dto'
import { OpenapiI2Service } from '../../service/openapi-i2.service'

@Controller('openapi/v1/i2')
export class OpenapiI2V1Controller {
  constructor(private openapiI2Service: OpenapiI2Service) {}

  // 查询传感器列表（分页）
  @Get('sensor/page')
  i2SensorPage(@Query() dto: OpenapiI2SensorPageDto) {
    return this.openapiI2Service.i2SensorPage(dto)
  }

  // 查询指定传感器监测数据列表（分页）
  @Get('sensor/data/page')
  i2SensorDataPage(@Query() dto: OpenapiI2SensorDataPageDto) {
    return this.openapiI2Service.i2SensorDataPage(dto)
  }
}

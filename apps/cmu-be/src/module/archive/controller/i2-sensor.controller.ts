import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { I2SensorService } from '../service/i2-sensor.service'

@Controller('api/i2_sensors')
export class I2SensorController {
  constructor(private i2SensorSvc: I2SensorService) {}

  @Get()
  getAllInfos() {
    return this.i2SensorSvc.getAllInfos()
  }

  @Post()
  addInfo(info) {
    return this.i2SensorSvc.addInfo(info)
  }

  @Post(':senId')
  updateInfoById(@Param() { senId }, @Body() body) {
    return this.i2SensorSvc.updateInfoById(senId, body)
  }

  // fixme: params 能传数组？？？
  @Delete(':senIds')
  deleteInfoById(@Param() { senIds }) {
    return this.i2SensorSvc.deleteInfoById(senIds)
  }

  @Post(':senId/debug_order')
  postSensorDebugOrder(@Param() { senId }, @Body() body) {
    return this.i2SensorSvc.postSensorDebugOrder(senId, body)
  }
}

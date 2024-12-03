import { Body, Controller, Get, Post, Query } from '@nestjs/common'

import { GetSensorDebugCommandDto } from './dto/get-sensor-debug-command.dto'
import { SendSensorDebugCommandDto } from './dto/send-sensor-debug-command.dto'
import { SensorDebugService } from './sensor-debug.service'

@Controller('api/sensor/debug')
export class SensorDebugController {
  constructor(private sensorDebugSvc: SensorDebugService) {}

  @Get('command')
  getCommand(@Query() dto: GetSensorDebugCommandDto) {
    return this.sensorDebugSvc.getCommand(dto.sensorId)
  }

  // 下发指令
  @Post('send-command')
  sendCommand(@Body() dto: SendSensorDebugCommandDto) {
    return this.sensorDebugSvc.sendCommand(dto.sensorId, dto.command, dto.args)
  }
}

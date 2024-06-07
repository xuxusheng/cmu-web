import { Body, Controller, Get, Post } from '@nestjs/common'
import { SendI2SensorDebugCommandDto } from './dto/send-i2-sensor-debug-command.dto'
import { I2SensorDebugService } from './i2-sensor-debug.service'

@Controller('api/i2/sensor/debug')
export class I2SensorDebugController {
  constructor(private i2SensorDebugSvc: I2SensorDebugService) {}

  // 获取调试命令
  @Get('command')
  getCommand() {
    return this.i2SensorDebugSvc.getCommand()
  }

  // 下发指令
  @Post('send-command')
  sendCommand(@Body() dto: SendI2SensorDebugCommandDto) {
    return this.i2SensorDebugSvc.sendCommand(dto.i2SensorId, dto.command)
  }
}

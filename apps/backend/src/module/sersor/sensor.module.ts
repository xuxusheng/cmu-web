import { Module } from '@nestjs/common'

import { SharedModule } from '../shared/shared.module'
import { SensorDebugController } from './sensor-debug.controller'
import { SensorDebugService } from './sensor-debug.service'
import { SensorController } from './sensor.controller'
import { SensorService } from './sensor.service'

@Module({
  imports: [SharedModule],
  providers: [SensorService, SensorDebugService],
  controllers: [SensorController, SensorDebugController],
  exports: [SensorService]
})
export class SensorModule {}

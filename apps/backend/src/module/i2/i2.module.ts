import { Module } from '@nestjs/common'

import { SharedModule } from '../shared/shared.module'
import { I2ConfigController } from './i2-config.controller'
import { I2ConfigService } from './i2-config.service'
import { I2SensorDebugController } from './i2-sensor-debug.controller'
import { I2SensorDebugService } from './i2-sensor-debug.service'
import { I2SensorController } from './i2-sensor.controller'
import { I2SensorService } from './i2-sensor.service'

@Module({
  imports: [SharedModule],
  controllers: [
    I2ConfigController,
    I2SensorController,
    I2SensorDebugController
  ],
  providers: [I2ConfigService, I2SensorService, I2SensorDebugService],
  exports: [I2ConfigService, I2SensorService, I2SensorDebugService]
})
export class I2Module {}

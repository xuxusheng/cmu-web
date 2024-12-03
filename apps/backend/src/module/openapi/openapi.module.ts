import { Module } from '@nestjs/common'

import { AuthModule } from '../auth/auth.module'
import { I2Module } from '../i2/i2.module'
import { SensorModule } from '../sersor/sensor.module'
import { SharedModule } from '../shared/shared.module'
import { UserModule } from '../user/user.module'
import { OpenapiAuthV1Controller } from './controller/v1/openapi-auth-v1.controller'
import { OpenapiI2V1Controller } from './controller/v1/openapi-i2-v1.controller'
import { OpenapiI2Service } from './service/openapi-i2.service'

@Module({
  imports: [SharedModule, UserModule, AuthModule, I2Module, SensorModule],
  controllers: [OpenapiAuthV1Controller, OpenapiI2V1Controller],
  providers: [OpenapiI2Service]
})
export class OpenapiModule {}

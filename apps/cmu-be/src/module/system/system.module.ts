import { Module } from '@nestjs/common'
import { SharedModule } from '../shared/shared.module'
import { SystemConfigController } from './system-config.controller'
import { SystemConfigService } from './system-config.service'
import { SystemController } from './system.controller'
import { SystemService } from './system.service'

@Module({
  imports: [SharedModule],
  providers: [SystemService, SystemConfigService],
  controllers: [SystemController, SystemConfigController]
})
export class SystemModule {}

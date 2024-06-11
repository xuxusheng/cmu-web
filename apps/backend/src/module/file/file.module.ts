import { Module } from '@nestjs/common'
import { SharedModule } from '../shared/shared.module'
import { ConfigFileController } from './controller/config-file.controller'
import { IcdFileController } from './controller/icd-file.controller'
import { LogFileController } from './controller/log-file.controller'
import { FileGateway } from './file.gateway'
import { ConfigFileService } from './service/config-file.service'
import { IcdFileService } from './service/icd-file.service'
import { LogFileService } from './service/log-file.service'

@Module({
  imports: [SharedModule],
  controllers: [ConfigFileController, IcdFileController, LogFileController],
  providers: [FileGateway, ConfigFileService, IcdFileService, LogFileService]
})
export class FileModule {}

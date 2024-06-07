import { Module } from '@nestjs/common'
import { SharedModule } from '../shared/shared.module'
import { HostStatusController } from './controller/host-status.controller'
import { I2CacController } from './controller/i2-cac.controller'
import { I2CagController } from './controller/i2-cag.controller'
import { I2GroupController } from './controller/i2-group.controller'
import { I2ParamController } from './controller/i2-param.controller'
import { I2SensorController } from './controller/i2-sensor.controller'
import { IndexController } from './controller/index.controller'
import { LogContentController } from './controller/log-content.controller'
import { SensorsController } from './controller/sensors.controller'
import { UserController } from './controller/user.controller'
import { AuthenticateService } from './service/authenticate.service'
import { DoAttrService } from './service/do-attr.service'
import { FileService } from './service/file.service'
import { HostStatusService } from './service/host-status.service'
import { I2CacService } from './service/i2-cac.service'
import { I2CagService } from './service/i2-cag.service'
import { I2GroupService } from './service/i2-group.service'
import { I2ParamgroupService } from './service/i2-paramgroup.service'
import { I2SensorService } from './service/i2-sensor.service'
import { LogContentService } from './service/log-content.service'
import { SensorService } from './service/sensor.service'
import { SysService } from './service/sys.service'
import { VerifyService } from './service/verify.service'
import { XmlService } from './service/xml.service'

/**
 * 归档的一个模块，用于暂时存放从旧项目迁移过来的代码，后续都按功能拆分后迁移到其他模块
 */
@Module({
  imports: [SharedModule],
  providers: [
    DoAttrService,
    AuthenticateService,
    FileService,
    I2CacService,
    I2CagService,
    I2GroupService,
    I2ParamgroupService,
    I2SensorService,
    LogContentService,
    SensorService,
    SysService,
    VerifyService,
    XmlService,
    HostStatusService
  ],
  controllers: [
    IndexController,
    HostStatusController,
    I2CacController,
    I2CagController,
    I2GroupController,
    I2ParamController,
    I2SensorController,
    LogContentController,
    SensorsController,
    UserController
  ],
  exports: [
    DoAttrService,
    AuthenticateService,
    FileService,
    I2CacService,
    I2CagService,
    I2GroupService,
    I2ParamgroupService,
    I2SensorService,
    LogContentService,
    SensorService,
    SysService,
    VerifyService,
    XmlService,
    HostStatusService
  ]
})
export class ArchiveModule {}

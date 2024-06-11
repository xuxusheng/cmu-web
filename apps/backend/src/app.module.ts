import { Module } from '@nestjs/common'
import { ArchiveModule } from './module/archive/archive.module'
import { AuthModule } from './module/auth/auth.module'
import { CoreModule } from './module/core/core.module'
import { FileModule } from './module/file/file.module'
import { HealthModule } from './module/health/health.module'
import { I2Module } from './module/i2/i2.module'
import { OpenapiModule } from './module/openapi/openapi.module'
import { SensorModule } from './module/sersor/sensor.module'
import { SystemModule } from './module/system/system.module'
import { UserModule } from './module/user/user.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend'),
      exclude: ['/api/(.*)']
    }),
    CoreModule,
    HealthModule,
    AuthModule,
    UserModule,
    ArchiveModule,
    SystemModule,
    SensorModule,
    I2Module,
    FileModule,
    OpenapiModule
  ]
})
export class AppModule {
}

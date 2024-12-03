import { CacheModule } from '@nestjs/cache-manager'
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { flattenDepth } from 'lodash'

import { UserModule } from '../user/user.module'
import { gMmsConfig } from './config/g-mms.config'
import { jwtConfig } from './config/jwt.config'
import { serverConfig } from './config/server.config'
import { BadRequestException } from './exception/custom-exception'
import { HttpExceptionFilter } from './exception/http-exception.filter'
import { AuthGuard } from './guard/auth.guard'
import { ResponseInterceptor } from './interceptor/response.interceptor'
import { AccessLogMiddleware } from './middleware/access-log.middleware'
import { RequestIdMiddleware } from './middleware/request-id.middleware'

/**
 * CoreModule，核心模块，用于设置全局的 Guard、Pipe、Filter、Interceptor、Middleware 等等
 * CoreModule 应该仅被 ApplicationModule 导入
 * CoreModule 的内容，理论上讲是可以全部被放入 ApplicationModule 中的，所以换个角度讲，CoreModule 可以起到简化 ApplicationModule 代码的作用
 * 注意区分 CoreModule 和 SharedModule
 */
@Module({
  imports: [
    // 缓存模块
    CacheModule.register({
      isGlobal: true
    }),
    // Config 模块，参考文档：https://docs.nestjs.com/techniques/configuration
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [gMmsConfig, jwtConfig, serverConfig]
    }),
    UserModule
  ],
  providers: [
    // 使用 provide 这种方式来声明全局的 Interceptor、Guard 等等
    // 相对于直接在 main.ts 中使用 application.use 来说，可以注入依赖（例如自定义的 ConfigService）
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        // 在 dto 中未定义的字段，将被自动过滤掉
        // 这个建议打开，防止直接将 body 传给 orm 的 update 函数时，修改了预期之外的字段。
        whitelist: true,
        transform: true,
        transformOptions: {
          // 设置为 true 后，dto 中的字段会根据声明的 ts 类型自动转换（string 到 number）
          // 例如 FindOneDto 中的 id
          enableImplicitConversion: true
        },
        // 如果有 errDetails 字段的话，这里可以将所有校验错误信息传入 errDetails 数组中
        // 没有的话，也可以直接拼接成一个字符串放入 errMsg
        exceptionFactory: (errors) =>
          new BadRequestException().setErrDetails(
            flattenDepth(
              errors.map(({ constraints }) => Object.values(constraints))
            )
          )
      })
    }
  ]
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware, AccessLogMiddleware)
      .exclude('actuator/health/liveness', 'actuator/health/readiness') // 健康检查接口无需处理
      .forRoutes('*')
  }
}

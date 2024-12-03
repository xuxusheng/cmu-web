import { All, Controller, HttpCode, HttpStatus } from '@nestjs/common'
import { HealthCheck } from '@nestjs/terminus'

import { Public } from '../shared/decorator/public'

@Controller('actuator/health')
export class HealthController {
  constructor() {}

  @All('liveness')
  @Public()
  @HealthCheck()
  @HttpCode(HttpStatus.NO_CONTENT)
  liveness() {
    return
  }

  @All('readiness')
  @Public()
  @HealthCheck()
  @HttpCode(HttpStatus.NO_CONTENT)
  readiness() {
    return
  }
}

import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from '../../../auth/auth.service'
import { LoginByClientSecretDto } from '../../../auth/dto/login-by-client-secret.dto'
import { Public } from '../../../shared/decorator/public'

@Controller('openapi/v1/auth')
export class OpenapiAuthV1Controller {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login-by-client-secret')
  async loginByClientSecret(@Body() dto: LoginByClientSecretDto) {
    const token = await this.authService.loginByClientSecret(dto)
    return {
      token
    }
  }
}

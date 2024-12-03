import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post
} from '@nestjs/common'

import { Public } from '../shared/decorator/public'
import { AuthService } from './auth.service'
import { LoginByPasswordDto } from './dto/login-by-password.dto'

@Controller('api/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name)

  constructor(private authSvc: AuthService) {}

  // 获取验证码
  @Public()
  @Get('captcha')
  getCaptcha() {
    return this.authSvc.generateCaptcha()
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login-by-password')
  async loginByPassword(@Body() dto: LoginByPasswordDto) {
    const token = await this.authSvc.loginByPassword(dto)
    return { token }
  }
}

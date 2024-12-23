import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { Cache } from 'cache-manager'
import { sign } from 'jsonwebtoken'
import { nanoid } from 'nanoid'
import svgCaptcha from 'svg-captcha'
import { Md5 } from 'ts-md5'

import { jwtConfig } from '../core/config/jwt.config'
import {
  BadRequestException,
  UnauthorizedException
} from '../core/exception/custom-exception'
import { TokenPayload } from '../shared/interface/auth'
import { UserService } from '../user/user.service'
import { LoginByClientSecretDto } from './dto/login-by-client-secret.dto'
import { LoginByPasswordDto } from './dto/login-by-password.dto'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    @Inject(jwtConfig.KEY)
    private jwtConf: ConfigType<typeof jwtConfig>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private userSvc: UserService
  ) {}

  // 通过客户端 clientId 来登录
  // 无需验证码、生成的 token 无过期时间
  loginByClientSecret = async (dto: LoginByClientSecretDto) => {
    const { clientId, clientSecret } = dto

    const client = await this.userSvc.findByUsername(clientId)

    if (!client || Md5.hashAsciiStr(clientSecret) !== client.password) {
      throw new UnauthorizedException('客户端 ID 或密钥错误，请检查后重试')
    }

    const payload: TokenPayload = {
      id: client.userId
    }

    return sign(payload, this.jwtConf.secret)
  }

  loginByPassword = async (dto: LoginByPasswordDto) => {
    const { username, password, captchaId, captchaText } = dto

    // 校验验证码是否正确
    await this.validateCaptcha(captchaId, captchaText)

    const user = await this.userSvc.findByUsername(username)

    if (!user || Md5.hashAsciiStr(password) !== user.password) {
      throw new UnauthorizedException('用户名或密码错误，请检查后重试')
    }

    const payload: TokenPayload = {
      id: user.userId
    }

    // 登录成功再删除缓存
    await this.deleteCaptcha(captchaId)

    return sign(payload, this.jwtConf.secret, {
      expiresIn: 60 * 60 * 2 // 有效期 2 小时
    })
  }

  // 校验验证码
  validateCaptcha = async (id: string, text: string) => {
    const key = `captcha:${id}`
    const cachedText = await this.cacheManager.get<string>(key)

    if (!cachedText) {
      throw new BadRequestException('验证码已过期，请重新获取')
    }

    if (cachedText.toLowerCase() !== text.toLowerCase()) {
      throw new BadRequestException('验证码错误，请检查后重试')
    }
  }

  // 删除验证码缓存
  deleteCaptcha = async (id: string) => {
    const key = `captcha:${id}`
    await this.cacheManager.del(key)
  }

  // 生成验证码
  generateCaptcha = async () => {
    const { text, data } = svgCaptcha.create({})
    // 生成一个 id 作为验证码的唯一标识
    const id = nanoid()

    // 将验证码存入缓存
    const key = `captcha:${id}`

    await this.cacheManager.set(key, text, 1000 * 60 * 60 * 24)

    return {
      id,
      svg: data
    }
  }
}

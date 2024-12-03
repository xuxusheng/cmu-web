import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger
} from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { TokenExpiredError, verify } from 'jsonwebtoken'

import { IS_PUBLIC_KEY } from '../../shared/decorator/public'
import { TokenPayload } from '../../shared/interface/auth'
import { UserService } from '../../user/user.service'
import { jwtConfig } from '../config/jwt.config'
import {
  TokenEmptyException,
  TokenExpiredException,
  TokenInvalidException
} from '../exception/custom-exception'

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name)

  constructor(
    private reflector: Reflector,
    @Inject(jwtConfig.KEY)
    private jwtConf: ConfigType<typeof jwtConfig>,
    private userSvc: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (isPublic) {
      // 标记为 public 的接口，不进行校验
      return true
    }

    const req = context.switchToHttp().getRequest<Request>()
    const token = req.header('Authorization')?.replace(/^Bearer /i, '')

    if (!token) {
      throw new TokenEmptyException()
    }

    let payload: TokenPayload

    try {
      payload = verify(token, this.jwtConf.secret) as TokenPayload
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new TokenExpiredException().setErrDebug(e.message)
      }

      // 其他 token 错误
      throw new TokenInvalidException().setErrDebug(e.message)
    }

    if (!payload.id) {
      throw new TokenInvalidException('您的账号不存在或已被删除，请重新登录')
    }

    // 校验通过
    const user = await this.userSvc.findById(payload.id)
    if (!user) {
      throw new TokenInvalidException('您的账号不存在或已被删除，请重新登录')
    }

    req.user = user

    return true
  }
}

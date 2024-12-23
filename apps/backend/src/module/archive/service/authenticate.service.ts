import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { sign } from 'jsonwebtoken'

import { jwtConfig } from '../../core/config/jwt.config'
import { UserInfoTblEntity } from '../../shared/model/entity/cfg/user-info-tbl.entity'
import { KnexService } from '../../shared/service/knex.service'

@Injectable()
export class AuthenticateService {
  constructor(
    @Inject(jwtConfig.KEY)
    private jwtConf: ConfigType<typeof jwtConfig>,
    private knexSvc: KnexService
  ) {}

  checkLogin = (authInfo) => {
    const db = this.knexSvc.getCfgDB()

    return db<UserInfoTblEntity>('user_info_tbl')
      .select()
      .where('user_name', authInfo.userName)
      .first()
  }

  makeToken = (userName, userLevel) => {
    return sign(
      { user: userName, isAdmin: userLevel == 1 },
      this.jwtConf.secret,
      {
        expiresIn: 120 * 60,
        algorithm: 'HS256'
      }
    )
  }
}

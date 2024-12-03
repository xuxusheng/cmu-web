import { IsIn, IsInt, IsNotEmpty, IsString } from 'class-validator'

import { UserLevelEnum } from '../enum/user-level.enum'

export class UserCreateDto {
  @IsString()
  @IsNotEmpty()
  username: string // 用户名

  @IsString()
  @IsNotEmpty()
  password: string // 密码

  @IsInt()
  @IsIn([UserLevelEnum.Admin, UserLevelEnum.Member, UserLevelEnum.Client])
  level: number // 用户级别
}

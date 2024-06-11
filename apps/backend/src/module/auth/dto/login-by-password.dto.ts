import { IsNotEmpty, IsString } from 'class-validator'

export class LoginByPasswordDto {
  // 用户名
  @IsString()
  @IsNotEmpty()
  username: string

  // 密码
  @IsString()
  @IsNotEmpty()
  password: string

  // 验证码 ID
  @IsString()
  @IsNotEmpty()
  captchaId: string

  // 验证码值
  @IsString()
  @IsNotEmpty()
  captchaText: string
}

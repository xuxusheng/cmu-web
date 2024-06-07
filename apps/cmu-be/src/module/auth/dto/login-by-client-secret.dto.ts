import { IsNotEmpty, IsString } from 'class-validator'

export class LoginByClientSecretDto {
  @IsString()
  @IsNotEmpty({
    message: '客户端 ID 不能为空'
  })
  clientId: string // 客户端 ID

  @IsString()
  @IsNotEmpty({
    message: '客户端密钥不能为空'
  })
  clientSecret: string
}

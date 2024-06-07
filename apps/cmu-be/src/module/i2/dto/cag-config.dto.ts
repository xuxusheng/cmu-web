import { IsIP, IsNotEmpty, IsPositive, IsString } from 'class-validator'

export class CagConfigDto {
  @IsIP()
  cagIp: string // IP 地址

  @IsPositive()
  cagPort: number // 端口号

  @IsString()
  @IsNotEmpty()
  cagServiceLocate: string // 服务地址

  @IsString()
  @IsNotEmpty()
  cagNamespace: string // 命名空间

  @IsPositive()
  timeoutTime: number // 超时时间
}

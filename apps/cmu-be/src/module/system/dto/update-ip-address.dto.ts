import { IsIP } from 'class-validator'

export class UpdateIpAddressDto {
  @IsIP()
  ip: string // IP 地址

  @IsIP()
  netmask: string // 子网掩码

  @IsIP()
  gateway: string // 网关地址
}

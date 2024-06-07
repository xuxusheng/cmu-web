import { IsBoolean, IsIP, IsNumber } from 'class-validator'

export class SetNtpConfigDto {
  // NTP 服务器 IP
  @IsIP()
  ntpServerIp: string

  // 对时周期
  @IsNumber()
  syncCycle: number

  // 启用共享
  @IsBoolean()
  isUseSharedMem: boolean

  // 网络超时时间
  @IsNumber()
  outTime: number
}

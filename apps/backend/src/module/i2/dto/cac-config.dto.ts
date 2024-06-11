import {
  IsIP,
  IsISO8601,
  IsNotEmpty,
  IsPositive,
  IsString
} from 'class-validator'

export class CacConfigDto {
  @IsString()
  @IsNotEmpty()
  cacId: string // CAC 编码

  @IsIP()
  @IsNotEmpty()
  cacIp: string // IP 地址

  @IsPositive()
  heartbeatPeriod: number // 心跳周期

  @IsISO8601({ strict: true })
  nextHeartbeatTime: string // 下次心跳时间
}

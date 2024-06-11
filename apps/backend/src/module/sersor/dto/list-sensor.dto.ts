import { IsOptional, IsString } from 'class-validator'

export class ListSensorDto {
  @IsString()
  @IsOptional()
  descCn: string // 设备描述

  @IsString()
  @IsOptional()
  lnClass: string // 设备类型
}

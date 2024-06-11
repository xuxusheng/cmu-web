import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator'

export class PageSensorDto {
  @IsNumber()
  @IsPositive()
  pn: number

  @IsNumber()
  @IsPositive()
  ps: number

  @IsString()
  @IsOptional()
  lnClass: string // 设备类型

  @IsString()
  @IsOptional()
  sensorType: string // 设备型号

  @IsNumber()
  @IsOptional()
  commType: number // 通信类型
}

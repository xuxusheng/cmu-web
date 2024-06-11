import { IsISO8601, IsNotEmpty, IsPositive, IsString } from 'class-validator'

export class I2SensorDto {
  @IsString()
  @IsNotEmpty()
  code: string

  @IsString()
  @IsNotEmpty()
  lnInst: string // 传感器名称

  @IsPositive()
  groupId: number // 分组 ID

  @IsString()
  @IsNotEmpty()
  equipmentId: string // 一次设备编码

  @IsString()
  @IsNotEmpty()
  descCn: string // i2 设备描述

  @IsPositive()
  @IsNotEmpty()
  dataUploadPeriod: number // 数据上传周期

  @IsNotEmpty()
  @IsISO8601()
  nextDataUploadTime: string // 时间

  @IsPositive()
  phaseId: number // 相别
}

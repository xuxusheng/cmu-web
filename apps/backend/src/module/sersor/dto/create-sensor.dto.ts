import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator'

export class CreateSensorDto {
  @IsString()
  @IsNotEmpty()
  lnClass: string // 设备类型

  @IsString()
  @IsNotEmpty()
  sensorType: string // 设备型号

  @IsNumber()
  commType: number // 通信类型

  @IsString()
  descCn: string // 设备描述

  @IsString()
  @IsNotEmpty()
  lnInst: string // 设备号

  @IsString()
  @IsNotEmpty()
  sAddr: string // 短地址

  @IsArray()
  @IsOptional()
  attrs: Array<{
    key: string // 属性字段名
    value: string // 属性值
  }>
}

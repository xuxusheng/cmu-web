import { IsNotEmpty, IsString } from 'class-validator'

export class GetSensorAttrsDto {
  @IsString()
  @IsNotEmpty()
  lnClass: string // 设备类型

  @IsString()
  @IsNotEmpty()
  sensorType: string // 设备型号
}

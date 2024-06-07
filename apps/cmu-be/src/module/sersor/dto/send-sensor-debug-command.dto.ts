import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class SendSensorDebugCommandDto {
  @IsNumber()
  sensorId: number // 传感器 ID

  @IsString()
  @IsNotEmpty()
  command: string // 命令

  @IsString()
  @IsOptional()
  args?: string = '' // 参数
}

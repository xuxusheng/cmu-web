import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class SendI2SensorDebugCommandDto {
  @IsNumber()
  i2SensorId: number // 传感器 ID

  @IsString()
  @IsNotEmpty()
  command: string // 命令
}

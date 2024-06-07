import { IsNumber } from 'class-validator'

export class GetSensorDebugCommandDto {
  @IsNumber()
  sensorId: number
}

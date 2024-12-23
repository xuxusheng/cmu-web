import { IsNumber } from 'class-validator'

import { CreateSensorDto } from './create-sensor.dto'

export class UpdateSensorDto extends CreateSensorDto {
  @IsNumber()
  id: number
}

import { IsNumber, IsPositive } from 'class-validator'

export class PageI2SensorDto {
  @IsNumber()
  @IsPositive()
  pn: number

  @IsNumber()
  @IsPositive()
  ps: number
}

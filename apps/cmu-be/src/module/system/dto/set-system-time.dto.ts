import { IsISO8601, IsNotEmpty, IsString } from 'class-validator'

export class SetSystemTimeDto {
  @IsString()
  @IsISO8601()
  @IsNotEmpty()
  systemTime: string // ISO 时间字符串
}

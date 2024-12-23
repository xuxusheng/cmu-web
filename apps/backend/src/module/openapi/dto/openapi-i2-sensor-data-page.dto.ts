import { IsISO8601, IsNotEmpty, IsOptional, IsString } from 'class-validator'

import { PageDto } from '../../shared/dto/page.dto'

export class OpenapiI2SensorDataPageDto extends PageDto {
  @IsString()
  @IsNotEmpty({
    message: '参数 sensorCode（传感器编码）不能为空'
  })
  sensorCode: string

  @IsOptional()
  @IsISO8601(
    {},
    {
      message:
        '参数 startTime（开始时间）格式错误，正确格式：YYYY-MM-DD HH:mm:ss'
    }
  )
  startTime?: string

  @IsOptional()
  @IsISO8601(
    {},
    {
      message: '参数 endTime（结束时间）格式错误，正确格式：YYYY-MM-DD HH:mm:ss'
    }
  )
  endTime?: string
}

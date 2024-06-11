import { IsInt, IsNotEmpty, IsString } from 'class-validator'

export class IedDataPageDto {
  @IsInt({ message: '参数 pn 不能为空' })
  pn: number

  @IsInt({
    message: '参数 ps 不能为空'
  })
  ps: number

  @IsString()
  @IsNotEmpty({
    message: '参数 deviceId 不能为空'
  })
  deviceId: string

  @IsString()
  @IsNotEmpty({
    message: '参数 sensorCode 不能为空'
  })
  sensorCode: string
}

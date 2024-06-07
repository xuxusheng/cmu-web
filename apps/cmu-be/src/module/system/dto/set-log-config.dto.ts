import { IsBoolean, IsNumber, IsString } from 'class-validator'

export class SetLogConfigDto {
  // 是否启用日志文件
  @IsBoolean()
  logFileEnable: boolean

  // 日志文件大小
  @IsNumber()
  logFileSize: number

  // 是否启用缓存
  @IsBoolean()
  logCacheEnable: boolean

  // 日志缓存大小
  @IsNumber()
  logBufferSize: number

  // 日志目录
  @IsString()
  logDir: string

  // 最大日志文件个数
  @IsNumber()
  logFileMaxNum: number

  // 日志文件名
  @IsString()
  logFileName: string

  // 是否分割日志
  @IsBoolean()
  logFileSplitEnable: boolean
}

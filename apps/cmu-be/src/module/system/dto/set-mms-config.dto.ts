import { IsNumber, IsString } from 'class-validator'

export class SetMmsConfigDto {
  // ICD 文件目录
  @IsString()
  icdFileDir: string

  // ICD 文件名
  @IsString()
  icdFileName: string

  // IED 名称
  @IsString()
  iedName: string

  // AP 名称
  @IsString()
  apName: string

  // MMS 报告扫描频率
  @IsNumber()
  mmsReportScanRate: number

  // MMS 报告缓存大小
  @IsNumber()
  mmsReportCacheSize: number

  // MMS 日志扫描频率
  @IsNumber()
  mmsLogScanRate: number

  // MMS 日志最大条目数
  @IsNumber()
  mmsLogMaxEntry: number

  // MMS 日志 Tag 名
  @IsString()
  mmsLogTagName: string

  // MMS 日志存储文件
  @IsString()
  mmsLogFile: string

  // MMS 日志存储条目数
  @IsNumber()
  mmsLogEntry: number

  // MMS 文件目录
  @IsString()
  mmsFileDir: string
}

import { IsIn, IsISO8601, IsOptional, IsString } from 'class-validator'

export class GetReportDataDto {
  @IsISO8601()
  @IsOptional()
  reportTimeBegin?: string // 上报时间范围开始 2023-08-27 16:32:00

  @IsISO8601()
  @IsOptional()
  reportTimeEnd?: string // 上报时间范围结束 2023-08-27 16:32:00

  @IsString()
  @IsOptional()
  orderBy?: string // 排序字段

  @IsString()
  @IsOptional()
  @IsIn(['desc', 'asc'])
  orderSort?: string
}

import { IsInt } from 'class-validator'

export class PageDto {
  @IsInt({
    message: '参数 pn 不能为空（查询第几页）'
  })
  pn: number

  @IsInt({
    message: '参数 ps 不能为空（每页多少条数据）'
  })
  ps: number
}

import { IsNotEmpty, IsString } from 'class-validator'

export class GetIedAndApNameDto {
  @IsString()
  @IsNotEmpty()
  icdFileName: string // icd 文件名称
}

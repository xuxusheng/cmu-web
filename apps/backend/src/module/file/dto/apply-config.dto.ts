import { IsIn, IsNotEmpty, IsString } from 'class-validator'

import { ConfigFileType } from '../enum/config'

// 应用配置文件
export class ApplyConfigDto {
  @IsString()
  @IsNotEmpty()
  filename: string // 配置文件名

  @IsString()
  @IsNotEmpty()
  @IsIn([ConfigFileType.N, ConfigFileType.S])
  type: string
}

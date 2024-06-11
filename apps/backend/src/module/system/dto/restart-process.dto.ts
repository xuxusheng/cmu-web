import { IsNotEmpty, IsString } from 'class-validator'

export class RestartProcessDto {
  @IsString()
  @IsNotEmpty()
  processName: string // 进程名称
}

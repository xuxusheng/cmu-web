import { IsIn, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator'

export class UpdateCollectConfigDto {
  @IsIn([0, 1])
  autoRun: number // 自动采集[On,Off],(On)

  @IsNumber()
  @Min(0)
  @Max(100)
  cpuTh: number

  @IsNumber()
  invalidData: number

  @IsNumber()
  @Min(0)
  @Max(100)
  invalidQuality: number

  @IsNumber()
  @Min(0)
  @Max(100)
  memoryTh: number

  @IsNumber()
  saveMode: number

  @IsIn([0, 1])
  sendMsg: number

  @IsString()
  @IsNotEmpty()
  destStaticFile: string

  @IsString()
  @IsNotEmpty()
  sourceStaticFile: string

  @IsNumber()
  soundAlmDo: number
}

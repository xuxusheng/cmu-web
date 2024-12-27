import { IsOptional, IsString } from 'class-validator'

export class GetLatestDataDto {
  @IsString({
    each: true
  })
  @IsOptional()
  descPrefixes?: string[]
}

import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class ExistsByUsernameDto {
  @IsString()
  @IsNotEmpty()
  username: string

  @IsNumber()
  @IsOptional()
  excludeId?: number
}

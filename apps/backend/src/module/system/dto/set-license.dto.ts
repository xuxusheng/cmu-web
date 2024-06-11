import { IsNotEmpty, IsString } from 'class-validator'

export class SetLicenseDto {
  @IsString()
  @IsNotEmpty()
  license: string
}

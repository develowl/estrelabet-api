import { PickType } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import { SigninDto } from './signin.dto'

export class RefreshTokensDto extends PickType(SigninDto, ['identifier'] as const) {
  @IsNotEmpty()
  @IsString()
  refreshToken: string
}

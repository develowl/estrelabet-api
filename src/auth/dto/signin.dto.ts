import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class SigninDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'username',
    description: 'Username is going to be used to authenticate on api'
  })
  identifier: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '1@EstrelaBet',
    description: 'Password is going to be used to authenticate on api'
  })
  password: string
}

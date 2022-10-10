import { ApiProperty } from '@nestjs/swagger'
import { IsCEP } from 'brazilian-class-validator'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class AddressDto {
  @IsNotEmpty()
  @IsCEP()
  @ApiProperty({ example: '99999-999' })
  cep: string

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 26 })
  num: number
}

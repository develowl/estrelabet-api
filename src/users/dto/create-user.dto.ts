import { ApiProperty } from '@nestjs/swagger'
import { IsCPF } from 'brazilian-class-validator'
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsPositive, IsString } from 'class-validator'
import { AddressDto } from '../../common/dtos/address.dto'

export class CreateUserDto {
  @IsNotEmpty()
  @IsCPF()
  @ApiProperty({ example: '123.456.789-01' })
  cpf: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Fulano da Silva' })
  name: string

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'fulano@company.com' })
  email: string

  @IsNotEmpty()
  @IsPhoneNumber('BR')
  @ApiProperty({ example: '(53) 987412155' })
  phone: string

  @IsNotEmpty()
  @ApiProperty()
  address: AddressDto

  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({ example: 1 })
  idCompany: number
}

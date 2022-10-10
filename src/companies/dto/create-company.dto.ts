import { ApiProperty } from '@nestjs/swagger'
import { IsCNPJ } from 'brazilian-class-validator'
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator'
import { AddressDto } from '../../common/dtos/address.dto'

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsCNPJ()
  @ApiProperty({ example: '11.111.111/1111-11' })
  cnpj: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Company S.A.' })
  name: string

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'company@company.com' })
  email: string

  @IsNotEmpty()
  @IsPhoneNumber('BR')
  @ApiProperty({ example: '(53) 987412155' })
  phone: string

  @IsNotEmpty()
  @ApiProperty()
  address: AddressDto
}

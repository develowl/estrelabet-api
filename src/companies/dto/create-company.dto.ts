import { IsCNPJ } from 'brazilian-class-validator'
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator'
import { AddressDto } from '../../common/dtos/address.dto'

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsCNPJ()
  cnpj: string

  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsPhoneNumber('BR')
  phone: string

  @IsNotEmpty()
  address: AddressDto
}

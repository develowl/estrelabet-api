import { IsCNPJ } from 'brazilian-class-validator'
import { IsNotEmpty } from 'class-validator'
import { IsEmail, IsPhoneNumber, IsString } from 'class-validator/types/decorator/decorators'
import { AddressDto } from 'src/common/dtos/address.dto'

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

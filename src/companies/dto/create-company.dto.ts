import { IsCEP, IsCNPJ } from 'brazilian-class-validator'
import { IsNotEmpty } from 'class-validator'
import {
  IsEmail,
  IsNumber,
  IsPhoneNumber,
  IsString
} from 'class-validator/types/decorator/decorators'

class AddressDto {
  @IsNotEmpty()
  @IsCEP()
  cep: string

  @IsNotEmpty()
  @IsNumber()
  num: number
}

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

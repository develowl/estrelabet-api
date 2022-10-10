import { IsCPF } from 'brazilian-class-validator'
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsPositive, IsString } from 'class-validator'
import { AddressDto } from '../../common/dtos/address.dto'

export class CreateUserDto {
  @IsNotEmpty()
  @IsCPF()
  cpf: string

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

  @IsNotEmpty()
  @IsPositive()
  idCompany: number
}

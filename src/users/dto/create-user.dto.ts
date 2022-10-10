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
  email: 'user@company.com'

  @IsNotEmpty()
  @IsPhoneNumber('BR')
  phone: '5198478874'

  @IsNotEmpty()
  address: AddressDto

  @IsNotEmpty()
  @IsPositive()
  idCompany: number
}

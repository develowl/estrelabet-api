import { IsCEP } from 'brazilian-class-validator'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class AddressDto {
  @IsNotEmpty()
  @IsCEP()
  cep: string

  @IsNotEmpty()
  @IsNumber()
  num: number
}

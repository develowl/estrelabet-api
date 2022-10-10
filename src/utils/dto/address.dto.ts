import { IsCEP } from 'brazilian-class-validator'
import { IsNotEmpty } from 'class-validator'
import { IsNumber } from 'class-validator/types/decorator/decorators'

export class AddressDto {
  @IsNotEmpty()
  @IsCEP()
  cep: string

  @IsNotEmpty()
  @IsNumber()
  num: number
}

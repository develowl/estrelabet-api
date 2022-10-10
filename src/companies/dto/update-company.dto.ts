import { PartialType } from '@nestjs/mapped-types'
import { OmitType } from '@nestjs/mapped-types/dist'
import { CreateCompanyDto } from './create-company.dto'

export class UpdateCompanyDto extends OmitType(PartialType(CreateCompanyDto), ['cnpj'] as const) {}

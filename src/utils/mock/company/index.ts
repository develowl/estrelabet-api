import { CreateCompanyDto } from '../../../companies/dto/create-company.dto'
import { Company } from '../../../companies/entities/company.entity'

export const mockCreateCompanyDto: CreateCompanyDto = {
  cnpj: '11.111.111/1111-11',
  name: 'Company S.A.',
  email: 'company@company.com',
  phone: '51941457841',
  address: {
    cep: '99999-999',
    num: 26
  }
}

export const mockCompany: Company = {
  id: 1,
  ...mockCreateCompanyDto,
  address: 'Rua Silva, 26, Santo Amaro, São José - GO, 99999-999'
}

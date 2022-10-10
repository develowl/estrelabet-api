import { CreateCompanyDto } from '../../../companies/dto/create-company.dto'
import { UpdateCompanyDto } from '../../../companies/dto/update-company.dto'
import { Company } from '../../../companies/entities/company.entity'
import { mockUser } from '../users'

export const mockCreateCompanyDto: CreateCompanyDto = {
  cnpj: '11.111.111/1111-11',
  name: 'Company S.A.',
  email: 'company@company.com',
  phone: '51941457841',
  address: {
    cep: '93290-440',
    num: 26
  }
}

export const mockUpdateCompanyDto: (withAddress?: boolean) => UpdateCompanyDto = (
  withAddress = true
) => ({
  name: 'Company LTDA',
  email: 'company@company.com',
  phone: '51941457841',
  address: !withAddress
    ? undefined
    : {
        cep: '93290-440',
        num: 26
      }
})

export const mockCompany: Company = {
  id: 1,
  ...mockCreateCompanyDto,
  cnpj: '11111111111111',
  address: 'Rua Silva, 26, Santo Amaro, São José - GO, 99999-999',
  users: [mockUser]
}

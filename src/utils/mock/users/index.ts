import { UpdateUserDto } from 'src/users/dto/update-user.dto'
import { CreateUserDto } from '../../../users/dto/create-user.dto'
import { User } from '../../../users/entities/user.entity'
import { mockCompany } from '../company'

const baseUserDto = {
  cpf: '025474198475',
  name: 'User',
  email: 'user@company.com',
  phone: '5198478874'
}

export const mockCreateUserDto: CreateUserDto = {
  ...baseUserDto,
  address: {
    cep: '11111-111',
    num: 26
  },
  idCompany: 1
}

export const mockUpdateUserDto: (withAddress?: boolean, newCompany?: boolean) => UpdateUserDto = (
  withAddress = false,
  newCompany = false
) => ({
  name: 'User',
  email: 'user@newcompany.com',
  phone: '54874523658',
  address: !withAddress
    ? undefined
    : {
        cep: '99999-999',
        num: 26
      },
  idCompany: !newCompany ? undefined : 2
})

export const mockUser: User = {
  id: 1,
  ...baseUserDto,
  address: 'Rua abc, 123, Jardim Planalto, Esteio - RS, 11111-111',
  company: mockCompany
}

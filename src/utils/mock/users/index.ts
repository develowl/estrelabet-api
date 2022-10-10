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

export const mockUser: User = {
  id: 1,
  ...baseUserDto,
  address: 'Rua abc, 123, Jardim Planalto, Esteio - RS, 11111-111',
  company: mockCompany
}

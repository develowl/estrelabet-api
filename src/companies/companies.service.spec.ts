import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { CompaniesService } from './companies.service'
import { Company } from './entities/company.entity'

describe('CompaniesService', () => {
  let companiesService: CompaniesService

  const mockRepository = {
    find: jest.fn(),
    findOneOrFail: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }

  const mockCompany = {
    id: 1,
    cnpj: '22.980.324/0001-43',
    name: 'Company',
    email: 'company@company.com.br',
    phone: '+551194712544',
    address: 'rua abc, 123, jardim fgh, São Paulo - SP'
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: getRepositoryToken(Company),
          useValue: mockRepository
        }
      ]
    }).compile()

    companiesService = await module.get(CompaniesService)
  })

  afterEach(() => jest.clearAllMocks())

  describe('find', () => {
    it('should return an array of companies', async () => {
      const result = [mockCompany]
      jest.spyOn(mockRepository, 'find').mockReturnValueOnce(result)

      expect(await companiesService.find()).toHaveLength(1)
      expect(mockRepository.find).toHaveBeenCalledTimes(1)
    })
  })
})

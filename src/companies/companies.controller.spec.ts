import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { mockCompany } from '../utils/mock/company'
import { CompaniesController } from './companies.controller'
import { CompaniesService } from './companies.service'
import { Company } from './entities/company.entity'

describe('CompaniesController', () => {
  let companiesController: CompaniesController
  let companiesService: CompaniesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompaniesController],
      providers: [
        CompaniesService,
        {
          provide: getRepositoryToken(Company),
          useClass: Repository
        }
      ]
    }).compile()

    companiesController = module.get<CompaniesController>(CompaniesController)
    companiesService = module.get<CompaniesService>(CompaniesService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(companiesController).toBeDefined()
  })

  describe('get', () => {
    it('should return a valid company', async () => {
      const spyGet = jest.spyOn(companiesService, 'get').mockResolvedValueOnce(mockCompany)

      expect(await companiesController.get(mockCompany.id)).toStrictEqual(mockCompany)
      expect(spyGet).toHaveBeenCalledWith(mockCompany.id)
    })
  })
})

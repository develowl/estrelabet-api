import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CompaniesController } from './companies.controller'
import { CompaniesService } from './companies.service'
import { Company } from './entities/company.entity'

describe('CompaniesController', () => {
  let companiesController: CompaniesController

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

    companiesController = await module.get<CompaniesController>(CompaniesController)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(companiesController).toBeDefined()
  })
})

import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { mockCompany, mockCreateCompanyDto, mockUpdateCompanyDto } from '../utils/mock/company'
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
      const spyGet = jest.spyOn(companiesController, 'get')
      jest.spyOn(companiesService, 'get').mockResolvedValueOnce(mockCompany)

      expect(await companiesController.get(mockCompany.id)).toStrictEqual(mockCompany)
      expect(spyGet).toHaveBeenCalledWith(mockCompany.id)
    })
  })

  describe('list', () => {
    it('should return an array of valid companies', async () => {
      jest.spyOn(companiesService, 'find').mockResolvedValueOnce([mockCompany])
      expect(await companiesController.find()).toStrictEqual([mockCompany])
    })
  })

  describe('create', () => {
    it('should create and return a valid company', async () => {
      const spyCreate = jest.spyOn(companiesController, 'create')
      jest.spyOn(companiesService, 'create').mockResolvedValueOnce(mockCompany)

      expect(await companiesController.create(mockCreateCompanyDto)).toStrictEqual(mockCompany)
      expect(spyCreate).toHaveBeenCalledWith(mockCreateCompanyDto)
    })
  })

  describe('update', () => {
    it('should update and return a valid company', async () => {
      const mockMergedCompany = {
        ...mockCompany,
        name: mockUpdateCompanyDto().name
      }
      const spyUpdate = jest.spyOn(companiesController, 'update')
      jest.spyOn(companiesService, 'update').mockResolvedValueOnce(mockMergedCompany)

      expect(
        await companiesController.update(mockCompany.id, mockUpdateCompanyDto())
      ).toStrictEqual(mockMergedCompany)
      expect(spyUpdate).toHaveBeenCalledWith(mockCompany.id, mockUpdateCompanyDto())
    })
  })
})

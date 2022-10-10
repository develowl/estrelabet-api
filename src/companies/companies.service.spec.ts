import { BadRequestException, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import mockFetch from 'jest-fetch-mock'
import { mockCompany, mockCompanyDto } from '../utils/mock/company'
import { mockConfigService } from '../utils/mock/configService'
import { mockRepository } from '../utils/mock/repository'
import { CompaniesService } from './companies.service'
import { Company } from './entities/company.entity'

mockFetch.enableMocks()

describe('CompaniesService', () => {
  let companiesService: CompaniesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: getRepositoryToken(Company),
          useValue: mockRepository
        },
        {
          provide: ConfigService,
          useValue: mockConfigService
        }
      ]
    }).compile()

    companiesService = await module.get(CompaniesService)
  })

  afterEach(() => {
    jest.clearAllMocks()
    fetchMock.mockClear()
  })

  describe('findOneByOrFail', () => {
    it('should return a valid company', async () => {
      jest.spyOn(mockRepository, 'findOneByOrFail').mockReturnValueOnce(mockCompany)

      expect(await companiesService.get(mockCompany.id)).toBe(mockCompany)
      expect(mockRepository.findOneByOrFail).toHaveBeenCalledTimes(1)
    })

    it('should throws an exception when not found a valid company', async () => {
      jest
        .spyOn(mockRepository, 'findOneByOrFail')
        .mockReturnValueOnce(new Promise((_, reject) => reject(new NotFoundException())))

      await expect(companiesService.get(mockCompany.id)).rejects.toThrow(NotFoundException)
    })
  })

  describe('find', () => {
    it('should return an array of companies', async () => {
      jest.spyOn(mockRepository, 'find').mockReturnValueOnce([mockCompany])

      expect(await companiesService.find()).toHaveLength(1)
      expect(mockRepository.find).toHaveBeenCalledTimes(1)
    })
  })

  describe('create/save', () => {
    it('should return a new company', async () => {
      mockFetch.mockResponseOnce(JSON.stringify(mockCompanyDto.address))
      jest.spyOn(mockRepository, 'create').mockReturnValueOnce(mockCompany)
      jest.spyOn(mockRepository, 'save').mockReturnValueOnce(mockCompany)

      expect(await companiesService.create(mockCompanyDto)).toStrictEqual(mockCompany)
      expect(mockRepository.create).toHaveBeenCalledTimes(1)
      expect(mockRepository.save).toHaveBeenCalledTimes(1)
    })

    it('should throws an exception when creation goes wrong', async () => {
      jest
        .spyOn(mockRepository, 'save')
        .mockReturnValueOnce(new Promise((_, reject) => reject(new BadRequestException())))

      await expect(companiesService.create(mockCompanyDto)).rejects.toThrow(BadRequestException)
    })
  })
})

import { BadRequestException, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import mockFetch from 'jest-fetch-mock'
import { Repository } from 'typeorm'
import { mockCompany, mockCreateCompanyDto, mockUpdateCompanyDto } from '../utils/mock/company'
import { mockConfigService } from '../utils/mock/configService'
import { CompaniesService } from './companies.service'
import { Company } from './entities/company.entity'

mockFetch.enableMocks()

describe('CompaniesService', () => {
  let companiesService: CompaniesService
  let mockRepository: Repository<Company>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: getRepositoryToken(Company),
          useClass: Repository
        },
        {
          provide: ConfigService,
          useValue: mockConfigService
        }
      ]
    }).compile()

    companiesService = await module.get(CompaniesService)
    mockRepository = module.get<Repository<Company>>(getRepositoryToken(Company))
  })

  afterEach(() => {
    fetchMock.mockClear()
    jest.clearAllMocks()
  })

  describe('get', () => {
    it('should return a valid company', async () => {
      const spyGet = jest.spyOn(companiesService, 'get')
      jest.spyOn(mockRepository, 'findOneByOrFail').mockResolvedValueOnce(mockCompany)

      expect(await companiesService.get(mockCompany.id)).toBe(mockCompany)
      expect(mockRepository.findOneByOrFail).toHaveBeenCalledTimes(1)
      expect(spyGet).toHaveBeenCalledWith(mockCompany.id)
    })

    it('should throws an exception when not found a valid company', async () => {
      jest
        .spyOn(mockRepository, 'save')
        .mockReturnValueOnce(new Promise((_, reject) => reject(new NotFoundException())))

      await expect(companiesService.get(mockCompany.id)).rejects.toThrow(NotFoundException)
    })
  })

  describe('find', () => {
    it('should return an array of companies', async () => {
      jest.spyOn(mockRepository, 'find').mockResolvedValueOnce([mockCompany])

      expect(await companiesService.find()).toHaveLength(1)
      expect(mockRepository.find).toHaveBeenCalledTimes(1)
    })
  })

  describe('create/save', () => {
    it('should return a new company', async () => {
      mockFetch.mockResponseOnce(JSON.stringify(mockCreateCompanyDto.address))
      jest.spyOn(mockRepository, 'create').mockReturnValueOnce(mockCompany)
      jest.spyOn(mockRepository, 'save').mockResolvedValueOnce(mockCompany)

      expect(await companiesService.create(mockCreateCompanyDto)).toStrictEqual(mockCompany)
      expect(mockRepository.create).toHaveBeenCalledTimes(1)
      expect(mockRepository.save).toHaveBeenCalledTimes(1)
    })

    it('should throws an exception when creation goes wrong', async () => {
      jest
        .spyOn(mockRepository, 'findOneByOrFail')
        .mockReturnValueOnce(new Promise((_, reject) => reject(new BadRequestException())))

      await expect(companiesService.create(mockCreateCompanyDto)).rejects.toThrow(
        BadRequestException
      )
    })
  })

  describe('update', () => {
    it('should return a company with updated data - with address', async () => {
      const mockMergedCompany = {
        ...mockCompany,
        name: mockUpdateCompanyDto().name
      }
      const spyUpdate = jest.spyOn(companiesService, 'update')
      jest.spyOn(companiesService, 'get').mockResolvedValueOnce(mockCompany)
      mockFetch.mockResponseOnce(JSON.stringify(mockUpdateCompanyDto().address))
      jest.spyOn(mockRepository, 'merge').mockReturnValueOnce(mockMergedCompany)
      jest.spyOn(mockRepository, 'save').mockResolvedValueOnce(mockMergedCompany)

      expect(await companiesService.update(mockCompany.id, mockUpdateCompanyDto())).toStrictEqual(
        mockMergedCompany
      )

      expect(mockRepository.merge).toHaveBeenCalledTimes(1)
      expect(mockRepository.save).toHaveBeenCalledTimes(1)
      expect(spyUpdate).toHaveBeenCalledWith(mockCompany.id, mockUpdateCompanyDto())
    })

    it('should return a company with updated data - without address', async () => {
      const mockMergedCompany = {
        ...mockCompany,
        name: mockUpdateCompanyDto().name
      }

      const spyUpdate = jest.spyOn(companiesService, 'update')
      jest.spyOn(companiesService, 'get').mockResolvedValueOnce(mockCompany)
      jest.spyOn(mockRepository, 'merge').mockReturnValueOnce(mockMergedCompany)
      jest.spyOn(mockRepository, 'save').mockResolvedValueOnce(mockMergedCompany)

      expect(
        await companiesService.update(mockCompany.id, mockUpdateCompanyDto(false))
      ).toStrictEqual(mockMergedCompany)

      expect(mockRepository.merge).toHaveBeenCalledTimes(1)
      expect(mockRepository.save).toHaveBeenCalledTimes(1)
      expect(spyUpdate).toHaveBeenCalledWith(mockCompany.id, mockUpdateCompanyDto(false))
    })

    it('should throws an exception when updating goes wrong', async () => {
      jest.spyOn(companiesService, 'get').mockResolvedValueOnce(mockCompany)
      jest
        .spyOn(mockRepository, 'save')
        .mockReturnValueOnce(new Promise((_, reject) => reject(new BadRequestException())))

      await expect(companiesService.update(mockCompany.id, mockUpdateCompanyDto())).rejects.toThrow(
        BadRequestException
      )
    })

    it('should throws an exception when not found a valid company', async () => {
      jest
        .spyOn(companiesService, 'get')
        .mockReturnValueOnce(new Promise((_, reject) => reject(new NotFoundException())))

      await expect(companiesService.update(mockCompany.id, mockUpdateCompanyDto())).rejects.toThrow(
        NotFoundException
      )
    })
  })

  describe('delete', () => {
    it('should delete a valid company', async () => {
      const spyGet = jest.spyOn(companiesService, 'get').mockResolvedValueOnce(mockCompany)
      jest.spyOn(mockRepository, 'remove').mockResolvedValueOnce(mockCompany)

      expect(await companiesService.delete(mockCompany.id)).toStrictEqual(mockCompany)
      expect(spyGet).toHaveBeenCalledWith(mockCompany.id)
    })

    it('should throw an exception when not found a valid company', async () => {
      jest
        .spyOn(mockRepository, 'remove')
        .mockReturnValueOnce(new Promise((_, reject) => reject(new NotFoundException())))

      await expect(companiesService.delete(mockCompany.id)).rejects.toThrow(NotFoundException)
    })
  })
})

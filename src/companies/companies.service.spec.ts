import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as helpers from '../helpers'
import { mockCompany, mockCreateCompanyDto, mockUpdateCompanyDto } from '../utils/mock/company'
import { CompaniesService } from './companies.service'
import { Company } from './entities/company.entity'

jest.mock('../helpers', () => ({
  ...jest.requireActual('../helpers'),
  fetchAddress: jest.fn()
}))

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
        }
      ]
    }).compile()

    companiesService = module.get<CompaniesService>(CompaniesService)
    mockRepository = module.get<Repository<Company>>(getRepositoryToken(Company))
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })

  it('should be defined', () => {
    expect(companiesService).toBeDefined()
  })

  describe('get', () => {
    it('should throws an exception when not found a valid company', async () => {
      jest
        .spyOn(mockRepository, 'findOneByOrFail')
        .mockImplementationOnce(
          async () => await new Promise((_, reject) => reject(new NotFoundException()))
        )

      await expect(companiesService.get(mockCompany.id)).rejects.toThrow(NotFoundException)
    })

    it('should return a valid company', async () => {
      const spyGet = jest.spyOn(companiesService, 'get')
      jest.spyOn(mockRepository, 'findOneByOrFail').mockResolvedValueOnce(mockCompany)

      expect(await companiesService.get(mockCompany.id)).toBe(mockCompany)
      expect(mockRepository.findOneByOrFail).toHaveBeenCalledTimes(1)
      expect(spyGet).toHaveBeenCalledWith(mockCompany.id)
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
    it('should throws an exception when is passed an invalid CEP', async () => {
      jest
        .spyOn(helpers, 'fetchAddress')
        .mockImplementationOnce(
          async () => await new Promise((_, reject) => reject(new NotFoundException()))
        )

      await expect(companiesService.create(mockCreateCompanyDto)).rejects.toThrow(NotFoundException)
    })

    it('should throws an exception when creation goes wrong', async () => {
      jest
        .spyOn(mockRepository, 'save')
        .mockImplementationOnce(
          async () => await new Promise((_, reject) => reject(new BadRequestException()))
        )

      await expect(companiesService.create(mockCreateCompanyDto)).rejects.toThrow(
        BadRequestException
      )
    })

    it('should return a new company', async () => {
      jest
        .spyOn(helpers, 'fetchAddress')
        .mockImplementationOnce(
          async () =>
            await new Promise((resolve) => resolve(JSON.stringify(mockCreateCompanyDto.address)))
        )
      jest.spyOn(mockRepository, 'create').mockReturnValueOnce(mockCompany)
      jest.spyOn(mockRepository, 'save').mockResolvedValueOnce(mockCompany)

      expect(await companiesService.create(mockCreateCompanyDto)).toStrictEqual(mockCompany)
      expect(mockRepository.create).toHaveBeenCalledTimes(1)
      expect(mockRepository.save).toHaveBeenCalledTimes(1)
    })
  })

  describe('update', () => {
    it('should throws an exception when not found a valid company', async () => {
      jest
        .spyOn(companiesService, 'get')
        .mockImplementationOnce(
          async () => await new Promise((_, reject) => reject(new NotFoundException()))
        )

      await expect(companiesService.update(mockCompany.id, mockUpdateCompanyDto())).rejects.toThrow(
        NotFoundException
      )
    })

    it('should throws an exception when is passed an invalid CEP', async () => {
      jest.spyOn(companiesService, 'get').mockResolvedValueOnce(mockCompany)
      jest
        .spyOn(helpers, 'fetchAddress')
        .mockImplementationOnce(
          async () => await new Promise((_, reject) => reject(new NotFoundException()))
        )

      await expect(companiesService.update(mockCompany.id, mockUpdateCompanyDto())).rejects.toThrow(
        NotFoundException
      )
    })

    it('should throws an exception when updating goes wrong', async () => {
      jest.spyOn(companiesService, 'get').mockResolvedValueOnce(mockCompany)
      jest
        .spyOn(helpers, 'fetchAddress')
        .mockImplementationOnce(
          async () =>
            await new Promise((resolve) => resolve(JSON.stringify(mockUpdateCompanyDto().address)))
        )
      jest
        .spyOn(mockRepository, 'save')
        .mockImplementationOnce(
          async () => await new Promise((_, reject) => reject(new BadRequestException()))
        )

      await expect(companiesService.update(mockCompany.id, mockUpdateCompanyDto())).rejects.toThrow(
        BadRequestException
      )
    })

    it('should return a company with updated data - with address', async () => {
      const mockMergedCompany = {
        ...mockCompany,
        name: mockUpdateCompanyDto().name
      }
      const spyUpdate = jest.spyOn(companiesService, 'update')
      jest.spyOn(companiesService, 'get').mockResolvedValueOnce(mockCompany)
      jest
        .spyOn(helpers, 'fetchAddress')
        .mockImplementationOnce(
          async () =>
            await new Promise((resolve) => resolve(JSON.stringify(mockUpdateCompanyDto().address)))
        )
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
  })

  describe('delete', () => {
    it('should throws an exception when not found a valid company', async () => {
      jest
        .spyOn(mockRepository, 'remove')
        .mockImplementationOnce(
          async () => await new Promise((_, reject) => reject(new NotFoundException()))
        )

      await expect(companiesService.delete(mockCompany.id)).rejects.toThrow(NotFoundException)
    })

    it('should throws an exception when deleting goes wrong', async () => {
      const spyGet = jest.spyOn(companiesService, 'get').mockResolvedValueOnce(mockCompany)
      jest
        .spyOn(mockRepository, 'remove')
        .mockImplementationOnce(
          async () => await new Promise((_, reject) => reject(new BadRequestException()))
        )

      await expect(companiesService.delete(mockCompany.id)).rejects.toThrow(BadRequestException)
      expect(spyGet).toHaveBeenCalledWith(mockCompany.id)
    })

    it('should delete a valid company', async () => {
      const spyGet = jest.spyOn(companiesService, 'get').mockResolvedValueOnce(mockCompany)
      jest.spyOn(mockRepository, 'remove').mockResolvedValueOnce(mockCompany)

      expect(await companiesService.delete(mockCompany.id)).toStrictEqual(mockCompany)
      expect(spyGet).toHaveBeenCalledWith(mockCompany.id)
    })
  })
})

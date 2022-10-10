import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import * as helpers from '../helpers'
import { Repository } from 'typeorm'
import { CompaniesService } from '../companies/companies.service'
import { mockCompany } from '../utils/mock/company'
import { mockCreateUserDto, mockUpdateUserDto, mockUser } from '../utils/mock/users'
import { User } from './entities/user.entity'
import { UsersService } from './users.service'

jest.mock('../helpers', () => ({
  ...jest.requireActual('../helpers'),
  fetchAddress: jest.fn()
}))

describe('UsersService', () => {
  let usersService: UsersService
  let mockRepository: Repository<User>
  const companiesService = { get: jest.fn() }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository
        },
        {
          provide: CompaniesService,
          useValue: companiesService
        }
      ]
    }).compile()

    usersService = module.get<UsersService>(UsersService)
    mockRepository = module.get<Repository<User>>(getRepositoryToken(User))
  })

  afterEach(() => jest.clearAllMocks())

  it('should be defined', () => {
    expect(usersService).toBeDefined()
  })

  describe('get', () => {
    it('should return a valid user', async () => {
      const spyGet = jest.spyOn(usersService, 'get')
      jest.spyOn(mockRepository, 'findOneByOrFail').mockResolvedValueOnce(mockUser)

      expect(await usersService.get(mockUser.id)).toBe(mockUser)
      expect(mockRepository.findOneByOrFail).toHaveBeenCalledTimes(1)
      expect(spyGet).toHaveBeenCalledWith(mockUser.id)
    })

    it('should throws an exception when not found a valid user', async () => {
      jest
        .spyOn(mockRepository, 'findOneByOrFail')
        .mockImplementationOnce(
          async () => await new Promise((_, reject) => reject(new NotFoundException()))
        )

      await expect(usersService.get(mockUser.id)).rejects.toThrow(NotFoundException)
    })
  })

  describe('find', () => {
    it('should return an array of users', async () => {
      jest.spyOn(mockRepository, 'find').mockResolvedValueOnce([mockUser])

      expect(await usersService.find()).toHaveLength(1)
      expect(mockRepository.find).toHaveBeenCalledTimes(1)
    })
  })

  describe('create/save', () => {
    it('should return a new user', async () => {
      const spyCreate = jest.spyOn(usersService, 'create')
      jest
        .spyOn(helpers, 'fetchAddress')
        .mockImplementationOnce(
          async () =>
            await new Promise((resolve) => resolve(JSON.stringify(mockCreateUserDto.address)))
        )
      jest.spyOn(mockRepository, 'create').mockReturnValueOnce(mockUser)
      jest.spyOn(mockRepository, 'save').mockResolvedValueOnce(mockUser)

      expect(await usersService.create(mockCreateUserDto)).toStrictEqual(mockUser)
      expect(mockRepository.create).toHaveBeenCalledTimes(1)
      expect(mockRepository.save).toHaveBeenCalledTimes(1)
      expect(spyCreate).toHaveBeenCalledWith(mockCreateUserDto)
    })

    it('should throw an exception when not found a valid company', async () => {
      jest
        .spyOn(companiesService, 'get')
        .mockImplementationOnce(
          async () => await new Promise((_, reject) => reject(new NotFoundException()))
        )

      await expect(usersService.create(mockCreateUserDto)).rejects.toThrow(NotFoundException)
    })

    it('should throw an exception when creation goes wrong', async () => {
      jest
        .spyOn(mockRepository, 'save')
        .mockImplementationOnce(
          async () => await new Promise((_, reject) => reject(new BadRequestException()))
        )

      await expect(usersService.create(mockCreateUserDto)).rejects.toThrow(BadRequestException)
    })
  })

  describe('update', () => {
    it('should return a user with updated data - without new address nor new idCompany', async () => {
      const mockMergedUser = {
        ...mockUser,
        email: mockUpdateUserDto().email
      }
      const spyUpdate = jest.spyOn(usersService, 'update')
      jest.spyOn(usersService, 'get').mockResolvedValueOnce(mockUser)
      jest.spyOn(mockRepository, 'merge').mockReturnValueOnce(mockMergedUser)
      jest.spyOn(mockRepository, 'save').mockResolvedValueOnce(mockMergedUser)

      expect(await usersService.update(mockUser.id, mockUpdateUserDto())).toStrictEqual(
        mockMergedUser
      )

      expect(mockRepository.merge).toHaveBeenCalledTimes(1)
      expect(mockRepository.save).toHaveBeenCalledTimes(1)
      expect(spyUpdate).toHaveBeenCalledWith(mockUser.id, mockUpdateUserDto())
    })

    it('should return a user with updated data - with new address nor new idCompany', async () => {
      const mockMergedUser = {
        ...mockUser,
        email: mockUpdateUserDto(true).email
      }
      const spyUpdate = jest.spyOn(usersService, 'update')
      jest.spyOn(usersService, 'get').mockResolvedValueOnce(mockUser)
      jest
        .spyOn(helpers, 'fetchAddress')
        .mockImplementationOnce(
          async () =>
            await new Promise((resolve) => resolve(JSON.stringify(mockUpdateUserDto(true).address)))
        )
      jest.spyOn(mockRepository, 'merge').mockReturnValueOnce(mockMergedUser)
      jest.spyOn(mockRepository, 'save').mockResolvedValueOnce(mockMergedUser)

      expect(await usersService.update(mockUser.id, mockUpdateUserDto(true))).toStrictEqual(
        mockMergedUser
      )

      expect(mockRepository.merge).toHaveBeenCalledTimes(1)
      expect(mockRepository.save).toHaveBeenCalledTimes(1)
      expect(spyUpdate).toHaveBeenCalledWith(mockUser.id, mockUpdateUserDto(true))
    })

    it('should return a user with updated data - without new address but with a new idCompany', async () => {
      const mockMergedUser = {
        ...mockUser,
        email: mockUpdateUserDto(false, true).email,
        company: { ...mockCompany, id: 2 }
      }
      const spyUpdate = jest.spyOn(usersService, 'update')
      jest.spyOn(usersService, 'get').mockResolvedValueOnce(mockUser)
      jest.spyOn(companiesService, 'get').mockResolvedValueOnce(mockMergedUser.company)
      jest.spyOn(mockRepository, 'merge').mockReturnValueOnce(mockMergedUser)
      jest.spyOn(mockRepository, 'save').mockResolvedValueOnce(mockMergedUser)

      expect(await usersService.update(mockUser.id, mockUpdateUserDto(false, true))).toStrictEqual(
        mockMergedUser
      )

      expect(mockRepository.merge).toHaveBeenCalledTimes(1)
      expect(mockRepository.save).toHaveBeenCalledTimes(1)
      expect(spyUpdate).toHaveBeenCalledWith(mockUser.id, mockUpdateUserDto(false, true))
    })

    it('should throw an exception when not found a valid company', async () => {
      const spyUpdate = jest.spyOn(usersService, 'update')
      jest
        .spyOn(companiesService, 'get')
        .mockImplementationOnce(
          async () => await new Promise((_, reject) => reject(new NotFoundException()))
        )

      await expect(
        usersService.update(mockUser.id, mockUpdateUserDto(false, true))
      ).rejects.toThrow(NotFoundException)
      expect(spyUpdate).toHaveBeenCalledWith(mockUser.id, mockUpdateUserDto(false, true))
    })

    it('should throws an exception when updating goes wrong', async () => {
      jest.spyOn(usersService, 'get').mockResolvedValueOnce(mockUser)
      jest
        .spyOn(mockRepository, 'save')
        .mockImplementationOnce(
          async () => await new Promise((_, reject) => reject(new BadRequestException()))
        )

      await expect(usersService.update(mockUser.id, mockUpdateUserDto())).rejects.toThrow(
        BadRequestException
      )
    })
  })

  describe('delete', () => {
    it('should delete a valid user', async () => {
      const spyGet = jest.spyOn(usersService, 'get').mockResolvedValueOnce(mockUser)
      jest.spyOn(mockRepository, 'remove').mockResolvedValueOnce(mockUser)

      expect(await usersService.delete(mockUser.id)).toStrictEqual(mockUser)
      expect(spyGet).toHaveBeenCalledWith(mockUser.id)
    })

    it('should throw an exception when not found a valid user', async () => {
      jest
        .spyOn(usersService, 'get')
        .mockImplementationOnce(
          async () => await new Promise((_, reject) => reject(new NotFoundException()))
        )

      await expect(usersService.delete(mockUser.id)).rejects.toThrow(NotFoundException)
    })

    it('should throw an exception when deleting goes wrong', async () => {
      const spyGet = jest.spyOn(usersService, 'get').mockResolvedValueOnce(mockUser)
      jest
        .spyOn(mockRepository, 'remove')
        .mockImplementationOnce(
          async () => await new Promise((_, reject) => reject(new BadRequestException()))
        )

      await expect(usersService.delete(mockUser.id)).rejects.toThrow(BadRequestException)
      expect(spyGet).toHaveBeenCalledWith(mockUser.id)
    })
  })
})

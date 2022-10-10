import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import mockFetch from 'jest-fetch-mock'
import { Repository } from 'typeorm'
import { mockCreateUserDto, mockUser } from '../utils/mock/users'
import { User } from './entities/user.entity'
import { UsersService } from './users.service'

describe('UsersService', () => {
  let usersService: UsersService
  let mockRepository: Repository<User>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository
        }
      ]
    }).compile()

    usersService = module.get<UsersService>(UsersService)
    mockRepository = module.get<Repository<User>>(getRepositoryToken(User))
  })

  afterEach(() => {
    mockFetch.mockClear()
    jest.clearAllMocks()
  })

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
      mockFetch.mockResponseOnce(JSON.stringify(mockCreateUserDto.address))
      jest.spyOn(mockRepository, 'create').mockReturnValueOnce(mockUser)
      jest.spyOn(mockRepository, 'save').mockResolvedValueOnce(mockUser)

      expect(await usersService.create(mockCreateUserDto)).toStrictEqual(mockUser)
      expect(mockRepository.create).toHaveBeenCalledTimes(1)
      expect(mockRepository.save).toHaveBeenCalledTimes(1)
    })
  })
})

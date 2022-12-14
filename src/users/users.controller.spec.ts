import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CompaniesService } from '../companies/companies.service'
import { mockCreateUserDto, mockUpdateUserDto, mockUser } from '../utils/mock/users'
import { User } from './entities/user.entity'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

describe('UsersController', () => {
  let usersController: UsersController
  let usersService: UsersService
  const companiesService = { get: jest.fn() }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
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

    usersController = module.get<UsersController>(UsersController)
    usersService = module.get<UsersService>(UsersService)
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })

  it('should be defined', () => {
    expect(usersController).toBeDefined()
  })

  describe('get', () => {
    it('should return a valid company', async () => {
      const spyGet = jest.spyOn(usersController, 'get')
      jest.spyOn(usersService, 'get').mockResolvedValueOnce(mockUser)

      expect(await usersController.get(mockUser.id)).toStrictEqual(mockUser)
      expect(spyGet).toHaveBeenCalledWith(mockUser.id)
    })
  })

  describe('list', () => {
    it('should return an array of valid companies', async () => {
      jest.spyOn(usersService, 'find').mockResolvedValueOnce([mockUser])
      expect(await usersController.find()).toStrictEqual([mockUser])
    })
  })

  describe('create', () => {
    it('should create and return a valid company', async () => {
      const spyCreate = jest.spyOn(usersController, 'create')
      jest.spyOn(usersService, 'create').mockResolvedValueOnce(mockUser)

      expect(await usersController.create(mockCreateUserDto)).toStrictEqual(mockUser)
      expect(spyCreate).toHaveBeenCalledWith(mockCreateUserDto)
    })
  })

  describe('update', () => {
    it('should update and return a valid company', async () => {
      const mockMergedUser = {
        ...mockUser,
        name: mockUpdateUserDto().name
      }
      const spyUpdate = jest.spyOn(usersController, 'update')
      jest.spyOn(usersService, 'update').mockResolvedValueOnce(mockMergedUser)

      expect(await usersController.update(mockUser.id, mockUpdateUserDto())).toStrictEqual(
        mockMergedUser
      )
      expect(spyUpdate).toHaveBeenCalledWith(mockUser.id, mockUpdateUserDto())
    })
  })

  describe('delete', () => {
    it('should delete and return deleted user', async () => {
      const spyDelete = jest.spyOn(usersController, 'delete')
      jest.spyOn(usersService, 'delete').mockResolvedValueOnce(mockUser)

      expect(await usersController.delete(mockUser.id)).toStrictEqual(mockUser)
      expect(spyDelete).toHaveBeenCalledWith(mockUser.id)
    })
  })
})

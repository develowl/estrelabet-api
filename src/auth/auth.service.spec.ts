import { BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import * as bcrypt from 'bcrypt'
import { MockAdmin } from 'src/types/auth'
import { Jwt } from 'src/types/jwt'
import { mockConfigService } from '../utils/mock/configService'
import { mockJwtService } from '../utils/mock/jwt'
import { AuthService } from './auth.service'

jest.mock('bcrypt', () => ({
  ...jest.requireActual('bcrypt'),
  compare: jest.fn()
}))

describe('AuthService', () => {
  let authService: AuthService
  const mockAdmin: MockAdmin = { identifier: 'admin', password: '1@EstrelaBet' }
  const mockTokens: Jwt = { access_token: 'abc', refresh_token: '123' }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: mockConfigService
        },
        {
          provide: JwtService,
          useValue: mockJwtService
        }
      ]
    }).compile()

    authService = module.get<AuthService>(AuthService)
  })

  afterEach(() => jest.clearAllMocks())

  it('should be defined', () => {
    expect(authService).toBeDefined()
  })

  describe('signin', () => {
    it('should throw an exception when is passed a invalid user', async () => {
      const mockInvalidAdmin: MockAdmin = { ...mockAdmin, identifier: 'invalid' }

      await expect(authService.signin(mockInvalidAdmin)).rejects.toThrow(BadRequestException)
    })

    it('should signin successfully', async () => {
      const spyGetAdmin = jest.spyOn(authService, 'getAdmin')
      const spyGetTokens = jest.spyOn(AuthService.prototype as any, 'getTokens')

      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => Promise.resolve(true))

      expect(await authService.signin(mockAdmin)).toStrictEqual(mockTokens)
      expect(spyGetAdmin).toHaveBeenCalledWith(mockAdmin.identifier)
      expect(spyGetTokens).toHaveBeenCalledWith({ identifier: mockAdmin.identifier })
    })
  })
})

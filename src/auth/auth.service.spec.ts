import { BadRequestException } from '@nestjs/common'
import { ForbiddenException } from '@nestjs/common/exceptions/forbidden.exception'
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
  const mockAdmin: MockAdmin = { identifier: 'admin', password: 'estrelabet', refreshToken: '123' }
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
    it('should throws an exception when is passed an invalid user', async () => {
      const mockInvalidAdmin: MockAdmin = { ...mockAdmin, identifier: 'invalid' }

      await expect(authService.signin(mockInvalidAdmin)).rejects.toThrow(BadRequestException)
    })

    it('should throws an exception when is passed an invalid pasword', async () => {
      const mockInvalidAdmin: MockAdmin = { ...mockAdmin, password: 'invalid' }
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => Promise.resolve(false))

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

  describe('signout', () => {
    it('should throws an exception when is tried to sign out without signin previously', async () => {
      const mockInvalidAdmin: MockAdmin = { ...mockAdmin, refreshToken: undefined }
      await expect(authService.signout(mockInvalidAdmin.identifier)).rejects.toThrow(
        BadRequestException
      )
    })

    it('should throws an exception when is tried to sign out with an invalid user', async () => {
      const mockInvalidAdmin: MockAdmin = { ...mockAdmin, identifier: 'invalid' }

      await expect(authService.signout(mockInvalidAdmin.identifier)).rejects.toThrow(
        BadRequestException
      )
    })

    it('should sign out successfully', async () => {
      const spySignout = jest.spyOn(authService, 'signout')
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => Promise.resolve(true))
      await authService.signin(mockAdmin)

      expect(await authService.signout(mockAdmin.identifier)).toStrictEqual({
        message: 'Signed out successfully'
      })
      expect(spySignout).toHaveBeenCalledWith(mockAdmin.identifier)
    })
  })

  describe('refreshTokens', () => {
    it('should throws an exception when is tried to refresh tokens without signin previously', async () => {
      await expect(
        authService.refreshTokens(mockAdmin.identifier, mockAdmin.refreshToken)
      ).rejects.toThrow(BadRequestException)
    })

    it('should throws an exception when is tried to refresh tokens with an invalid user', async () => {
      const mockInvalidAdmin: MockAdmin = { ...mockAdmin, identifier: 'invalid' }

      await expect(
        authService.refreshTokens(mockInvalidAdmin.identifier, mockAdmin.refreshToken)
      ).rejects.toThrow(BadRequestException)
    })

    it('should throws an exception when is tried to refresh tokens with a different refreshToken', async () => {
      const mockInvalidAdmin: MockAdmin = { ...mockAdmin, refreshToken: '321' }
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => Promise.resolve(true))
      await authService.signin(mockAdmin)

      await expect(
        authService.refreshTokens(mockInvalidAdmin.identifier, mockInvalidAdmin.refreshToken)
      ).rejects.toThrow(ForbiddenException)
    })

    it('should refresh tokens successfully', async () => {
      const spyRefreshTokens = jest.spyOn(authService, 'refreshTokens')

      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => Promise.resolve(true))
      await authService.signin(mockAdmin)

      expect(
        await authService.refreshTokens(mockAdmin.identifier, mockAdmin.refreshToken)
      ).toStrictEqual(mockTokens)
      expect(spyRefreshTokens).toHaveBeenCalledWith(mockAdmin.identifier, mockAdmin.refreshToken)
    })
  })
})

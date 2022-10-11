import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { MockAdmin } from '../types/auth'
import { Jwt } from '../types/jwt'
import { mockConfigService } from '../utils/mock/configService'
import { mockJwtService } from '../utils/mock/jwt'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

describe('AuthController', () => {
  let authController: AuthController
  let authService: AuthService
  const mockAdmin: MockAdmin = { identifier: 'admin', password: 'estrelabet', refreshToken: '123' }
  const mockTokens: Jwt = { access_token: 'abc', refresh_token: '123' }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
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

    authController = module.get<AuthController>(AuthController)
    authService = module.get<AuthService>(AuthService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(authController).toBeDefined()
  })

  describe('signin', () => {
    it('should signin successfully', async () => {
      const spySignin = jest.spyOn(authController, 'signin')
      jest.spyOn(authService, 'signin').mockResolvedValueOnce(mockTokens)

      expect(await authController.signin(mockAdmin)).toStrictEqual(mockTokens)
      expect(spySignin).toHaveBeenCalledWith(mockAdmin)
    })
  })
})

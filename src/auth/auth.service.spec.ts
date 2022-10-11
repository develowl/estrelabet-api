import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { mockConfigService } from '../utils/mock/configService'
import { AuthService } from './auth.service'

describe('AuthService', () => {
  let authService: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: mockConfigService
        }
      ]
    }).compile()

    authService = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(authService).toBeDefined()
  })
})

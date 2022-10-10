import { Inject, Injectable } from '@nestjs/common/decorators'
import { ConfigService } from '@nestjs/config'
import { hashSync } from 'bcrypt'
import { MockAdmin } from 'src/utils/mock/auth'

@Injectable()
export class AuthService {
  private mockAdmin: MockAdmin

  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {
    this.mockAdmin = {
      identifier: this.configService.get<string>('ADMIN_IDENTIFIER'),
      password: hashSync(this.configService.get<string>('ADMIN_PASSWORD'), 10),
      refreshToken: null
    }
  }
}

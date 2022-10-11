import { Body, Controller, Inject, Post } from '@nestjs/common'
import { Jwt } from 'src/types/jwt'
import { AuthService } from './auth.service'
import { RefreshTokensDto } from './dto/refresh-tokens.dto'
import { SigninDto } from './dto/signin.dto'

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly service: AuthService) {}

  @Post('signin')
  async signin(@Body() signinDto: SigninDto): Promise<Jwt> {
    return await this.service.signin(signinDto)
  }

  @Post('signout')
  async signout(
    @Body() { identifier }: Pick<SigninDto, 'identifier'>
  ): Promise<{ message: string }> {
    return await this.service.signout(identifier)
  }

  @Post('refresh-tokens')
  async refreshTokens(@Body() { identifier, refreshToken }: RefreshTokensDto): Promise<Jwt> {
    return await this.service.refreshTokens(identifier, refreshToken)
  }
}

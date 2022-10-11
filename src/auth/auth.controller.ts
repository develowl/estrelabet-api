import { Body, Controller, Inject, Post, SetMetadata, UseGuards } from '@nestjs/common'
import { Public } from '../decorators/public.route.decorator'
import { Jwt } from '../types/jwt'
import { AuthService } from './auth.service'
import { RefreshTokensDto } from './dto/refresh-tokens.dto'
import { SigninDto } from './dto/signin.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard'

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly service: AuthService) {}

  @Post('signin')
  @Public()
  async signin(@Body() signinDto: SigninDto): Promise<Jwt> {
    return await this.service.signin(signinDto)
  }

  @Post('signout')
  @UseGuards(JwtAuthGuard)
  async signout(
    @Body() { identifier }: Pick<SigninDto, 'identifier'>
  ): Promise<{ message: string }> {
    return await this.service.signout(identifier)
  }

  @Post('refresh-tokens')
  @UseGuards(JwtRefreshAuthGuard)
  @SetMetadata('jwt-refresh', true)
  async refreshTokens(@Body() { identifier, refreshToken }: RefreshTokensDto): Promise<Jwt> {
    return await this.service.refreshTokens(identifier, refreshToken)
  }
}

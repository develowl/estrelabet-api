import { Body, Controller, Inject, Post, SetMetadata, UseGuards } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger'
import { Public } from '../decorators/public.route.decorator'
import { Jwt } from '../types/jwt'
import { AuthService } from './auth.service'
import { RefreshTokensDto } from './dto/refresh-tokens.dto'
import { SigninDto } from './dto/signin.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard'

@Controller('auth')
@ApiTags('Auth Operations')
export class AuthController {
  constructor(@Inject(AuthService) private readonly service: AuthService) {}

  @Post('signin')
  @Public()
  @ApiOperation({ summary: 'Sign user in' })
  @ApiCreatedResponse({ description: 'User signed in' })
  @ApiBadRequestResponse({ description: 'Incorrect password' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async signin(@Body() signinDto: SigninDto): Promise<Jwt> {
    return await this.service.signin(signinDto)
  }

  @Post('signout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sign user out' })
  @ApiCreatedResponse({ description: 'User signed out' })
  @ApiBadRequestResponse({ description: 'User not signed in' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async signout(
    @Body() { identifier }: Pick<SigninDto, 'identifier'>
  ): Promise<{ message: string }> {
    return await this.service.signout(identifier)
  }

  @Post('refresh-tokens')
  @UseGuards(JwtRefreshAuthGuard)
  @SetMetadata('jwt-refresh', true)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh tokens of authenticated user' })
  @ApiCreatedResponse({ description: 'Refreshed tokens' })
  @ApiBadRequestResponse({ description: 'User not signed in' })
  @ApiForbiddenResponse({ description: 'Invalid refresh token' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async refreshTokens(@Body() { identifier, refreshToken }: RefreshTokensDto): Promise<Jwt> {
    return await this.service.refreshTokens(identifier, refreshToken)
  }
}

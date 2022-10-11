import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { ForbiddenException } from '@nestjs/common/exceptions/forbidden.exception'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { compare, hashSync } from 'bcrypt'
import { MockAdmin } from '../types/auth'
import { Jwt, JwtPayload } from '../types/jwt'
import { SigninDto } from './dto/signin.dto'

@Injectable()
export class AuthService {
  private mockAdmin: MockAdmin

  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(JwtService) private readonly jwtService: JwtService
  ) {
    this.mockAdmin = {
      identifier: this.configService.get<string>('ADMIN_IDENTIFIER'),
      password: hashSync(this.configService.get<string>('ADMIN_PASSWORD'), 10),
      refreshToken: null
    }
  }

  private async getAdmin(identifier: string): Promise<MockAdmin> {
    if (this.mockAdmin.identifier !== identifier) {
      throw new BadRequestException('Admin not found')
    }

    return this.mockAdmin
  }

  async signin({ identifier, password }: SigninDto): Promise<Jwt> {
    const admin = await this.getAdmin(identifier)
    const valid = await compare(password, admin.password)
    if (!valid) {
      throw new BadRequestException('Incorrect password')
    }

    const payload: JwtPayload = {
      identifier: admin.identifier
    }

    return await this.getTokens(payload)
  }

  async signout(identifier: string): Promise<{ message: string }> {
    const admin = await this.getAdmin(identifier)
    if (!admin.refreshToken) {
      throw new BadRequestException('User not signed in')
    }

    await this.updateRefreshToken(identifier, undefined)
    return { message: 'Signed out successfully' }
  }

  async refreshTokens(identifier: string, refreshToken: string): Promise<Jwt> {
    const admin = await this.getAdmin(identifier)
    if (!admin.refreshToken) {
      throw new BadRequestException('User not signed in')
    }

    if (admin.refreshToken !== refreshToken) {
      throw new ForbiddenException('Invalid refresh token')
    }

    return await this.getTokens({ identifier })
  }

  private async getTokens({ identifier }: JwtPayload) {
    const access_token = await this.jwtService.signAsync(identifier, {
      expiresIn: '1h',
      secret: this.configService.get<string>('JWT_SECRET')
    })
    const refresh_token = await this.jwtService.signAsync(identifier, {
      expiresIn: '2h',
      secret: this.configService.get<string>('JWT_REFRESH_SECRET')
    })

    await this.updateRefreshToken(identifier, refresh_token)

    return {
      access_token,
      refresh_token
    }
  }

  private async updateRefreshToken(identifier: string, refreshToken: string) {
    const user = await this.getAdmin(identifier)

    this.mockAdmin = {
      ...user,
      refreshToken: refreshToken || undefined
    }
  }
}

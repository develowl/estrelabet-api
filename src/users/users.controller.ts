import { Body, Controller, Delete, Get, Inject, Param, Post, Put, UseGuards } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam
} from '@nestjs/swagger'
import { ApiBearerAuth, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger/dist/decorators'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { mockUser } from '../utils/mock/users'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import { UsersService } from './users.service'

@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiTags('Users Operations')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
export class UsersController {
  constructor(@Inject(UsersService) private readonly service: UsersService) {}

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a valid User' })
  @ApiOkResponse({ description: 'User found', schema: { example: mockUser } })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiParam({ name: 'id', description: 'User id that is stored in the database', example: 1 })
  async get(@Param('id') id: number): Promise<User> {
    return await this.service.get(id)
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a list of valid Users' })
  @ApiOkResponse({ description: 'Array list of Users', schema: { example: [mockUser] } })
  async find(): Promise<User[]> {
    return await this.service.find()
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new User' })
  @ApiCreatedResponse({ description: 'Created new User', schema: { example: mockUser } })
  @ApiBadRequestResponse({ description: 'Unable to create' })
  @ApiNotFoundResponse({ description: 'Company not found' })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.service.create(createUserDto)
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing User' })
  @ApiParam({ name: 'id', description: 'User id that is stored in the database', example: 1 })
  @ApiOkResponse({
    description: 'Updated existing User',
    schema: { example: { ...mockUser, name: 'UPDATED USER' } }
  })
  @ApiBadRequestResponse({ description: 'Unable to update' })
  @ApiNotFoundResponse({ description: 'User OR Company not found' })
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return await this.service.update(id, updateUserDto)
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an existing User' })
  @ApiParam({ name: 'id', description: 'User id that is stored in the database', example: 1 })
  @ApiOkResponse({ description: 'Deleted User', schema: { example: mockUser } })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Unable to delete' })
  async delete(@Param('id') id: number): Promise<User> {
    return this.service.delete(id)
  }
}

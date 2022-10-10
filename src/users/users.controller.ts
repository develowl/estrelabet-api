import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './entities/user.entity'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(@Inject(UsersService) private readonly service: UsersService) {}

  @Get(':id')
  async get(@Param('id') id: number): Promise<User> {
    return await this.service.get(id)
  }

  @Get()
  async find(): Promise<User[]> {
    return await this.service.find()
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.service.create(createUserDto)
  }
}
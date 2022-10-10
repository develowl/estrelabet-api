import { NotFoundException } from '@nestjs/common'
import { Injectable } from '@nestjs/common/decorators'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  async get(id: number): Promise<User> {
    try {
      return await this.repo.findOneByOrFail({ id })
    } catch {
      throw new NotFoundException('User not found')
    }
  }
}

import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Inject, Injectable } from '@nestjs/common/decorators'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CompaniesService } from '../companies/companies.service'
import { fetchAddress } from '../helpers'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './entities/user.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    @Inject(CompaniesService) private readonly companiesService: CompaniesService
  ) {}

  async get(id: number): Promise<User> {
    try {
      return await this.repo.findOneByOrFail({ id })
    } catch {
      throw new NotFoundException('User not found')
    }
  }

  async find(): Promise<User[]> {
    return await this.repo.find()
  }

  async create({ address: { cep, num }, idCompany, ...dto }: CreateUserDto): Promise<User> {
    try {
      const foundCompany = await this.companiesService.get(idCompany)
      const address = await fetchAddress({ cep, num })
      return await this.repo.save(this.repo.create({ ...dto, address, company: foundCompany }))
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new BadRequestException('Unable to create')
    }
  }
}

import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Inject, Injectable } from '@nestjs/common/decorators'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CompaniesService } from '../companies/companies.service'
import { fetchAddress } from '../helpers'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
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

  async update(id: number, { address, idCompany, ...dto }: UpdateUserDto): Promise<User> {
    try {
      const foundUser = await this.get(id)

      if (!address && !idCompany) {
        this.repo.merge(foundUser, { ...dto })
      } else {
        if (address) {
          const fetchedAddress = await fetchAddress(address)
          this.repo.merge(foundUser, { ...dto, address: fetchedAddress })
        }

        if (idCompany) {
          const foundCompany = await this.companiesService.get(idCompany)
          this.repo.merge(foundUser, { ...dto, company: foundCompany })
        }
      }

      return await this.repo.save(foundUser)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new BadRequestException('Unable to update')
    }
  }

  async delete(id: number): Promise<User> {
    try {
      const foundUser = await this.get(id)
      return await this.repo.remove(foundUser)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }

      throw new BadRequestException('Unable to delete')
    }
  }
}

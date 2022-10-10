import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Injectable } from '@nestjs/common/decorators'
import { Inject } from '@nestjs/common/decorators/core/inject.decorator'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { fetchAddress } from 'src/helpers'
import { Repository } from 'typeorm'
import { CreateCompanyDto } from './dto/create-company.dto'
import { Company } from './entities/company.entity'

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company) private readonly repo: Repository<Company>,
    @Inject(ConfigService) private readonly configService: ConfigService
  ) {}

  async get(id: number): Promise<Company> {
    try {
      return await this.repo.findOneByOrFail({ id })
    } catch {
      throw new NotFoundException('Company not found')
    }
  }

  async find(): Promise<Company[]> {
    return await this.repo.find()
  }

  async create({ address: { cep, num }, ...dto }: CreateCompanyDto): Promise<Company> {
    try {
      const address = await fetchAddress({ cep, num })
      return await this.repo.save(this.repo.create({ ...dto, address }))
    } catch {
      throw new BadRequestException('Unable to create')
    }
  }
}

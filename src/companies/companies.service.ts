import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Injectable } from '@nestjs/common/decorators'
import { Inject } from '@nestjs/common/decorators/core/inject.decorator'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { fetchAddress } from '../helpers'
import { CreateCompanyDto } from './dto/create-company.dto'
import { UpdateCompanyDto } from './dto/update-company.dto'
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

  async update(id: number, { address, ...dto }: UpdateCompanyDto): Promise<Company> {
    try {
      const foundCompany = await this.get(id)

      if (address) {
        const fetchedAddress = await fetchAddress(address)
        this.repo.merge(foundCompany, { ...dto, address: fetchedAddress })
      } else {
        this.repo.merge(foundCompany, { ...dto })
      }

      return await this.repo.save(foundCompany)
    } catch (error) {
      throw error
      // throw new BadRequestException('Unable to update')
    }
  }
}

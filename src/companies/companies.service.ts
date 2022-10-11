import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Injectable } from '@nestjs/common/decorators'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { fetchAddress } from '../helpers'
import { CreateCompanyDto } from './dto/create-company.dto'
import { UpdateCompanyDto } from './dto/update-company.dto'
import { Company } from './entities/company.entity'

@Injectable()
export class CompaniesService {
  constructor(@InjectRepository(Company) private readonly repo: Repository<Company>) {}

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
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
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
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new BadRequestException('Unable to update')
    }
  }

  async delete(id: number): Promise<Company> {
    try {
      const foundCompany = await this.get(id)
      return await this.repo.remove(foundCompany)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }

      throw new BadRequestException('Unable to delete')
    }
  }
}

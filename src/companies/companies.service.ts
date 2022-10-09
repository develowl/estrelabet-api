import { NotFoundException } from '@nestjs/common'
import { Injectable } from '@nestjs/common/decorators'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Company } from './entities/company.entity'

@Injectable()
export class CompaniesService {
  constructor(@InjectRepository(Company) private readonly repo: Repository<Company>) {}

  async get(id: number): Promise<Company> {
    try {
      return await this.repo.findOneOrFail({ where: { id } })
    } catch {
      throw new NotFoundException(`Company with id: '${id}' not found`)
    }
  }

  async find(): Promise<Company[]> {
    return await this.repo.find()
  }
}

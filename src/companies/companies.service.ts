import { Injectable } from '@nestjs/common/decorators'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Company } from './entities/company.entity'

@Injectable()
export class CompaniesService {
  constructor(@InjectRepository(Company) private readonly repo: Repository<Company>) {}

  async find(): Promise<Company[]> {
    return await this.repo.find()
  }
}

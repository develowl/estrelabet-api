import { Controller, Get, Inject, Param } from '@nestjs/common'
import { CompaniesService } from './companies.service'
import { Company } from './entities/company.entity'

@Controller('companies')
export class CompaniesController {
  constructor(@Inject(CompaniesService) private readonly service: CompaniesService) {}

  @Get(':id')
  async get(@Param(':id') id: number): Promise<Company> {
    return await this.service.get(id)
  }
}

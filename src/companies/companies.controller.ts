import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common'
import { CompaniesService } from './companies.service'
import { CreateCompanyDto } from './dto/create-company.dto'
import { Company } from './entities/company.entity'

@Controller('companies')
export class CompaniesController {
  constructor(@Inject(CompaniesService) private readonly service: CompaniesService) {}

  @Get(':id')
  async get(@Param('id') id: number): Promise<Company> {
    return await this.service.get(id)
  }

  @Get()
  async find(): Promise<Company[]> {
    return await this.service.find()
  }

  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto): Promise<Company> {
    return await this.service.create(createCompanyDto)
  }
}

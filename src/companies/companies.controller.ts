import { Body, Controller, Delete, Get, Inject, Param, Post, Put } from '@nestjs/common'
import {
  ApiAcceptedResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam
} from '@nestjs/swagger'
import { ApiTags } from '@nestjs/swagger/dist'
import { mockCompany } from 'src/utils/mock/company'
import { CompaniesService } from './companies.service'
import { CreateCompanyDto } from './dto/create-company.dto'
import { UpdateCompanyDto } from './dto/update-company.dto'
import { Company } from './entities/company.entity'

@ApiTags('Companies Operations')
@Controller('companies')
export class CompaniesController {
  constructor(@Inject(CompaniesService) private readonly service: CompaniesService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a valid Company' })
  @ApiOkResponse({ description: 'Company found', schema: { example: mockCompany } })
  @ApiNotFoundResponse({ description: 'Company not found' })
  @ApiParam({ name: 'id', description: 'Company id that is stored in the database', example: 1 })
  async get(@Param('id') id: number): Promise<Company> {
    return await this.service.get(id)
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of valid Companies' })
  @ApiOkResponse({ description: 'Array list of Companies', schema: { example: [mockCompany] } })
  async find(): Promise<Company[]> {
    return await this.service.find()
  }

  @Post()
  @ApiOperation({ summary: 'Create a new Company' })
  @ApiCreatedResponse({ description: 'Created new Company', schema: { example: mockCompany } })
  async create(@Body() createCompanyDto: CreateCompanyDto): Promise<Company> {
    return await this.service.create(createCompanyDto)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing Company' })
  @ApiParam({ name: 'id', description: 'Company id that is stored in the database', example: 1 })
  @ApiCreatedResponse({
    description: 'Updated existing Company',
    schema: { example: { ...mockCompany, name: 'UPDATED COMPANY S.A.' } }
  })
  async update(
    @Param('id') id: number,
    @Body() updateCompanyDto: UpdateCompanyDto
  ): Promise<Company> {
    return await this.service.update(id, updateCompanyDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an existing Company' })
  @ApiParam({ name: 'id', description: 'Company id that is stored in the database', example: 1 })
  @ApiAcceptedResponse({ description: 'Deleted Company', schema: { example: mockCompany } })
  @ApiNotFoundResponse({ description: 'Company not found' })
  async delete(@Param('id') id: number): Promise<Company> {
    return this.service.delete(id)
  }
}

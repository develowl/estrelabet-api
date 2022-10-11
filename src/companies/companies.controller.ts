import { Body, Controller, Delete, Get, Inject, Param, Post, Put, UseGuards } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam
} from '@nestjs/swagger'
import { ApiBearerAuth, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger/dist'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { mockCompany } from '../utils/mock/company'
import { CompaniesService } from './companies.service'
import { CreateCompanyDto } from './dto/create-company.dto'
import { UpdateCompanyDto } from './dto/update-company.dto'
import { Company } from './entities/company.entity'

@Controller('companies')
@UseGuards(JwtAuthGuard)
@ApiTags('Companies Operations')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
export class CompaniesController {
  constructor(@Inject(CompaniesService) private readonly service: CompaniesService) {}

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a valid Company' })
  @ApiOkResponse({ description: 'Company found', schema: { example: mockCompany } })
  @ApiNotFoundResponse({ description: 'Company not found' })
  @ApiParam({ name: 'id', description: 'Company id that is stored in the database', example: 1 })
  async get(@Param('id') id: number): Promise<Company> {
    return await this.service.get(id)
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a list of valid Companies' })
  @ApiOkResponse({ description: 'Array list of Companies', schema: { example: [mockCompany] } })
  async find(): Promise<Company[]> {
    return await this.service.find()
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new Company' })
  @ApiCreatedResponse({ description: 'Created new Company', schema: { example: mockCompany } })
  @ApiBadRequestResponse({ description: 'Unable to create' })
  async create(@Body() createCompanyDto: CreateCompanyDto): Promise<Company> {
    return await this.service.create(createCompanyDto)
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing Company' })
  @ApiParam({ name: 'id', description: 'Company id that is stored in the database', example: 1 })
  @ApiOkResponse({
    description: 'Updated existing Company',
    schema: { example: { ...mockCompany, name: 'UPDATED COMPANY S.A.' } }
  })
  @ApiBadRequestResponse({ description: 'Unable to update' })
  async update(
    @Param('id') id: number,
    @Body() updateCompanyDto: UpdateCompanyDto
  ): Promise<Company> {
    return await this.service.update(id, updateCompanyDto)
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an existing Company' })
  @ApiParam({ name: 'id', description: 'Company id that is stored in the database', example: 1 })
  @ApiOkResponse({ description: 'Deleted Company', schema: { example: mockCompany } })
  @ApiNotFoundResponse({ description: 'Company not found' })
  @ApiBadRequestResponse({ description: 'Unable to delete' })
  async delete(@Param('id') id: number): Promise<Company> {
    return this.service.delete(id)
  }
}

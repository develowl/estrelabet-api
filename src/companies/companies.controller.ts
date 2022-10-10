import { Controller, Inject } from '@nestjs/common'
import { CompaniesService } from './companies.service'

@Controller('companies')
export class CompaniesController {
  constructor(@Inject(CompaniesService) private readonly service: CompaniesService) {}
}

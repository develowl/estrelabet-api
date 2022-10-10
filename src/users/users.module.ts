import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CompaniesModule } from 'src/companies/companies.module'
import { User } from './entities/user.entity'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  imports: [TypeOrmModule.forFeature([User]), CompaniesModule],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}

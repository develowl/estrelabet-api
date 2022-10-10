import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppDataSource } from './data-source'

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env.example' }),
    TypeOrmModule.forRoot(AppDataSource.options)
  ]
})
export class AppModule {}

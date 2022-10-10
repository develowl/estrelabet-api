import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { SwaggerModule } from '@nestjs/swagger'
import { DocumentBuilder } from '@nestjs/swagger/dist'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe())
  const configService = app.get(ConfigService)

  const config = new DocumentBuilder()
    .setTitle('EstrelaBet API')
    .setDescription('The challenge EstrelaBet API')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  const port = Number(configService.get<string>('PORT')) || 3000
  await app.listen(port)
}

bootstrap()

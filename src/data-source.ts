import { DataSource } from 'typeorm'
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions'

export const AppDataSource = new DataSource({
  type: 'mysql',
  port: 3306,
  database: process.env.MYSQL_DATABASE || 'estrelabet',
  username: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_ROOT_PASSWORD || 'root',
  entities: [__dirname + '/**/*.entity.{ts,js}'],
  requestTimeout: 60 * 1000,
  autoLoadEntities: true,
  options: {
    encrypt: false,
    enableArithAbort: true
  },
  logging: true,
  synchronize: true
} as MysqlConnectionOptions)

export const AppDataSourceManager = AppDataSource.manager

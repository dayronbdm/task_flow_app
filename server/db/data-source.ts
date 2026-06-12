import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from './entities/User'
import { Note } from './entities/Note'

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User, Note]
})

import 'reflect-metadata'
import { AppDataSource } from '../db/data-source'

let initialized = false

// connect to the database when the server starts
export default defineNitroPlugin(async () => {
  if (!initialized) {
    await AppDataSource.initialize()
    initialized = true
    console.log('Database connected')
  }
})

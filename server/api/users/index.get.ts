import { AppDataSource } from '~~/server/db/data-source'
import { User } from '~~/server/db/entities/User'

export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const repo = AppDataSource.getRepository(User)
  const users = await repo.find({
    select: { userId: true, username: true, email: true, createdAt: true, lastLoginAt: true }
  })
  return users
})

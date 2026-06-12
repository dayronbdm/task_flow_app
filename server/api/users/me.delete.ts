import { AppDataSource } from '~~/server/db/data-source'
import { User } from '~~/server/db/entities/User'

export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const repo = AppDataSource.getRepository(User)
  const entity = await repo.findOneBy({ userId: (user as any).id })
  if (!entity) throw createError({ statusCode: 404, message: 'User not found' })

  await repo.remove(entity)
  await clearUserSession(event)
  return { ok: true }
})

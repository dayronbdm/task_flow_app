import { AppDataSource } from '~~/server/db/data-source'
import { User } from '~~/server/db/entities/User'

// update the current user's username
export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const body = await readBody(event)
  const { username } = body
  if (!username?.trim()) {
    throw createError({ statusCode: 400, message: 'Username is required' })
  }

  const repo = AppDataSource.getRepository(User)
  const entity = await repo.findOneBy({ userId: (user as any).id })
  if (!entity) throw createError({ statusCode: 404, message: 'User not found' })

  entity.username = username.trim()
  await repo.save(entity)

  // update the session with the new username
  await setUserSession(event, {
    user: { id: entity.userId, email: entity.email, username: entity.username },
    secure: (await getUserSession(event)).secure
  })

  return { id: entity.userId, username: entity.username, email: entity.email }
})

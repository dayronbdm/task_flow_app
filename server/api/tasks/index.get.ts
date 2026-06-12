import { IsNull } from 'typeorm'
import { AppDataSource } from '~~/server/db/data-source'
import { Task } from '~~/server/db/entities/Task'

// get all tasks for the logged in user
export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const query = getQuery(event)
  const repo = AppDataSource.getRepository(Task)

  // only get tasks that haven't been deleted
  const where: any = { userId: (user as any).id, deletedAt: IsNull() }
  if (query.status) where.status = query.status

  return repo.find({
    where,
    order: { createdAt: 'DESC' }
  })
})

import { IsNull } from 'typeorm'
import { AppDataSource } from '~~/server/db/data-source'
import { Task } from '~~/server/db/entities/Task'

export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const id = Number(getRouterParam(event, 'id'))
  const repo = AppDataSource.getRepository(Task)
  const task = await repo.findOneBy({ taskId: id, userId: (user as any).id, deletedAt: IsNull() })
  if (!task) throw createError({ statusCode: 404, message: 'Task not found' })

  return task
})

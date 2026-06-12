import { IsNull } from 'typeorm'
import { AppDataSource } from '~~/server/db/data-source'
import { Task } from '~~/server/db/entities/Task'

export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const { title, description, status, priority, dueDate } = body

  if (!title?.trim()) {
    throw createError({ statusCode: 400, message: 'Title is required' })
  }

  const repo = AppDataSource.getRepository(Task)
  const task = await repo.findOneBy({ taskId: id, userId: (user as any).id, deletedAt: IsNull() })
  if (!task) throw createError({ statusCode: 404, message: 'Task not found' })

  task.title = title.trim()
  task.description = description?.trim() || null
  task.status = status || task.status
  task.priority = priority || task.priority
  task.dueDate = dueDate || null
  task.updatedAt = new Date()

  return repo.save(task)
})

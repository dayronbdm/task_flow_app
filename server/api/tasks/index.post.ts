import { AppDataSource } from '~~/server/db/data-source'
import { Task } from '~~/server/db/entities/Task'

// create a new task
export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const body = await readBody(event)
  const { title, description, priority, dueDate } = body

  // title is required
  if (!title?.trim()) {
    throw createError({ statusCode: 400, message: 'Title is required' })
  }

  const repo = AppDataSource.getRepository(Task)
  return repo.save({
    userId: (user as any).id,
    title: title.trim(),
    description: description?.trim() || null,
    status: 'todo',
    priority: priority || 'medium',
    dueDate: dueDate || null,
    createdAt: new Date()
  })
})

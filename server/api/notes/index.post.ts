import { AppDataSource } from '~~/server/db/data-source'
import { Note } from '~~/server/db/entities/Note'

export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const body = await readBody(event)
  const { title, content } = body
  if (!title?.trim() || !content?.trim()) {
    throw createError({ statusCode: 400, message: 'Title and content are required' })
  }

  const repo = AppDataSource.getRepository(Note)
  const note = await repo.save({
    userId: (user as any).id,
    title: title.trim(),
    content: content.trim(),
    createdAt: new Date()
  })

  return note
})

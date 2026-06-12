import { IsNull } from 'typeorm'
import { AppDataSource } from '~~/server/db/data-source'
import { Note } from '~~/server/db/entities/Note'

export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const repo = AppDataSource.getRepository(Note)
  return repo.find({
    select: { noteId: true, title: true, content: true, createdAt: true, updatedAt: true },
    where: { userId: (user as any).id, deletedAt: IsNull() },
    order: { createdAt: 'DESC' }
  })
})

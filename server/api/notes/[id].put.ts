import { IsNull } from 'typeorm'
import { AppDataSource } from '~~/server/db/data-source'
import { Note } from '~~/server/db/entities/Note'

export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const { title, content } = body

  if (!title?.trim() || !content?.trim()) {
    throw createError({ statusCode: 400, message: 'Title and content are required' })
  }

  const repo = AppDataSource.getRepository(Note)
  const note = await repo.findOneBy({ noteId: id, userId: (user as any).id, deletedAt: IsNull() })
  if (!note) throw createError({ statusCode: 404, message: 'Note not found' })

  note.title = title.trim()
  note.content = content.trim()
  note.updatedAt = new Date()
  return repo.save(note)
})

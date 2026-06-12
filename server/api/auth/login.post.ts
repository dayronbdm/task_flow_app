import bcrypt from 'bcryptjs'
import { AppDataSource } from '~~/server/db/data-source'
import { User } from '~~/server/db/entities/User'
import { signToken } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({ statusCode: 400, message: 'Email and password are required' })
  }

  const repo = AppDataSource.getRepository(User)
  const user = await repo.findOneBy({ email })
  if (!user) {
    throw createError({ statusCode: 401, message: 'Invalid credentials' })
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    throw createError({ statusCode: 401, message: 'Invalid credentials' })
  }

  user.lastLoginAt = new Date()
  await repo.save(user)

  const config = useRuntimeConfig(event)
  const token = await signToken(
    { userId: user.userId, email: user.email, username: user.username },
    config.jwtSecret
  )

  await setUserSession(event, {
    user: { id: user.userId, email: user.email, username: user.username },
    secure: { token }
  })

  return { token, user: { id: user.userId, email: user.email, username: user.username } }
})

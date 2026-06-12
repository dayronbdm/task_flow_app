import bcrypt from 'bcryptjs'
import { AppDataSource } from '~~/server/db/data-source'
import { User } from '~~/server/db/entities/User'
import { signToken } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, email, password } = body

  // make sure all fields are filled in
  if (!username || !email || !password) {
    throw createError({ statusCode: 400, message: 'All fields are required' })
  }

  const repo = AppDataSource.getRepository(User)

  // check if the email is already taken
  const exists = await repo.findOneBy({ email })
  if (exists) {
    throw createError({ statusCode: 409, message: 'Email already registered' })
  }

  // hash the password before saving to the database
  const passwordHash = await bcrypt.hash(password, 12)
  const user = await repo.save({ username, email, passwordHash, createdAt: new Date() })

  // generate a jwt token for the new user
  const config = useRuntimeConfig(event)
  const token = await signToken(
    { userId: user.userId, email: user.email, username: user.username },
    config.jwtSecret
  )

  // save the session so the user stays logged in
  await setUserSession(event, {
    user: { id: user.userId, email: user.email, username: user.username },
    secure: { token }
  })

  return { token, user: { id: user.userId, email: user.email, username: user.username } }
})

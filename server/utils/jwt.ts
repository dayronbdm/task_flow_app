import { SignJWT, jwtVerify, type JWTPayload } from 'jose'

export interface TokenPayload extends JWTPayload {
  userId: number
  email: string
  username: string
}

// create a jwt token with the user info inside
export async function signToken(
  payload: { userId: number; email: string; username: string },
  secret: string
): Promise<string> {
  const key = new TextEncoder().encode(secret)
  return new SignJWT(payload as JWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key)
}

// verify the token and get the data out of it
export async function verifyToken(token: string, secret: string): Promise<TokenPayload> {
  const key = new TextEncoder().encode(secret)
  const { payload } = await jwtVerify(token, key)
  return payload as TokenPayload
}

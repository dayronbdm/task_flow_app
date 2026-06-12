// clear the session to log the user out
export default defineEventHandler(async (event) => {
  await clearUserSession(event)
  return { ok: true }
})

import { initDb, getAllBriefs } from '../db/index'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Simple token-based protection
  const token = getHeader(event, 'x-admin-token')
  if (!token || token !== config.adminToken) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  await initDb()
  const briefs = await getAllBriefs()
  return { briefs, total: briefs.length }
})

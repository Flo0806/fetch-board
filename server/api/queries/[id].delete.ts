export default defineEventHandler(async (event) => {
  const storage = useStorage('data')
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Query ID is required',
    })
  }

  const existing = await storage.getItem(`queries:${id}`)

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Query not found',
    })
  }

  await storage.removeItem(`queries:${id}`)

  return { success: true }
})

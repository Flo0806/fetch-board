export default defineEventHandler(async (event) => {
  const storage = useStorage('data')
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Query ID is required',
    })
  }

  const storageKey = getUserStorageKey(event, 'queries', id)
  const existing = await storage.getItem(storageKey)

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Query not found',
    })
  }

  await storage.removeItem(storageKey)

  return { success: true }
})

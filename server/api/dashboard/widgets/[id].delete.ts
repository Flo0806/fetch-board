export default defineEventHandler(async (event): Promise<{ success: boolean }> => {
  const storage = useStorage('data')
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'ID required' })
  }

  const storageKey = getUserStorageKey(event, 'dashboard:widgets', id)
  await storage.removeItem(storageKey)

  return { success: true }
})

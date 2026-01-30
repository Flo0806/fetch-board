export default defineEventHandler(async (event) => {
  const storage = useStorage('data')
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const storageKey = getUserStorageKey(event, 'dashboard:widgets', id!)

  if (!id) {
    throw createError({ statusCode: 400, message: 'ID required' })
  }

  const existing = await storage.getItem<Record<string, unknown>>(storageKey)
  if (!existing) {
    throw createError({ statusCode: 404, message: 'Widget not found' })
  }

  const widget = {
    ...existing,
    ...body,
    id,
    updatedAt: new Date().toISOString(),
  }

  await storage.setItem(storageKey, widget)

  return widget
})

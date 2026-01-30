export default defineEventHandler(async (event) => {
  const storage = useStorage('data')
  const body = await readBody(event)
  const ids: string[] = body.ids
  const storagePrefix = getUserStorageKey(event, 'dashboard:widgets')

  if (!Array.isArray(ids)) {
    throw createError({ statusCode: 400, message: 'ids array required' })
  }

  // Update position for each widget
  await Promise.all(
    ids.map(async (id, index) => {
      const storageKey = `${storagePrefix}:${id}`
      const widget = await storage.getItem<Record<string, unknown>>(storageKey)
      if (widget) {
        await storage.setItem(storageKey, {
          ...widget,
          position: index,
          updatedAt: new Date().toISOString(),
        })
      }
    }),
  )

  return { success: true }
})

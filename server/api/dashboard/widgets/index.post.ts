export default defineEventHandler(async (event) => {
  const storage = useStorage('data')
  const body = await readBody(event)
  const storageKey = getUserStorageKey(event, 'dashboard:widgets')

  const id = crypto.randomUUID()
  const widget = {
    ...body,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  await storage.setItem(`${storageKey}:${id}`, widget)

  return widget
})

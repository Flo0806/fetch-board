export default defineEventHandler(async (event): Promise<Query[]> => {
  const storage = useStorage('data')
  const storagePrefix = getUserStorageKey(event, 'queries')

  const keys = await storage.getKeys(storagePrefix)

  const queries = await Promise.all(
    keys.map(key => storage.getItem<Query>(key)),
  )

  return queries
    .filter((q): q is Query => q !== null)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
})

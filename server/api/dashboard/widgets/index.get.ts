export default defineEventHandler(async (event) => {
  const storage = useStorage('data')
  const storagePrefix = getUserStorageKey(event, 'dashboard:widgets')

  const keys = await storage.getKeys(storagePrefix)

  const widgets = await Promise.all(
    keys.map(key => storage.getItem(key)),
  )

  return widgets
    .filter(Boolean)
    .sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
})

export default defineEventHandler(async () => {
  const storage = useStorage('data')

  // Get all query keys
  const keys = await storage.getKeys('queries')

  // Load all queries
  const queries = await Promise.all(
    keys.map(async (key) => {
      const query = await storage.getItem(key)
      return query
    }),
  )

  // Filter out nulls and sort by updatedAt
  return queries
    .filter(Boolean)
    .sort((a, b) => {
      const aTime = new Date((a as { updatedAt: string }).updatedAt).getTime()
      const bTime = new Date((b as { updatedAt: string }).updatedAt).getTime()
      return bTime - aTime
    })
})

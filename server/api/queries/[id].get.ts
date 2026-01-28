export default defineEventHandler(async (event) => {
  const storage = useStorage('data')
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Query ID is required',
    })
  }

  const query = await storage.getItem(`queries:${id}`)

  if (!query) {
    throw createError({
      statusCode: 404,
      message: 'Query not found',
    })
  }

  return query
})

export default defineEventHandler(async (event): Promise<Query> => {
  const storage = useStorage('data')
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Query ID is required',
    })
  }

  const query = await storage.getItem<Query>(`queries:${id}`)

  if (!query) {
    throw createError({
      statusCode: 404,
      message: 'Query not found',
    })
  }

  return query
})

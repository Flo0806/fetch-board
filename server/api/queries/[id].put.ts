export default defineEventHandler(async (event) => {
  const storage = useStorage('data')
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Query ID is required',
    })
  }

  const existing = await storage.getItem(`queries:${id}`)

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Query not found',
    })
  }

  const updated = {
    ...(existing as object),
    ...body,
    id, // Ensure ID cannot be changed
    updatedAt: new Date().toISOString(),
  }

  await storage.setItem(`queries:${id}`, updated)

  return updated
})

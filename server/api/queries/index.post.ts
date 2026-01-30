import { randomUUID } from 'node:crypto'

export default defineEventHandler(async (event) => {
  const storage = useStorage('data')
  const body = await readBody(event)
  const storagePrefix = getUserStorageKey(event, 'queries')

  const { name, url, method, headers, body: requestBody, transform, display } = body

  if (!name || !url) {
    throw createError({
      statusCode: 400,
      message: 'Name and URL are required',
    })
  }

  const id = randomUUID()
  const now = new Date().toISOString()

  const query = {
    id,
    name,
    url,
    method: method || 'GET',
    headers: headers || {},
    body: requestBody || '',
    transform: transform || '',
    display: display || { type: 'raw' },
    createdAt: now,
    updatedAt: now,
  }

  await storage.setItem(`${storagePrefix}:${id}`, query)

  return query
})

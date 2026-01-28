export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { url, method, headers, body: requestBody, transform } = body

  if (!url) {
    throw createError({
      statusCode: 400,
      message: 'URL is required',
    })
  }

  try {
    // Execute the request
    const response = await $fetch(url, {
      method: method || 'GET',
      headers: headers || {},
      body: requestBody ? JSON.parse(requestBody) : undefined,
    })

    // Apply transform if provided
    if (transform && transform.trim()) {
      try {
        // Create a function that takes response and returns transformed data
        // eslint-disable-next-line no-new-func
        const transformFn = new Function('response', `return ${transform}`)
        return transformFn(response)
      }
      catch (transformError) {
        throw createError({
          statusCode: 400,
          message: `Transform error: ${transformError instanceof Error ? transformError.message : 'Unknown error'}`,
        })
      }
    }

    return response
  }
  catch (err) {
    if (err && typeof err === 'object' && 'statusCode' in err) {
      throw err
    }

    throw createError({
      statusCode: 500,
      message: `Request failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
    })
  }
})

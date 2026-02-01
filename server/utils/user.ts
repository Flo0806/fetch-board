import type { H3Event } from 'h3'

/**
 * Get the current user ID from session
 */
export async function getUserId(event: H3Event): Promise<string> {
  const session = await getUserSession(event)

  if (!session?.user?.id) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  return session.user.id
}

/**
 * Get storage key prefix for user-scoped data
 */
export function getUserStoragePrefix(event: H3Event): string {
  const userId = getUserId(event)
  return `user:${userId}`
}

/**
 * Build user-scoped storage key
 */
export function getUserStorageKey(event: H3Event, ...parts: string[]): string {
  const prefix = getUserStoragePrefix(event)
  return [prefix, ...parts].join(':')
}

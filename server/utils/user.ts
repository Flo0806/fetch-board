import type { H3Event } from 'h3'

// Placeholder user ID for development (will be replaced with GitHub auth)
const DEV_USER_ID = 'dev-user'

/**
 * Get the current user ID from session
 * TODO: Replace with actual GitHub OAuth session lookup
 */
export function getUserId(_event: H3Event): string {
  // Later: const session = await getUserSession(event)
  // return session?.user?.id || throw unauthorized error

  // For now: return dev user ID
  return DEV_USER_ID
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

export const useQueriesStore = defineStore('queries', () => {
  const queries = ref<Query[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  // #region Helpers
  function clearError() {
    error.value = null
  }
  // #endregion

  // Load all queries
  async function fetchQueries() {
    loading.value = true
    clearError()

    try {
      queries.value = await $fetch('/api/queries', { method: 'GET' })
    }
    catch (err) {
      error.value = err as Error
      console.error('[QUERIES] Failed to load queries:', err)
    }
    finally {
      loading.value = false
    }
  }

  async function getQueryById(id: string): Promise<Query | null> {
    loading.value = true
    clearError()
    // Try find in store first
    const findFromStore = queries.value.find(q => q.id === id)
    if (findFromStore) {
      loading.value = false
      return findFromStore
    }

    // Try fetch from API
    let query: Query | null = null
    try {
      query = await $fetch<Query>(`/api/queries/${id}`, { method: 'GET' })
      queries.value.push(query)
    }
    catch (err) {
      error.value = err as Error
      console.error(`[QUERIES] Failed to load query ${id}:`, err)
    }
    finally {
      loading.value = false
    }
    return query
  }

  // Delete query by ID
  async function deleteQuery(id: string): Promise<boolean> {
    loading.value = true
    clearError()
    try {
      await $fetch<{ success: boolean }>(`/api/queries/${id}`, {
        method: 'DELETE',
      })
      queries.value = queries.value.filter(query => query.id !== id)
    }
    catch (err) {
      error.value = err as Error
      console.error('[QUERIES] Failed to delete query:', err)
      return false
    }
    finally {
      loading.value = false
    }
    return true
  }

  // Create query
  async function createQuery(query: Omit<Query, 'id' | 'createdAt' | 'updatedAt'>): Promise<Query | null> {
    loading.value = true
    clearError()
    try {
      const created = await $fetch<Query>('/api/queries', {
        method: 'POST',
        body: query,
      })
      queries.value.push(created)
      return created
    }
    catch (err) {
      error.value = err as Error
      console.error('[QUERIES] Failed to create query:', err)
      return null
    }
    finally {
      loading.value = false
    }
  }

  // Update query
  async function updateQuery(id: string, query: Partial<Omit<Query, 'id' | 'createdAt' | 'updatedAt'>>): Promise<boolean> {
    loading.value = true
    clearError()
    try {
      const updated = await $fetch<Query>(`/api/queries/${id}`, {
        method: 'PUT',
        body: query,
      })
      const index = queries.value.findIndex(q => q.id === id)
      if (index !== -1) {
        queries.value[index] = updated
      }
      return true
    }
    catch (err) {
      error.value = err as Error
      console.error('[QUERIES] Failed to update query:', err)
      return false
    }
    finally {
      loading.value = false
    }
  }

  return {
    queries,
    loading,
    error,

    // methods,
    fetchQueries,
    getQueryById,
    deleteQuery,
    createQuery,
    updateQuery,
  }
})

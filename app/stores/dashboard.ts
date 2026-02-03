export const useDashboardStore = defineStore('dashboard', () => {
  const widgets = ref<DashboardWidget[]>([])
  const loading = ref(false)

  // Load all widgets
  async function load() {
    loading.value = true
    try {
      const data = await $fetch<DashboardWidget[]>('/api/dashboard/widgets')
      widgets.value = data
    }
    catch (err) {
      console.error('Failed to load widgets:', err)
    }
    finally {
      loading.value = false
    }
  }

  // Save/update a widget
  async function save(widget: DashboardWidget) {
    try {
      await $fetch(`/api/dashboard/widgets/${widget.id}`, {
        method: 'PUT',
        body: widget,
      })
      // Update local state
      const index = widgets.value.findIndex(w => w.id === widget.id)
      if (index !== -1) {
        widgets.value[index] = widget
      }
      else {
        widgets.value.push(widget)
      }
    }
    catch (err) {
      console.error('Failed to save widget:', err)
      throw err
    }
  }

  // Create a new widget
  async function create(widget: Omit<DashboardWidget, 'id'>) {
    try {
      const created = await $fetch<DashboardWidget>('/api/dashboard/widgets', {
        method: 'POST',
        body: widget,
      })
      widgets.value.push(created)
      return created
    }
    catch (err) {
      console.error('Failed to create widget:', err)
      throw err
    }
  }

  // Delete a widget
  async function remove(id: string) {
    try {
      await $fetch<{ success: boolean }>(`/api/dashboard/widgets/${id}`, {
        method: 'DELETE',
      })
      widgets.value = widgets.value.filter(w => w.id !== id)
    }
    catch (err) {
      console.error('Failed to delete widget:', err)
      throw err
    }
  }

  // Update positions (after drag & drop)
  async function updatePositions(orderedIds: string[]) {
    try {
      await $fetch('/api/dashboard/widgets/positions', {
        method: 'PUT',
        body: { ids: orderedIds },
      })
      // Update local positions
      orderedIds.forEach((id, index) => {
        const widget = widgets.value.find(w => w.id === id)
        if (widget) widget.position = index
      })
    }
    catch (err) {
      console.error('Failed to update positions:', err)
      throw err
    }
  }

  return {
    widgets,
    loading,
    load,
    save,
    create,
    remove,
    updatePositions,
  }
})

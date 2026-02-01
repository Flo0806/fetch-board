<script setup lang="ts">
import draggable from 'vuedraggable'
import type { InfoCardData } from '~/components/dashboard/DashboardInfoCard.vue'
import { type DashboardWidget, useDashboardStore } from '~/stores/dashboard'

definePageMeta({
  title: 'Dashboard',
})

const store = useDashboardStore()

const isEditMode = ref(true)
const isAnyCardEditing = ref(false)

// Palette items (templates for cloning)
interface PaletteItem {
  id: string
  type: 'card' | 'table' | 'list' | 'raw'
  size: 6 | 12
}

const palette = ref<PaletteItem[]>([
  { id: 'p1', type: 'card', size: 6 },
  { id: 'p3', type: 'list', size: 6 },
  { id: 'p2', type: 'table', size: 12 },
  { id: 'p4', type: 'raw', size: 12 },
])

const widgetInfo: Record<string, { label: string, icon: string }> = {
  card: { label: 'Info Card', icon: 'i-heroicons-square-2-stack' },
  table: { label: 'Table', icon: 'i-heroicons-table-cells' },
  list: { label: 'List', icon: 'i-heroicons-list-bullet' },
  raw: { label: 'Raw JSON', icon: 'i-heroicons-code-bracket' },
}

// Load widgets on mount
onMounted(() => {
  store.load()
})

// Temporary clone for drag preview (will be replaced by server response)
function cloneWidget(item: PaletteItem): DashboardWidget {
  return {
    id: `temp-${crypto.randomUUID()}`,
    type: item.type,
    size: item.size,
    position: store.widgets.length,
    fields: [],
  }
}

// Handle widget added from palette
async function onWidgetAdded(event: { newIndex: number }) {
  const tempWidget = store.widgets[event.newIndex]
  if (!tempWidget || !tempWidget.id.startsWith('temp-')) return

  try {
    const created = await $fetch<DashboardWidget>('/api/dashboard/widgets', {
      method: 'POST',
      body: {
        type: tempWidget.type,
        size: tempWidget.size,
        position: event.newIndex,
        fields: tempWidget.fields,
      },
    })
    // Replace temp widget with server response
    store.widgets[event.newIndex] = created
  }
  catch (err) {
    console.error('Failed to create widget:', err)
    // Remove the temp widget on error
    store.widgets.splice(event.newIndex, 1)
  }
}

// Delete widget
async function deleteWidget(id: string) {
  await store.remove(id)
}

// Save widget configuration
async function saveWidget(id: string, data: InfoCardData) {
  const widget = store.widgets.find(w => w.id === id)
  if (!widget) return

  const updated: DashboardWidget = {
    ...widget,
    fields: [
      { key: 'icon', value: data.icon, isPath: false },
      { key: 'valuePath', value: data.valuePath, isPath: true },
      { key: 'label', value: data.label, isPath: data.labelIsPath },
      { key: 'description', value: data.description, isPath: false },
      { key: 'field1Value', value: data.field1Value, isPath: data.field1IsPath },
      { key: 'field1Label', value: data.field1Label, isPath: false },
      { key: 'field2Value', value: data.field2Value, isPath: data.field2IsPath },
      { key: 'field2Label', value: data.field2Label, isPath: false },
    ],
  }
  await store.save(updated)
}

// Update positions after drag & drop (only for reorder, not add)
async function onDragEnd(event: { from: HTMLElement, to: HTMLElement }) {
  // Skip if this was an add from palette (handled by onWidgetAdded)
  if (event.from !== event.to) return

  // Only include persisted widgets (not temp)
  const orderedIds = store.widgets
    .filter((w: DashboardWidget) => !w.id.startsWith('temp-'))
    .map((w: DashboardWidget) => w.id)

  if (orderedIds.length > 0) {
    await store.updatePositions(orderedIds)
  }
}

// Disable DnD when any card is being edited
const isDragDisabled = computed(() => !isEditMode.value || isAnyCardEditing.value)

// Helper to extract card props from widget fields
function getCardProps(widget: DashboardWidget) {
  const getField = (key: string) => widget.fields.find(f => f.key === key)?.value || ''

  return {
    icon: getField('icon') || 'i-heroicons-chart-bar',
    value: getField('valuePath') || '–',
    label: getField('label') || 'Neues Widget',
    description: getField('description'),
    fields: [
      getField('field1Value') && { value: getField('field1Value'), label: getField('field1Label') },
      getField('field2Value') && { value: getField('field2Value'), label: getField('field2Label') },
    ].filter(Boolean) as { value: string, label: string }[],
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold">
        Dashboard
      </h1>
      <div class="flex gap-2">
        <UButton
          :icon="isEditMode ? 'i-heroicons-check' : 'i-heroicons-pencil'"
          :variant="isEditMode ? 'solid' : 'outline'"
          @click="isEditMode = !isEditMode"
        >
          {{ isEditMode ? 'Done' : 'Edit' }}
        </UButton>
        <UButton
          icon="i-heroicons-plus"
          to="/builder"
        >
          New Query
        </UButton>
      </div>
    </div>

    <div class="flex gap-6">
      <!-- Dashboard Grid -->
      <div class="flex-1 min-w-0">
        <draggable
          v-model="store.widgets"
          group="widgets"
          item-key="id"
          :disabled="isDragDisabled"
          class="grid grid-cols-12 gap-4 min-h-32 p-2 -m-2 rounded-lg"
          :class="isEditMode && 'bg-neutral-50 dark:bg-neutral-900/50'"
          @add="onWidgetAdded"
          @end="onDragEnd"
        >
          <template #item="{ element }">
            <div :class="element.size === 12 ? 'col-span-12' : 'col-span-12 md:col-span-6'">
              <!-- Card Widget -->
              <template v-if="element.type === 'card'">
                <DashboardInfoCard
                  class="h-70"
                  :icon="getCardProps(element).icon"
                  :value="getCardProps(element).value"
                  :label="getCardProps(element).label"
                  :description="getCardProps(element).description"
                  :fields="getCardProps(element).fields"
                  :dashboard-edit-mode="isEditMode"
                  @delete="deleteWidget(element.id)"
                  @save="(data) => saveWidget(element.id, data)"
                  @edit-mode="(editing) => isAnyCardEditing = editing"
                />
              </template>

              <!-- Other types placeholder -->
              <template v-else>
                <UCard class="h-70 flex items-center justify-center">
                  <UIcon
                    :name="widgetInfo[element.type]?.icon"
                    class="size-6 text-muted mr-2"
                  />
                  <span class="text-muted">{{ widgetInfo[element.type]?.label }}</span>
                </UCard>
              </template>
            </div>
          </template>
        </draggable>
      </div>

      <!-- Palette (Edit mode only) -->
      <div
        v-if="isEditMode"
        class="w-64 shrink-0"
      >
        <UCard>
          <template #header>
            <span class="font-medium text-sm">Widgets</span>
          </template>

          <draggable
            v-model="palette"
            :group="{ name: 'widgets', pull: 'clone', put: false }"
            :clone="cloneWidget"
            :sort="false"
            :disabled="isAnyCardEditing"
            item-key="id"
            class="grid grid-cols-12 gap-2"
          >
            <template #item="{ element }">
              <div
                :class="element.size === 12 ? 'col-span-12' : 'col-span-6'"
                class="border border-neutral-200 dark:border-neutral-700 rounded-lg p-3 cursor-grab hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <UIcon
                  :name="widgetInfo[element.type]?.icon"
                  class="size-5 text-primary-500 mb-1"
                />
                <div class="text-xs font-medium">
                  {{ widgetInfo[element.type]?.label }}
                </div>
                <div class="text-xs text-muted">
                  {{ element.size === 12 ? 'Full' : 'Half' }}
                </div>
              </div>
            </template>
          </draggable>
        </UCard>
      </div>
    </div>
  </div>
</template>

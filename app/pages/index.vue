<script setup lang="ts">
import type { FreeformItemData } from 'nuxt-freeform'
import type { CardItem, ControlItem, DashboardItem } from '~/types/dashboard'

definePageMeta({
  title: 'Dashboard',
})

// Dashboard cards
const dashboardCards = ref<CardItem[]>([])

// Sidebar palette items (source lists - items get cloned on drag)
const cardPalette = ref<CardItem[]>([
  { id: 'tpl-card-6', itemType: 'card', cols: 6, controls: [], type: 'container' },
  { id: 'tpl-card-12', itemType: 'card', cols: 12, controls: [], type: 'container' },
])

const controlPalette = ref<ControlItem[]>([
  { id: 'tpl-control-text', itemType: 'control', controlType: 'text', labelText: 'Label', labelValue: '' },
])

const isEditMode = ref(true)

// Accept function for dashboard drop zone - only cards directly
// Controls bypass this check when targeting a card (hierarchical accept)
function acceptOnlyCards(items: FreeformItemData[]) {
  return items.every(item => (item as DashboardItem).itemType === 'card')
}

// Accept function for cards - only controls
function acceptOnlyControls(items: FreeformItemData[]) {
  return items.every(item => (item as DashboardItem).itemType === 'control')
}

// Handle items dropped to dashboard zone
function onDropToDashboard(items: FreeformItemData[], zoneId: string, index: number, containerId: string | null) {
  // Only handle drops to dashboard zone
  if (zoneId !== 'dashboard') return

  const droppedItems = items as DashboardItem[]

  // If dropped onto a card (container), add controls
  if (containerId) {
    const card = dashboardCards.value.find(c => c.id === containerId)
    if (card && droppedItems.every(i => i.itemType === 'control')) {
      const controls = droppedItems as ControlItem[]
      controls.forEach((ctrl) => {
        card.controls.push({
          ...ctrl,
          id: `control-${crypto.randomUUID()}`,
        })
      })
    }
    return
  }

  // Regular drop - add cards to dashboard (only if they are cards)
  if (!droppedItems.every(i => i.itemType === 'card')) return

  const cards = droppedItems as CardItem[]
  cards.forEach((card) => {
    const newCard: CardItem = {
      ...card,
      id: `card-${crypto.randomUUID()}`,
      controls: [],
    }
    dashboardCards.value.splice(index, 0, newCard)
  })
}

// Handle drop into card (internal - same zone)
function onDropIntoCard(items: FreeformItemData[], container: FreeformItemData, accepted: boolean) {
  if (!accepted) return

  const card = dashboardCards.value.find(c => c.id === container.id)
  if (!card) return

  const controls = items as ControlItem[]
  controls.forEach((ctrl) => {
    card.controls.push({
      ...ctrl,
      id: `control-${crypto.randomUUID()}`,
    })
  })
}

// Remove card from dashboard
function removeCard(id: string) {
  dashboardCards.value = dashboardCards.value.filter(c => c.id !== id)
}

// Remove control from card
function removeControl(cardId: string, controlId: string) {
  const card = dashboardCards.value.find(c => c.id === cardId)
  if (!card) return
  card.controls = card.controls.filter(c => c.id !== controlId)
}

// Update control config
function updateControl(cardId: string, controlId: string, updates: Partial<ControlItem>) {
  const card = dashboardCards.value.find(c => c.id === cardId)
  if (!card) return
  const control = card.controls.find(c => c.id === controlId)
  if (!control) return
  Object.assign(control, updates)
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
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
      </div>
    </div>

    <div class="flex gap-6">
      <!-- Dashboard Drop Zone -->
      <FreeformDropZone
        id="dashboard"
        class="flex-1 min-w-0"
        :accept="acceptOnlyCards"
      >
        <template #default="{ isOver, isAccepted, items: zoneItems }">
          <div
            class="min-h-64 p-4 rounded-lg border-2 border-dashed transition-all"
            :class="{
              'border-primary-300 bg-primary-50/50 dark:border-primary-700 dark:bg-primary-950/20': isEditMode && !isOver,
              'border-transparent': !isEditMode && !isOver,
              'border-green-500 bg-green-50 dark:bg-green-950/20': isOver && isAccepted,
              'border-red-500 bg-red-50 dark:bg-red-950/20': isOver && !isAccepted,
            }"
          >
            <TheFreeform
              v-model="dashboardCards"
              drop-zone-id="dashboard"
              :disabled="!isEditMode"
              class="grid grid-cols-12 gap-4"
              @drop-to-zone="onDropToDashboard"
              @drop-into="onDropIntoCard"
            >
              <template #default="{ dragItems }">
                <!-- Cards on the dashboard -->
                <FreeformItem
                  v-for="card in dashboardCards"
                  :key="card.id"
                  :item="card"
                  :accept="acceptOnlyControls"
                  :class="card.cols === 12 ? 'col-span-12' : 'col-span-12 md:col-span-6'"
                >
                  <template #default="{ selected, dragging, dropTarget, dropAccepted }">
                    <DashboardCard
                      :card="card"
                      :is-edit-mode="isEditMode"
                      :selected="selected"
                      :dragging="dragging"
                      :drop-target="dropTarget"
                      :drop-accepted="dropAccepted"
                      @remove="removeCard(card.id)"
                      @remove-control="removeControl(card.id, $event)"
                      @update-control="updateControl(card.id, $event.controlId, $event.updates)"
                    />
                  </template>
                </FreeformItem>

                <FreeformPlaceholder :class="(dragItems?.[0] as CardItem)?.cols === 12 || (zoneItems?.[0] as CardItem)?.cols === 12 ? 'col-span-12' : 'col-span-12 md:col-span-6'">
                  <template #default="{ count }">
                    <div class="h-40 flex items-center justify-center border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                      <span class="text-muted text-sm">{{ count > 0 ? `${count} item(s)` : 'Drop here' }}</span>
                    </div>
                  </template>
                </FreeformPlaceholder>
              </template>

              <template #drag-ghost="{ items, count }">
                <div class="px-4 py-3 rounded-lg bg-white dark:bg-neutral-800 shadow-xl border">
                  <span class="font-medium">{{ (items[0] as CardItem)?.itemType === 'card' ? 'Card' : 'Control' }}</span>
                  <span
                    v-if="count > 1"
                    class="ml-2 text-muted"
                  >+{{ count - 1 }}</span>
                </div>
              </template>
            </TheFreeform>

            <!-- Empty state -->
            <div
              v-if="dashboardCards.length === 0 && isEditMode"
              class="flex flex-col items-center justify-center py-12 text-muted"
            >
              <UIcon
                name="i-heroicons-square-2-stack"
                class="size-12 mb-4 opacity-50"
              />
              <p>Drag cards from the sidebar to get started</p>
            </div>
          </div>
        </template>
      </FreeformDropZone>

      <!-- Sidebar (Edit mode only) -->
      <div
        v-if="isEditMode"
        class="w-64 shrink-0 space-y-4"
      >
        <PalettePanel
          v-model="cardPalette"
          title="Cards"
          zone-id="card-palette"
          grid-class="grid grid-cols-2 gap-2"
          :item-class="(item: FreeformItemData) => (item as CardItem).cols === 12 ? 'col-span-2' : 'col-span-1'"
          @drop-to-zone="onDropToDashboard"
        >
          <template #item="{ item }">
            <UIcon
              name="i-heroicons-square-2-stack"
              class="size-5 text-primary-500 mb-1"
            />
            <div class="text-xs font-medium">
              Card
            </div>
            <div class="text-xs text-muted">
              {{ (item as CardItem).cols === 12 ? 'Full Width' : 'Half Width' }}
            </div>
          </template>
          <template #ghost-label>
            <span class="font-medium">Card</span>
          </template>
        </PalettePanel>

        <PalettePanel
          v-model="controlPalette"
          title="Controls"
          zone-id="control-palette"
          grid-class="space-y-2"
          @drop-to-zone="onDropToDashboard"
        >
          <template #item>
            <UIcon
              name="i-heroicons-document-text"
              class="size-5 text-primary-500 mb-1"
            />
            <div class="text-xs font-medium">
              Text
            </div>
            <div class="text-xs text-muted">
              Label + Value
            </div>
          </template>
          <template #ghost-label>
            <span class="font-medium">Control</span>
          </template>
        </PalettePanel>
      </div>
    </div>

    <!-- Debug -->
    <div class="mt-8 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
      <div class="text-sm font-medium mb-2">
        Debug: Dashboard State
      </div>
      <pre class="text-xs overflow-auto max-h-64">{{ JSON.stringify(dashboardCards, null, 2) }}</pre>
    </div>
  </div>
</template>

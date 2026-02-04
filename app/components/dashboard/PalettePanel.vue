<script setup lang="ts">
import type { FreeformItemData } from 'nuxt-freeform'

const props = defineProps<{
  title: string
  zoneId: string
  gridClass?: string
  itemClass?: (item: FreeformItemData) => string
}>()

const items = defineModel<FreeformItemData[]>({ required: true })

const emit = defineEmits<{
  dropToZone: [items: FreeformItemData[], zoneId: string, index: number, containerId: string | null]
}>()

function onDropToZone(droppedItems: FreeformItemData[], zoneId: string, index: number, containerId: string | null) {
  emit('dropToZone', droppedItems, zoneId, index, containerId)
}
</script>

<template>
  <UCard>
    <template #header>
      <span class="font-medium text-sm">{{ title }}</span>
    </template>

    <FreeformDropZone :id="zoneId">
      <TheFreeform
        v-model="items"
        :drop-zone-id="zoneId"
        :class="gridClass"
        @drop-to-zone="onDropToZone"
      >
        <FreeformItem
          v-for="item in items"
          :key="item.id"
          :item="item"
          :class="itemClass?.(item)"
        >
          <template #default="{ dragging }">
            <div
              class="border border-neutral-200 dark:border-neutral-700 rounded-lg p-3 cursor-grab hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              :class="{ 'opacity-50': dragging }"
            >
              <slot name="item" :item="item" />
            </div>
          </template>
        </FreeformItem>

        <template #drag-ghost="{ count }">
          <div class="px-4 py-3 rounded-lg bg-white dark:bg-neutral-800 shadow-xl border">
            <slot name="ghost-label" />
            <span
              v-if="count > 1"
              class="ml-2 text-muted"
            >+{{ count - 1 }}</span>
          </div>
        </template>
      </TheFreeform>
    </FreeformDropZone>
  </UCard>
</template>

<script setup lang="ts">
import type { CardItem, ControlItem } from '~/types/dashboard'

const props = defineProps<{
  card: CardItem
  isEditMode: boolean
  selected?: boolean
  dragging?: boolean
  dropTarget?: boolean
  dropAccepted?: boolean
}>()

const emit = defineEmits<{
  remove: []
  removeControl: [controlId: string]
  updateControl: [payload: { controlId: string, updates: Partial<ControlItem> }]
}>()
</script>

<template>
  <UCard
    class="h-full min-h-40 transition-all"
    :ui="{ body: 'p-2 sm:p-3' }"
    :class="{
      'ring-2 ring-primary-500': selected,
      'opacity-50': dragging,
      'ring-2 ring-green-500 bg-green-50 dark:bg-green-950/20': dropTarget && dropAccepted,
      'ring-2 ring-red-500 bg-red-50 dark:bg-red-950/20': dropTarget && !dropAccepted,
    }"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-muted">
          Card {{ props.card.cols === 12 ? '(Full)' : '(Half)' }}
        </span>
        <UButton
          v-if="isEditMode"
          icon="i-heroicons-trash"
          size="xs"
          color="error"
          variant="ghost"
          @click.stop="emit('remove')"
        />
      </div>
    </template>

    <!-- Controls inside the card -->
    <div
      class="grid gap-1.5 min-h-16"
      :class="props.card.controls.length > 0 ? 'grid-cols-2' : 'grid-cols-1'"
    >
      <template v-if="props.card.controls.length === 0">
        <div class="col-span-full flex items-center justify-center text-muted text-sm">
          {{ isEditMode ? 'Drop controls here' : 'No controls' }}
        </div>
      </template>

      <template
        v-for="control in props.card.controls"
        :key="control.id"
      >
        <DashboardControlText
          v-if="control.controlType === 'text'"
          :control="control"
          :is-edit-mode="isEditMode"
          @update="emit('updateControl', { controlId: control.id, updates: $event })"
          @remove="emit('removeControl', control.id)"
        />
      </template>
    </div>
  </UCard>
</template>

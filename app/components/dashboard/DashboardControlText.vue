<script setup lang="ts">
import type { ControlItem } from '~/types/dashboard'

const props = defineProps<{
  control: ControlItem
  isEditMode: boolean
}>()

const emit = defineEmits<{
  update: [updates: Partial<ControlItem>]
  remove: []
}>()

function onLabelTextChange(value: string) {
  emit('update', { labelText: value })
}

function onLabelValueChange(value: string) {
  emit('update', { labelValue: value })
}
</script>

<template>
  <div class="p-1.5 border rounded bg-white dark:bg-neutral-800">
    <!-- Edit Mode -->
    <template v-if="isEditMode">
      <div class="space-y-1">
        <div class="flex gap-1">
          <UInput
            :model-value="props.control.labelText"
            placeholder="Label"
            size="xs"
            class="flex-1 min-w-0"
            @update:model-value="onLabelTextChange($event as string)"
          />
          <UButton
            icon="i-heroicons-x-mark"
            size="xs"
            color="error"
            variant="ghost"
            class="p-0.5! shrink-0"
            @click="emit('remove')"
          />
        </div>
        <UInput
          :model-value="props.control.labelValue"
          placeholder="response.x"
          size="xs"
          @update:model-value="onLabelValueChange($event as string)"
        />
      </div>
    </template>

    <!-- View Mode -->
    <template v-else>
      <div class="text-[10px] text-muted leading-tight">
        {{ props.control.labelText || 'Label' }}
      </div>
      <div class="text-sm font-semibold leading-tight">
        {{ props.control.labelValue || '–' }}
      </div>
    </template>
  </div>
</template>

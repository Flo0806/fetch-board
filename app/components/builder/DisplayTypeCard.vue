<script setup lang="ts">
const display = defineModel<DisplayConfig>({ required: true })

const displayTypes: { value: DisplayType, label: string, icon: string }[] = [
  { value: 'card', label: 'Card', icon: 'i-heroicons-square-2-stack' },
  { value: 'table', label: 'Table', icon: 'i-heroicons-table-cells' },
  { value: 'list', label: 'List', icon: 'i-heroicons-list-bullet' },
  { value: 'raw', label: 'Raw JSON', icon: 'i-heroicons-code-bracket' },
]
</script>

<template>
  <UCard>
    <template #header>
      <span class="font-medium">Display Type</span>
    </template>

    <div class="flex gap-2 mb-4">
      <UButton
        v-for="dt in displayTypes"
        :key="dt.value"
        :icon="dt.icon"
        :variant="display.type === dt.value ? 'solid' : 'outline'"
        :color="display.type === dt.value ? 'primary' : 'neutral'"
        @click="display.type = dt.value"
      >
        {{ dt.label }}
      </UButton>
    </div>

    <!-- Card options -->
    <div
      v-if="display.type === 'card'"
      class="space-y-4"
    >
      <UFormField
        label="Value Path"
        hint="e.g. stargazers_count or data.total"
      >
        <UInput
          v-model="display.value"
          placeholder="response.field"
        />
      </UFormField>
      <UFormField label="Label">
        <UInput
          v-model="display.label"
          placeholder="Total Stars"
        />
      </UFormField>
      <UFormField
        label="Icon"
        hint="e.g. i-heroicons-star"
      >
        <UInput
          v-model="display.icon"
          placeholder="i-heroicons-star"
        />
      </UFormField>
    </div>

    <!-- Table options -->
    <div
      v-if="display.type === 'table'"
      class="space-y-4"
    >
      <UFormField
        label="Data Path"
        hint="Path to array in response"
      >
        <UInput
          v-model="display.dataPath"
          placeholder="data.items"
        />
      </UFormField>
      <p class="text-sm text-neutral-500">
        Column configuration coming soon...
      </p>
    </div>
  </UCard>
</template>

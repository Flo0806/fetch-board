<template>
  <UPageList>
    <UAlert
      v-if="error"
      title="Error!"
      description="Cannot load queries."
      icon="i-lucide-circle-x"
      class="text-white"
      color="error"
      :ui="{
        icon: 'size-11',
      }"
    />
    <template v-else>
      <div
        v-if="pending"
        class="flex items-center gap-4"
      >
        <div class="grid gap-2">
          <USkeleton class="h-4 w-62.5" />
          <USkeleton class="h-4 w-62.5" />
        </div>
      </div>
      <UPageCard
        v-for="(query, index) in queries"
        v-else
        :key="index"
        variant="ghost"
        class="cursor-pointer"
        @click="emits('select-query', query.id)"
      >
        <template #body>
          <UUser
            :name="query.name"
            :description="new Date(query.createdAt).toLocaleString()"
            size="xl"
            class="relative"
          />
        </template>
      </UPageCard>
    </template>
  </UPageList>
</template>

<script setup lang="ts">
const { data: queries, pending, error } = useFetch('/api/queries')

const emits = defineEmits<{
  (e: 'select-query', queryId: string): void
}>()
</script>

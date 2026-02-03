<template>
  <UPageList>
    <UAlert
      v-if="queriesStore.error"
      title="Error!"
      description="Cannot load queries."
      icon="i-lucide-circle-x"
      class="text-white w-full"
      color="error"
      :ui="{
        icon: 'size-11',
      }"
    />
    <template v-else>
      <div
        v-if="queriesStore.loading"
        class="flex items-center gap-4"
      >
        <div class="grid gap-2">
          <USkeleton class="h-4 w-62.5" />
          <USkeleton class="h-4 w-62.5" />
        </div>
      </div>
      <div
        v-for="(query, index) in queries"
        v-else
        :key="index"
        class="flex gap-4 items-center justify-between p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
        @click="emits('select-query', query.id)"
      >
        <div class="flex-1 min-w-0">
          <div class="truncate">
            {{ query.name }}
          </div>
          <div class="text-xs text-neutral-500">
            {{ new Date(query.createdAt).toLocaleString() }}
          </div>
        </div>
        <UButton
          variant="ghost"
          color="neutral"
          size="sm"
          @click.stop="emits('delete-query', query.id)"
        >
          <UIcon
            class="text-red-500 size-5"
            name="i-heroicons-trash"
          />
        </UButton>
      </div>
    </template>
  </UPageList>
</template>

<script setup lang="ts">
// const { data: queries, pending, error } = useFetch('/api/queries')

const queriesStore = useQueriesStore()
const queries = storeToRefs(queriesStore).queries

onMounted(() => {
  queriesStore.fetchQueries()
})
const emits = defineEmits<{
  (e: 'delete-query' | 'select-query', queryId: string): void
}>()
</script>

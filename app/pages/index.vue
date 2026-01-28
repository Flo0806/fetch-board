<script setup lang="ts">
definePageMeta({
  title: 'Dashboard',
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold">
        Dashboard
      </h1>
      <UButton
        icon="i-heroicons-plus"
        to="/builder"
      >
        New Query
      </UButton>
    </div>

    <div class="grid grid-cols-12 gap-4">
      <UCard class="col-span-12 md:col-span-6">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon
              name="i-heroicons-information-circle"
              class="text-primary-500"
            />
            <span class="font-medium">Welcome</span>
          </div>
        </template>
        <p class="text-neutral-600 dark:text-neutral-400">
          Create your first query in the Builder and add it to your dashboard.
        </p>
      </UCard>
    </div>
  </div>
</template>

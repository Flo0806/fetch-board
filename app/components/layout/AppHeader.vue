<script setup lang="ts">
const navigation = [
  { label: 'Dashboard', to: '/', icon: 'i-heroicons-squares-2x2' },
  { label: 'Builder', to: '/builder', icon: 'i-heroicons-wrench-screwdriver' },
]
</script>

<template>
  <header class="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
    <div class="container mx-auto px-4 h-16 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-3">
        <img src="/img/fetch-board-logo.png" alt="Fetch Board" class="h-10 w-10">
        <span class="font-semibold text-lg">Fetch Board</span>
      </NuxtLink>

      <nav class="flex items-center gap-2">
        <UButton
          v-for="item in navigation"
          :key="item.to"
          :to="item.to"
          :icon="item.icon"
          variant="ghost"
          color="neutral"
        >
          {{ item.label }}
        </UButton>
      </nav>
    </div>
  </header>
</template>

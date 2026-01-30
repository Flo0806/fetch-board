<script setup lang="ts">
const headers = defineModel<{ key: string, value: string }[]>({ required: true })

function addHeader() {
  headers.value.push({ key: '', value: '' })
}

function removeHeader(index: number) {
  headers.value.splice(index, 1)
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <span class="font-medium">Headers</span>
        <UButton
          size="xs"
          variant="ghost"
          icon="i-heroicons-plus"
          @click="addHeader"
        >
          Add
        </UButton>
      </div>
    </template>

    <div
      v-if="headers.length === 0"
      class="text-neutral-500 text-sm"
    >
      No headers configured
    </div>

    <div
      v-else
      class="space-y-2"
    >
      <div
        v-for="(header, index) in headers"
        :key="index"
        class="flex gap-2 items-center"
      >
        <UInput
          v-model="header.key"
          placeholder="Key"
          class="flex-1"
        />
        <UInput
          v-model="header.value"
          placeholder="Value"
          class="flex-1"
        />
        <UButton
          size="xs"
          variant="ghost"
          color="error"
          icon="i-heroicons-trash"
          @click="removeHeader(index)"
        />
      </div>
    </div>
  </UCard>
</template>

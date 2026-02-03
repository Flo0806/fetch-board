<script setup lang="ts">
defineProps<{
  title: string
  content?: string
  confirmLabel?: string
  cancelLabel?: string
}>()

const emit = defineEmits<{ close: [boolean] }>()
</script>

<template>
  <UModal
    :close="{ onClick: () => emit('close', false) }"
    :title="title"
  >
    <template #body>
      <p
        v-if="content"
        class="text-muted"
      >
        {{ content }}
      </p>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton
          color="neutral"
          :label="cancelLabel ?? 'Abbrechen'"
          @click="emit('close', false)"
        />
        <UButton
          :label="confirmLabel ?? 'OK'"
          @click="emit('close', true)"
        />
      </div>
    </template>
  </UModal>
</template>

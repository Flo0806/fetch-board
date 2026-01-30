<script setup lang="ts">
const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE']

const name = defineModel<string>('name', { required: true })
const method = defineModel<HttpMethod>('method', { required: true })
const url = defineModel<string>('url', { required: true })
</script>

<template>
  <UCard>
    <template #header>
      <span class="font-medium">Query Settings</span>
    </template>

    <div class="space-y-4">
      <UFormField
        label="Name"
        name="name"
        required
      >
        <UInput
          v-model="name"
          placeholder="My API Query"
          class="w-72"
        />
      </UFormField>

      <div class="flex gap-2">
        <UFormField
          label="Method"
          name="method"
          class="w-32"
          required
        >
          <USelect
            v-model="method"
            :items="methods"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="URL"
          name="url"
          class="flex-1"
          required
        >
          <UInput
            v-model="url"
            class="w-full"
            placeholder="https://api.example.com/data"
          />
        </UFormField>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
const props = defineProps<{
  url: string
  method: HttpMethod
  headers: { key: string, value: string }[]
  body?: string
  transform?: string
}>()

const testLoading = ref(false)
const testResult = ref<unknown>(null)
const testError = ref<string | null>(null)

async function runTest() {
  testLoading.value = true
  testError.value = null
  testResult.value = null

  try {
    const headerObj: Record<string, string> = {}
    props.headers.forEach((h) => {
      if (h.key)
        headerObj[h.key] = h.value
    })

    const res = await $fetch('/api/execute', {
      method: 'POST',
      body: {
        url: props.url,
        method: props.method,
        headers: headerObj,
        body: props.body,
        transform: props.transform,
      },
    })

    testResult.value = res
  }
  catch (err) {
    testError.value = err instanceof Error ? err.message : 'Unknown error'
  }
  finally {
    testLoading.value = false
  }
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <span class="font-medium">Test & Preview</span>
        <UButton
          icon="i-heroicons-play"
          :loading="testLoading"
          :disabled="!url"
          @click="runTest"
        >
          Run
        </UButton>
      </div>
    </template>

    <div
      v-if="testError"
      class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-4 mb-4"
    >
      <p class="text-red-600 dark:text-red-400 text-sm">
        {{ testError }}
      </p>
    </div>

    <div
      v-if="testResult !== null"
      class="bg-neutral-50 dark:bg-neutral-900 rounded p-4 overflow-auto max-h-96"
    >
      <pre class="text-sm"><code>{{ JSON.stringify(testResult, null, 2) }}</code></pre>
    </div>

    <div
      v-else-if="!testLoading"
      class="text-neutral-500 text-sm text-center py-8"
    >
      Click "Run" to test your query
    </div>
  </UCard>
</template>

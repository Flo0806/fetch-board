<script setup lang="ts">
import { VueMonacoEditor } from '@guolao/vue-monaco-editor'
import type { DisplayType, HttpMethod, Query } from '~/types'

definePageMeta({
  title: 'Query Builder',
})

const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE']
const displayTypes: { value: DisplayType, label: string, icon: string }[] = [
  { value: 'card', label: 'Card', icon: 'i-heroicons-square-2-stack' },
  { value: 'table', label: 'Table', icon: 'i-heroicons-table-cells' },
  { value: 'list', label: 'List', icon: 'i-heroicons-list-bullet' },
  { value: 'raw', label: 'Raw JSON', icon: 'i-heroicons-code-bracket' },
]

const transformSnippets = [
  { label: 'Sum field', code: 'response.reduce((sum, item) => sum + item.FIELD, 0)' },
  { label: 'Filter items', code: 'response.filter(item => item.FIELD === VALUE)' },
  { label: 'Map items', code: 'response.map(item => ({ key: item.FIELD }))' },
  { label: 'Count', code: 'response.length' },
  { label: 'First item', code: 'response[0]' },
  { label: 'Pluck field', code: 'response.map(item => item.FIELD)' },
]

// Form state
const query = reactive<Partial<Query>>({
  name: '',
  url: '',
  method: 'GET',
  headers: {},
  body: '',
  transform: '',
  display: {
    type: 'raw',
    value: '',
    label: '',
    icon: '',
    columns: [],
    dataPath: '',
  },
})

// Headers management
const headers = ref<{ key: string, value: string }[]>([])

function addHeader() {
  headers.value.push({ key: '', value: '' })
}

function removeHeader(index: number) {
  headers.value.splice(index, 1)
}

// Test execution
const testLoading = ref(false)
const testResult = ref<unknown>(null)
const testError = ref<string | null>(null)

async function runTest() {
  testLoading.value = true
  testError.value = null
  testResult.value = null

  try {
    // Convert headers array to object
    const headerObj: Record<string, string> = {}
    headers.value.forEach((h) => {
      if (h.key)
        headerObj[h.key] = h.value
    })

    const res = await $fetch('/api/execute', {
      method: 'POST',
      body: {
        url: query.url,
        method: query.method,
        headers: headerObj,
        body: query.body,
        transform: query.transform,
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

// Save query
const saveLoading = ref(false)

async function saveQuery() {
  saveLoading.value = true

  try {
    const headerObj: Record<string, string> = {}
    headers.value.forEach((h) => {
      if (h.key)
        headerObj[h.key] = h.value
    })

    await $fetch('/api/queries', {
      method: 'POST',
      body: {
        ...query,
        headers: headerObj,
      },
    })

    navigateTo('/')
  }
  catch (err) {
    console.error('Failed to save query:', err)
  }
  finally {
    saveLoading.value = false
  }
}

// Insert snippet
function insertSnippet(code: string) {
  query.transform = code
}

// Monaco editor options
const editorOptions = {
  minimap: { enabled: false },
  fontSize: 14,
  lineNumbers: 'off' as const,
  scrollBeyondLastLine: false,
  wordWrap: 'on' as const,
  automaticLayout: true,
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold">
        Query Builder
      </h1>
      <div class="flex gap-2">
        <UButton
          variant="ghost"
          color="neutral"
          to="/"
        >
          Cancel
        </UButton>
        <UButton
          icon="i-heroicons-check"
          :loading="saveLoading"
          @click="saveQuery"
        >
          Save Query
        </UButton>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-6">
      <!-- Left: Query Configuration -->
      <div class="col-span-12 lg:col-span-7 space-y-6">
        <!-- Basic Info -->
        <UCard>
          <template #header>
            <span class="font-medium">Query Settings</span>
          </template>

          <div class="space-y-4">
            <UFormField label="Name">
              <UInput
                v-model="query.name"
                placeholder="My API Query"
              />
            </UFormField>

            <div class="flex gap-2">
              <UFormField label="Method" class="w-32">
                <USelect
                  v-model="query.method"
                  :items="methods"
                />
              </UFormField>

              <UFormField label="URL" class="flex-1">
                <UInput
                  v-model="query.url"
                  placeholder="https://api.example.com/data"
                />
              </UFormField>
            </div>
          </div>
        </UCard>

        <!-- Headers -->
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

          <div v-if="headers.length === 0" class="text-neutral-500 text-sm">
            No headers configured
          </div>

          <div v-else class="space-y-2">
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

        <!-- Body (for POST/PUT) -->
        <UCard v-if="query.method === 'POST' || query.method === 'PUT'">
          <template #header>
            <span class="font-medium">Request Body</span>
          </template>

          <ClientOnly>
            <div class="border border-neutral-200 dark:border-neutral-800 rounded overflow-hidden" style="height: 160px;">
              <VueMonacoEditor
                v-model:value="query.body"
                language="json"
                :options="editorOptions"
              />
            </div>
          </ClientOnly>
        </UCard>

        <!-- Transform -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-medium">Transform (optional)</span>
              <UDropdownMenu
                :items="transformSnippets.map(s => ({ label: s.label, click: () => insertSnippet(s.code) }))"
              >
                <UButton
                  size="xs"
                  variant="ghost"
                  trailing-icon="i-heroicons-chevron-down"
                >
                  Snippets
                </UButton>
              </UDropdownMenu>
            </div>
          </template>

          <p class="text-sm text-neutral-500 mb-3">
            JavaScript expression to transform the response. Use <code class="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">response</code> as input.
          </p>

          <ClientOnly>
            <div class="border border-neutral-200 dark:border-neutral-800 rounded overflow-hidden" style="height: 128px;">
              <VueMonacoEditor
                v-model:value="query.transform"
                language="javascript"
                :options="editorOptions"
              />
            </div>
          </ClientOnly>
        </UCard>

        <!-- Display Config -->
        <UCard>
          <template #header>
            <span class="font-medium">Display Type</span>
          </template>

          <div class="flex gap-2 mb-4">
            <UButton
              v-for="dt in displayTypes"
              :key="dt.value"
              :icon="dt.icon"
              :variant="query.display?.type === dt.value ? 'solid' : 'outline'"
              :color="query.display?.type === dt.value ? 'primary' : 'neutral'"
              @click="query.display!.type = dt.value"
            >
              {{ dt.label }}
            </UButton>
          </div>

          <!-- Card options -->
          <div v-if="query.display?.type === 'card'" class="space-y-4">
            <UFormField label="Value Path" hint="e.g. stargazers_count or data.total">
              <UInput
                v-model="query.display.value"
                placeholder="response.field"
              />
            </UFormField>
            <UFormField label="Label">
              <UInput
                v-model="query.display.label"
                placeholder="Total Stars"
              />
            </UFormField>
            <UFormField label="Icon" hint="e.g. i-heroicons-star">
              <UInput
                v-model="query.display.icon"
                placeholder="i-heroicons-star"
              />
            </UFormField>
          </div>

          <!-- Table options -->
          <div v-if="query.display?.type === 'table'" class="space-y-4">
            <UFormField label="Data Path" hint="Path to array in response">
              <UInput
                v-model="query.display.dataPath"
                placeholder="data.items"
              />
            </UFormField>
            <p class="text-sm text-neutral-500">
              Column configuration coming soon...
            </p>
          </div>
        </UCard>
      </div>

      <!-- Right: Test & Preview -->
      <div class="col-span-12 lg:col-span-5 space-y-6">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-medium">Test & Preview</span>
              <UButton
                icon="i-heroicons-play"
                :loading="testLoading"
                :disabled="!query.url"
                @click="runTest"
              >
                Run
              </UButton>
            </div>
          </template>

          <div v-if="testError" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-4 mb-4">
            <p class="text-red-600 dark:text-red-400 text-sm">
              {{ testError }}
            </p>
          </div>

          <div v-if="testResult !== null" class="bg-neutral-50 dark:bg-neutral-900 rounded p-4 overflow-auto max-h-96">
            <pre class="text-sm"><code>{{ JSON.stringify(testResult, null, 2) }}</code></pre>
          </div>

          <div v-else-if="!testLoading" class="text-neutral-500 text-sm text-center py-8">
            Click "Run" to test your query
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import ConfirmDialog from '~/components/dialogs/ConfirmDialog.vue'

definePageMeta({
  title: 'Query Builder',
})

const queriesStore = useQueriesStore()

const overlay = useOverlay()
const confirmDialog = overlay.create(ConfirmDialog)

// Validation schema
const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  url: z.url('Must be a valid URL'),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE']),
})

type Schema = z.output<typeof schema>

// Check if form is valid
const isValid = computed(() => {
  const result = schema.safeParse(state)
  return result.success
})

// Form state type (non-partial since we always have defaults)
interface QueryFormState {
  name: string
  url: string
  method: HttpMethod
  headers: Record<string, string>
  body: string
  transform: string
  display: DisplayConfig
}

// Initial state for dirty checking
const initialState = (): QueryFormState => ({
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

// Form state
const state = reactive<QueryFormState>(initialState())

// Track loaded query ID and snapshot for dirty checking
const loadedQueryId = ref<string | null>(null)
const savedSnapshot = ref<string>('')

// Headers management
const headers = ref<{ key: string, value: string }[]>([])

// Check if form has unsaved changes
const isDirty = computed(() => {
  if (!loadedQueryId.value) return false
  const current = JSON.stringify({ ...state, headers: headers.value })
  return current !== savedSnapshot.value
})

// Save query
const saveLoading = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  saveLoading.value = true

  try {
    const headerObj: Record<string, string> = {}
    headers.value.forEach((h) => {
      if (h.key)
        headerObj[h.key] = h.value
    })

    if (loadedQueryId.value) {
      // Update existing query
      await queriesStore.updateQuery(loadedQueryId.value, {
        ...event.data,
        headers: headerObj,
        body: state.body,
        transform: state.transform,
        display: state.display,
      })

      return
    }
    // Create new query
    const result = await queriesStore.createQuery({
      ...event.data,
      headers: headerObj,
      body: state.body,
      transform: state.transform,
      display: state.display,
    })

    if (result)
      navigateTo('/')
  }
  catch (err) {
    console.error('Failed to save query:', err)
  }
  finally {
    saveLoading.value = false
  }
}

// --------------------------------------------
// Methods
// --------------------------------------------
function loadQueryData(query: Query) {
  state.name = query.name
  state.url = query.url
  state.method = query.method
  state.body = query.body || ''
  state.transform = query.transform || ''
  state.display = query.display || {
    type: 'raw',
    value: '',
    label: '',
    icon: '',
    columns: [],
    dataPath: '',
  }

  // Load headers into array
  headers.value = []
  if (query.headers) {
    for (const [key, value] of Object.entries(query.headers)) {
      headers.value.push({ key, value })
    }
  }

  // Save snapshot for dirty checking
  loadedQueryId.value = query.id
  savedSnapshot.value = JSON.stringify({ ...state, headers: headers.value })
}

async function onSelectQuery(queryId: string) {
  // Check if current data is dirty
  if (isDirty.value) {
    const confirmed = await confirmDialog.open({
      title: 'Unsaved Changes',
      content: 'You have unsaved changes. Do you really want to load new data?',
      confirmLabel: 'Load',
      cancelLabel: 'Cancel',
    })

    if (!confirmed) return
  }

  // Load query details
  const query = await queriesStore.getQueryById(queryId)
  if (query)
    loadQueryData(query)
}

async function onDeleteQuery(queryId: string) {
  const confirmed = await confirmDialog.open({
    title: 'Delete Query',
    content: 'Are you sure you want to delete this query?',
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel',
  })

  if (!confirmed) return

  if (!(await queriesStore.deleteQuery(queryId)))
    return

  // Reset state to defaults
  Object.assign(state, initialState())
  headers.value = []
  loadedQueryId.value = null
  savedSnapshot.value = ''
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <UForm
      :schema="schema"
      :state="state"
      @submit="onSubmit"
    >
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
            type="submit"
            icon="i-heroicons-check"
            :loading="saveLoading"
            :disabled="!isValid"
          >
            Save Query
          </UButton>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-6">
        <!-- Left: Query Configuration -->
        <div class="col-span-12 lg:col-span-7 space-y-6">
          <!-- Load component -->
          <UCard>
            <template #header>
              <span class="font-medium">Existing Queries</span>
            </template>
            <div class="space-y-4">
              <QueriesLoadQueriesOverview
                @select-query="onSelectQuery"
                @delete-query="onDeleteQuery"
              />
            </div>
          </UCard>

          <!-- Query Settings -->
          <BuilderQuerySettingsCard
            v-model:name="state.name"
            v-model:method="state.method"
            v-model:url="state.url"
          />

          <!-- Headers -->
          <BuilderHeadersCard v-model="headers" />

          <!-- Body (for POST/PUT) -->
          <BuilderRequestBodyCard
            v-if="state.method === 'POST' || state.method === 'PUT'"
            v-model="state.body"
          />

          <!-- Transform -->
          <BuilderTransformCard v-model="state.transform" />

          <!-- Display Config -->
          <BuilderDisplayTypeCard v-model="state.display" />
        </div>

        <!-- Right: Test & Preview -->
        <div class="col-span-12 lg:col-span-5 space-y-6">
          <BuilderTestPreviewCard
            :url="state.url"
            :method="state.method"
            :headers="headers"
            :body="state.body"
            :transform="state.transform"
          />
        </div>
      </div>
    </UForm>
  </div>
</template>

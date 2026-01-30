<script setup lang="ts">
import { VueMonacoEditor } from '@guolao/vue-monaco-editor'

const transform = defineModel<string>({ required: true })

const transformSnippets = [
  { label: 'Sum field', code: 'response.reduce((sum, item) => sum + item.FIELD, 0)' },
  { label: 'Filter items', code: 'response.filter(item => item.FIELD === VALUE)' },
  { label: 'Map items', code: 'response.map(item => ({ key: item.FIELD }))' },
  { label: 'Count', code: 'response.length' },
  { label: 'First item', code: 'response[0]' },
  { label: 'Pluck field', code: 'response.map(item => item.FIELD)' },
]

function insertSnippet(code: string) {
  transform.value = code
}

const colorMode = useColorMode()
const editorTheme = computed(() =>
  colorMode.value === 'dark' ? 'fetch-board-dark' : 'fetch-board-light',
)

const editorOptions = {
  minimap: { enabled: false },
  fontSize: 13,
  lineNumbers: 'on' as const,
  lineNumbersMinChars: 3,
  scrollBeyondLastLine: false,
  wordWrap: 'on' as const,
  automaticLayout: true,
  folding: false,
  glyphMargin: false,
  lineDecorationsWidth: 8,
  renderLineHighlight: 'line' as const,
  fixedOverflowWidgets: true,
  scrollbar: {
    verticalScrollbarSize: 8,
    horizontalScrollbarSize: 8,
  },
  padding: { top: 8, bottom: 8 },
  overviewRulerBorder: false,
  hideCursorInOverviewRuler: true,
}
</script>

<template>
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
      <div
        class="border border-neutral-200 dark:border-neutral-800 rounded overflow-hidden"
        style="height: 128px;"
      >
        <VueMonacoEditor
          v-model:value="transform"
          language="javascript"
          :theme="editorTheme"
          :options="editorOptions"
        />
      </div>
    </ClientOnly>
  </UCard>
</template>

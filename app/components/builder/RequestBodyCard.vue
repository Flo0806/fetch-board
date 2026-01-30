<script setup lang="ts">
import { VueMonacoEditor } from '@guolao/vue-monaco-editor'

const body = defineModel<string>({ required: true })

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
      <span class="font-medium">Request Body</span>
    </template>

    <ClientOnly>
      <div
        class="border border-neutral-200 dark:border-neutral-800 rounded overflow-hidden"
        style="height: 160px;"
      >
        <VueMonacoEditor
          v-model:value="body"
          language="json"
          :theme="editorTheme"
          :options="editorOptions"
        />
      </div>
    </ClientOnly>
  </UCard>
</template>

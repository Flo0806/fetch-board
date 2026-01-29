import { loader } from '@guolao/vue-monaco-editor'

export default defineNuxtPlugin(() => {
  loader.config({
    paths: {
      vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.0/min/vs',
    },
  })

  loader.init().then((monaco) => {
    // Access JS defaults (cast to any to avoid deprecated API warnings)
    const tsNamespace = monaco.languages.typescript
    const jsDefaults = tsNamespace.javascriptDefaults
    const ScriptTarget = tsNamespace.ScriptTarget

    jsDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    })

    jsDefaults.setCompilerOptions({
      target: ScriptTarget.ESNext,
      allowNonTsExtensions: true,
      allowJs: true,
      checkJs: true,
      strict: false,
    })

    // Define 'response' as a global variable
    jsDefaults.addExtraLib(`
      /** The API response data - can be any type depending on the endpoint */
      declare const response: any;
    `, 'ts:response.d.ts')

    // Dark theme matching Nuxt UI
    monaco.editor.defineTheme('fetch-board-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6b7280', fontStyle: 'italic' },
        { token: 'keyword', foreground: '22d3ee' },
        { token: 'string', foreground: '4ade80' },
        { token: 'number', foreground: 'fb923c' },
        { token: 'type', foreground: 'a78bfa' },
      ],
      colors: {
        'editor.background': '#171717',
        'editor.foreground': '#f5f5f5',
        'editor.lineHighlightBackground': '#262626',
        'editor.selectionBackground': '#0891b240',
        'editorCursor.foreground': '#22d3ee',
        'editorLineNumber.foreground': '#525252',
        'editorLineNumber.activeForeground': '#22d3ee',
        'editor.inactiveSelectionBackground': '#26262680',
        'editorIndentGuide.background': '#262626',
        'editorIndentGuide.activeBackground': '#404040',
      },
    })

    // Light theme matching Nuxt UI
    monaco.editor.defineTheme('fetch-board-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6b7280', fontStyle: 'italic' },
        { token: 'keyword', foreground: '0891b2' },
        { token: 'string', foreground: '16a34a' },
        { token: 'number', foreground: 'ea580c' },
        { token: 'type', foreground: '7c3aed' },
      ],
      colors: {
        'editor.background': '#fafafa',
        'editor.foreground': '#171717',
        'editor.lineHighlightBackground': '#f5f5f5',
        'editor.selectionBackground': '#22d3ee40',
        'editorCursor.foreground': '#0891b2',
        'editorLineNumber.foreground': '#a3a3a3',
        'editorLineNumber.activeForeground': '#0891b2',
        'editor.inactiveSelectionBackground': '#e5e5e580',
        'editorIndentGuide.background': '#e5e5e5',
        'editorIndentGuide.activeBackground': '#d4d4d4',
      },
    })
  })
})

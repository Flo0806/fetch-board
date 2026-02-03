import type { DisplayType } from './queries.js'

export interface DisplayConfig {
  type: DisplayType
  // Card options
  value?: string
  label?: string
  icon?: string
  // Table options
  columns?: { key: string, label: string }[]
  dataPath?: string
  // List options
  itemPath?: string
  itemTemplate?: string
}

export interface WidgetField {
  key: string
  value: string
  isPath: boolean
}

export interface DashboardWidget {
  id: string
  type: 'card' | 'table' | 'list' | 'raw'
  size: 6 | 12
  position: number
  fields: WidgetField[]
}

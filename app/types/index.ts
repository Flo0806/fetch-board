export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export type DisplayType = 'card' | 'table' | 'list' | 'raw'

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

export interface Query {
  id: string
  name: string
  url: string
  method: HttpMethod
  headers?: Record<string, string>
  body?: string
  transform?: string
  display: DisplayConfig
  createdAt: string
  updatedAt: string
}

export interface DashboardWidget {
  id: string
  queryId: string
  size: 6 | 12
  order: number
}

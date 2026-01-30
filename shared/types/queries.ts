import type { DisplayConfig } from './config.js'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export type DisplayType = 'card' | 'table' | 'list' | 'raw'

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

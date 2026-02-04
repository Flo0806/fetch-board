import type { FreeformItemData } from 'nuxt-freeform'

export interface CardItem extends FreeformItemData {
  itemType: 'card'
  cols: 6 | 12
  controls: ControlItem[]
}

export interface ControlItem extends FreeformItemData {
  itemType: 'control'
  controlType: 'text' | 'image'
  labelText?: string
  labelValue?: string
}

export type DashboardItem = CardItem | ControlItem

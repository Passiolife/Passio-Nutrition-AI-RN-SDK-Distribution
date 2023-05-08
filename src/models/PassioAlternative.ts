import type { PassioID } from '.'

/**
 * A food item that is a close relative and possible alternative for another food item
 */
export interface PassioAlternative {
  passioID: PassioID
  name: string
  quantity?: number
  unitName?: string
}

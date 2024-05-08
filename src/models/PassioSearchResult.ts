// Importing type PassioID from './PassioID'
import type { PassioFoodDataInfo } from '.'

// Interface representing the structure of a Passio search result
export interface PassioSearchResult {
  // Property for an array of PassioFoodDataInfo array or null
  results: PassioFoodDataInfo[] | null
  // Property for an array of alternative strings or null
  alternatives?: string[] | null
}

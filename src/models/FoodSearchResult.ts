import type { PassioID } from './PassioID'

/**
 *  A the passioID and name for a food search result.
 */
export interface FoodSearchResult {
  // The ID of an item in the nutrition database.
  passioID: PassioID
  // The name of the item
  name: string
}

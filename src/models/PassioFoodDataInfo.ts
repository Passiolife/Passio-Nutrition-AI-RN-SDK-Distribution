import type { PassioNutritionPreview } from '.'
import type { PassioID } from './PassioID'

export interface PassioFoodDataInfo {
  // Property for the brand name of the food
  brandName?: string
  // Property for the name of the food
  foodName: string
  // Property for the icon ID of the food
  iconID: PassioID | string
  // Property for the label ID of the food
  labelId: string
  // Property for the nutrition preview of the food
  nutritionPreview?: PassioNutritionPreview
  // Property for the result ID of the food
  resultId: string
  // Property for the score of the food
  score?: number
  // Property for the scored name of the food
  scoredName?: string
  // Property for the type of the food
  type?: string
  // Property for indicating whether to use short name for the info
  isShortName?: boolean
}

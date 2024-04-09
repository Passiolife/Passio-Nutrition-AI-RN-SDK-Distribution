// Importing type PassioID from './PassioID'
import type { PassioID } from './PassioID'

// Interface representing the structure of a food search result
export interface FoodSearchResult {
  // Property for the brand name of the food
  brandName?: string
  // Property for the name of the food
  foodName: string
  // Property for the icon ID of the food
  iconID: PassioID | string
  // Property for the label ID of the food
  labelId: string
  // Property for the nutrition preview of the food
  nutritionPreview?: PassioSearchNutritionPreview
  // Property for the result ID of the food
  resultId: string
  // Property for the score of the food
  score?: number
  // Property for the scored name of the food
  scoredName?: string
  // Property for the type of the food
  type?: string
}

// Interface representing the nutrition preview of a food search result
export interface PassioSearchNutritionPreview {
  // Property for the calories of the food
  calories: number
  // Property for the serving quantity of the food
  servingQuantity?: number
  // Property for the serving unit of the food
  servingUnit?: string
  // Property for the serving weight of the food
  servingWeight?: string
  // Property for the carbs of the food
  carbs: number
  // Property for the protein of the food
  protein: number
  // Property for the fat of the food
  fat: number
}

// Interface representing the structure of a Passio search result
export interface PassioSearchResult {
  // Property for an array of FoodSearchResult objects or null
  results: FoodSearchResult[] | null
  // Property for an array of alternative strings or null
  alternatives?: string[] | null
}

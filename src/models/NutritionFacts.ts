import type { ServingSizeUnit } from '.'

/**
 * Nutrition facts scanned from the nutrition label on a package food item
 */
export interface NutritionFacts {
  servingSizeQuantity?: number
  servingSizeUnitName?: string
  servingSizeGram?: number
  servingSizeUnit: ServingSizeUnit
  calories?: number
  fat?: number
  carbs?: number
  protein?: number
  saturatedFat?: number
  transFat?: number
  cholesterol?: number
  sodium?: number
  dietaryFiber?: number
  sugars?: number
  sugarAlcohol?: number
}

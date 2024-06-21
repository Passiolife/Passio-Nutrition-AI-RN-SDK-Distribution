import type { ServingSizeUnit } from '.'

/**
 * Nutrition facts scanned from the nutrition label on a package food item
 */
export interface NutritionFacts {
  servingSizeQuantity?: number
  servingSizeUnitName?: string
  servingSizeUnit: ServingSizeUnit
  calories?: number
  fat?: number
  carbs?: number
  protein?: number
  saturatedFat?: number
  transFat?: number
  cholesterol?: number
  sugars?: number
  sugarAlcohol?: number
  servingSizeGram?: number
  dietaryFiber?: number
  sodium?: number
}

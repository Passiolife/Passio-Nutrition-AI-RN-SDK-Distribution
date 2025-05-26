import type { PassioFoodDataInfo } from '.'
import type { PassioGeneratedMealPlanMacros } from '.'

export interface PassioGeneratedMealPlanRecipe {
  name?: string
  preparation?: string
  macros: PassioGeneratedMealPlanMacros
  ingredients: PassioFoodDataInfo[]
}

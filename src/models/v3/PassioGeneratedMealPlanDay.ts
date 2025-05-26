import type { PassioGeneratedMealPlanMacros } from '.'
import type { PassioGeneratedMealPlanRecipe } from '.'

export interface PassioGeneratedMealPlanDay {
  macros: PassioGeneratedMealPlanMacros
  breakfast: PassioGeneratedMealPlanRecipe[]
  lunch: PassioGeneratedMealPlanRecipe[]
  dinner: PassioGeneratedMealPlanRecipe[]
  snack: PassioGeneratedMealPlanRecipe[]
}

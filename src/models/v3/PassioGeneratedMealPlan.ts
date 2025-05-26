import type { PassioGeneratedMealPlanConstraints } from '.'
import type { PassioGeneratedMealPlanDay } from '.'
import type { PassioGeneratedMealPlanShoppingItem } from '.'

export type PassioGeneratedMealPlanError = {
  status: 'Error'
  message: string
}

export type PassioGeneratedMealPlanSuccess = {
  status: 'Success'
  response: PassioGeneratedMealPlan
}

export type PassioGeneratedMealPlanResult =
  | PassioGeneratedMealPlanError
  | PassioGeneratedMealPlanSuccess

export interface PassioGeneratedMealPlan {
  shoppingList: PassioGeneratedMealPlanShoppingItem[]
  mealPlanDays: PassioGeneratedMealPlanDay[]
  constraints?: PassioGeneratedMealPlanConstraints
}

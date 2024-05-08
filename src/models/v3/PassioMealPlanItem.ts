import type { PassioFoodDataInfo } from '../PassioFoodDataInfo'
import type { PassioMealTime } from './MealTime'

export interface PassioMealPlanItem {
  dayNumber: number
  dayTitle: string
  mealTime: PassioMealTime
  meal: PassioFoodDataInfo
}

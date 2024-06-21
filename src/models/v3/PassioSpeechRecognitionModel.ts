import type { PassioMealTime } from './MealTime'
import type { PassioAdvisorFoodInfo } from './PassioAdvisorFoodInfo'
import type { PassioLogAction } from './PassioLogAction'

export interface PassioSpeechRecognitionModel {
  date: string
  mealTime?: PassioMealTime
  action?: PassioLogAction
  advisorInfo: PassioAdvisorFoodInfo
}

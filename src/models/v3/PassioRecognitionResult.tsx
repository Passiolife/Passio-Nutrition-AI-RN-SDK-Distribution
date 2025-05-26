import type {
  PassioFoodItem,
  PassioFoodResultType,
  PassioLogAction,
  PassioMealTime,
} from '.'

export type PassioRecognitionResultError = {
  status: 'Error'
  message: string
}

export type PassioRecognitionResultSuccess = {
  status: 'Success'
  response: PassioRecognition
}

export type PassioRecognitionResult =
  | PassioRecognitionResultError
  | PassioRecognitionResultSuccess

export interface PassioRecognitionItem {
  date: string
  action?: PassioLogAction
  mealTime?: PassioMealTime
  resultType: PassioFoodResultType
  foodItem: PassioFoodItem
}

export interface PassioRecognition {
  mealName: string
  items: PassioRecognitionItem[]
}

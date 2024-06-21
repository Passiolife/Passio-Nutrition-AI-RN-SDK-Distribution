import type { PassioFoodDataInfo } from '../PassioFoodDataInfo'

export interface PassioAdvisorFoodInfo {
  portionSize: string
  weightGrams: number
  recognisedName: string
  foodDataInfo?: PassioFoodDataInfo
}

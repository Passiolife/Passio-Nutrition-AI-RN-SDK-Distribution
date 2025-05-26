import type { PassioFoodDataInfo } from '../PassioFoodDataInfo'
import type { PassioFoodItem } from './PassioFoodItem'
import type { PassioFoodResultType } from './PassioFoodResultType'

export interface PassioAdvisorFoodInfo {
  portionSize: string
  weightGrams: number
  recognisedName: string
  foodDataInfo?: PassioFoodDataInfo
  productCode?: string
  packagedFoodItem?: PassioFoodItem
  resultType: PassioFoodResultType
}

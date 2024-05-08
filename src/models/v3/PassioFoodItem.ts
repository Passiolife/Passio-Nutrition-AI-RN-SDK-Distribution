import type { PassioID } from '../PassioID'
import type { UnitMass } from '..'
import type { PassioFoodAmount } from './PassioFoodAmount'
import type { PassioIngredient } from './PassioIngredient'
import type { RefCode } from '../RefCode'

export interface PassioFoodItem {
  // Reference code of Passio food item
  refCode?: RefCode

  // Name of the food item
  name: string

  // Additional details or description of the food item
  details?: string

  // Icon identifier for the food item
  iconId: PassioID | string

  // Amount of the food item (e.g., quantity, volume)
  amount: PassioFoodAmount

  // List of ingredients used in the food item
  ingredients?: PassioIngredient[]

  // Weight of the food item, measured in units of mass
  weight: UnitMass

  /**
   * food item credits to openfood.org when the data is coming from them
   */
  isOpenFood?: boolean

  /**
   * food item credits to openfood.org when the data is coming from them
   * Show food license name
   */
  openFoodLicense?: string

  id: string
}

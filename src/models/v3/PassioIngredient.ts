import type { PassioID, UnitMass } from '..'
import type { PassioFoodAmount } from './PassioFoodAmount'
import type { PassioFoodMetadata } from './PassioFoodMetadata'
import type { PassioNutrients } from './PassioNutrients'

export interface PassioIngredient {
  /** The name of the ingredient. */
  name: string
  /** The unique identifier of the ingredient. */
  id: PassioID
  /** The identifier of the icon associated with the ingredient. */
  iconId: PassioID | string
  /** The weight of the ingredient. */
  weight: UnitMass
  /** The reference nutrients of the ingredient. */
  referenceNutrients: PassioNutrients
  /** The metadata associated with the ingredient. */
  metadata?: PassioFoodMetadata
  /** The amount of the ingredient. */
  amount: PassioFoodAmount
}

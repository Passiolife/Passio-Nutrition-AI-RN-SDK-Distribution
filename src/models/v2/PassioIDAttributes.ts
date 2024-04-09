import type { PassioID, PassioIDEntityType } from '..'
import type { PassioAlternative } from './PassioAlternative'
import type { PassioFoodItem } from './PassioFoodItem'
import type { PassioRecipe } from './PassioRecipe'

/**
 * Information associated with an item in the nutritional database.
 * Check the `entityType` field to determine the type of the item.
 */
export interface PassioIDAttributes {
  /**
   * The ID of the item in the database
   */
  passioID: PassioID

  /**
   * The name of the item
   */
  name: string

  /**
   * The name of the image for this item. Provide this value to a `PassioIconView`
   * in order to display the image.
   */
  imageName: string

  /**
   * The entity type of the item
   */
  entityType: PassioIDEntityType

  /**
   * The nutritional data for this item in the database
   */
  foodItem?: PassioFoodItem

  /**
   * The recipe data for this item in the database
   */
  recipe?: PassioRecipe

  /**
   * Related items above this item in the food heirarchy (more generic)
   */
  parents: PassioAlternative[]

  /**
   * Related items below this item in the food heirarchy (more specific)
   */
  children: PassioAlternative[]

  /**
   * Related items at the same level as this item in the food heirarchy
   */
  siblings: PassioAlternative[]

  /**
   * food item credits to openfood.org when the data is coming from them
   */
  isOpenFood: boolean
}

import type { PassioID, ServingSize, ServingUnit } from '..'
import type { PassioFoodItem } from './PassioFoodItem'

/*
 * A food recipe from the nutrition database.
 */
export interface PassioRecipe {
  /**
   * The ID of the recipe in the database
   */
  passioID: PassioID

  /**
   * The name of the recipe
   */
  name: string

  /**
   * The name of the image for this recipe. Provide this value to a
   * `PassioIconView` in order to display the image.
   */
  imageName: string

  /**
   * The serving sizes available for this recipe
   */
  servingSizes: ServingSize[]

  /**
   * The serving units available for this recipe
   */
  servingUnits: ServingUnit[]

  /**
   * The default serving unit
   */
  selectedUnit: string

  /**
   * The default serving quantity
   */
  selectedQuantity: number

  /**
   * The food items in this recipe
   */
  foodItems: PassioFoodItem[]
}

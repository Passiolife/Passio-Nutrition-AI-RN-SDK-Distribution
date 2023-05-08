import type {
  Measurement,
  PassioAlternative,
  PassioID,
  PassioIDEntityType,
  ServingSize,
  ServingUnit,
  UnitMass,
} from '.'

/**
 * Nutritional information for an item in the food database.
 */
export interface PassioFoodItem {
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
   * The default serving quantity
   */
  selectedQuantity: number

  /**
   * The default serving unit
   */
  selectedUnit: string

  /**
   * The entity type of the item
   */
  entityType: PassioIDEntityType

  /**
   * The serving units available for this recipe
   */
  servingUnits: ServingUnit[]

  /**
   * The serving sizes available for this recipe
   */
  servingSizes: ServingSize[]

  /**
   * The mass of the serving size, in grams
   */
  computedWeight: Measurement

  /**
   * Related items above this item in the food heirarchy (more generic)
   */
  parents?: PassioAlternative[]

  /**
   * Related items below this item in the food heirarchy (more specific)
   */
  children?: PassioAlternative[]

  /**
   * Related items at the same level as this item in the food heirarchy
   */
  siblings?: PassioAlternative[]

  /**
   * Calories, in kcal
   */
  calories?: UnitMass

  /**
   * Carbohydrates, in grams
   */
  carbs?: UnitMass

  /**
   * Fat, in grams
   */
  fat?: UnitMass

  /**
   * Protein, in grams
   */
  protein?: UnitMass

  /**
   * Saturated fat, in grams
   */
  saturatedFat?: UnitMass

  /**
   * Transfat, in grams
   */
  transFat?: UnitMass

  /**
   * Monounsaturated fat, in grams
   */
  monounsaturatedFat?: ServingUnit

  /**
   * Polyunsaturated fat, in grams
   */
  polyunsaturatedFat?: UnitMass

  /**
   * Cholesterol, in milligrams
   */
  cholesterol?: UnitMass

  /**
   * Sodium, in milligrams
   */
  sodium?: UnitMass

  /**
   * Dietary fiber, in grams
   */
  fiber?: UnitMass

  /**
   * Total sugars, in grams
   */
  sugar?: UnitMass

  /**
   * Added sugar, in grams
   */
  sugarAdded?: UnitMass

  /**
   * Vitamin D, in milligrams
   */
  vitaminD?: UnitMass

  /**
   * Calcium, in milligrams
   */
  calcium?: UnitMass

  /**
   * Iron, in milligrams
   */
  iron?: UnitMass

  /**
   * Potassium, in milligrams
   */
  potassium?: UnitMass

  /**
   * Vitamin A, in IU
   */
  vitaminA?: number

  /**
   * Vitamin C, in milligrams
   */
  vitaminC?: UnitMass

  /**
   * Alcohol, in grams
   */
  alcohol?: UnitMass

  /**
   * Sugar alcohol, in grams
   */
  sugarAlcohol?: UnitMass

  /**
   * Vitamin B12, in micrograms
   */
  vitaminB12?: UnitMass

  /**
   * Added Vitamin B12, in micrograms
   */
  vitaminB12Added?: UnitMass

  /**
   * Vitamin B6, in milligrams
   */
  vitaminB6?: UnitMass

  /**
   * Vitamin E, in milligrams
   */
  vitaminE?: UnitMass

  /**
   * Added Vitamin E, in milligrams
   */
  vitaminEAdded?: UnitMass

  /**
   * Magnesium, in milligrams
   */
  magnesium?: ServingUnit

  /**
   * Phosphorus, in milligrams
   */
  phosphorus?: UnitMass

  /**
   * Iodine, in micrograms
   */
  iodine?: UnitMass

  /**
   * The ingredients listed on the product packaging, if any
   */
  ingredientsDescription?: string

  /**
   * The UPC code for this food product, if available
   */
  barcode?: string
}

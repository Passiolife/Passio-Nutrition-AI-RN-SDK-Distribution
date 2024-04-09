export interface PassioNutrient {
  // The name of the nutrient.
  nutrient: string

  // The amount of the nutrient, measured in a specific unit.
  amount?: number

  // The unit in which the nutrient amount is measured (e.g., grams, milligrams).
  unit: string

  // The inflammatory effect score associated with the nutrient.
  inflammatoryEffectScore?: number
}

/*
 * The unit measuring the serving size of a food item
 */
export interface ServingUnit {
  // The name of a serving unit (e.g. ounce, slice, container)
  unitName: string
  // The mass of a serving unit in grams (1 container = 60g)
  value: number
  unit: string
}

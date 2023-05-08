/*
 * The unit measuring the serving size of a food item
 */
export interface UnitMass {
  // The name of a unit (e.g. ounce, slice, container)
  unit: string
  // The mass of a  unit in grams (1 container = 60g)
  value: number
}

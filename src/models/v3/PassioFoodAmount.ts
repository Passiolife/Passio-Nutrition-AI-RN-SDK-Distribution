import type { ServingSize, ServingUnit, UnitMass } from '..'

export interface PassioFoodAmount {
  /** The selected unit for the food amount. */
  selectedUnit: string
  /** The quantity of the selected unit. */
  selectedQuantity: number
  /** The weight of the food amount in grams. */
  weightGrams?: number
  /** An array of serving units available for the food. */
  servingUnits?: ServingUnit[]
  /** An array of serving sizes available for the food. */
  servingSizes?: ServingSize[]
  /** The weight of the food amount using a specified unit of mass. */
  weight: UnitMass
}

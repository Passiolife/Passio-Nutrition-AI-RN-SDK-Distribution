import type { ServingUnit } from '../ServingUnit'
import type { UnitMass } from '../UnitMass'
import type { PassioIngredient } from './PassioIngredient'

export type UnitType =
  | 'kg'
  | 'g'
  | 'mg'
  | 'µg'
  | 'kCal'
  | 'kcal'
  | 'dag'
  | 'dg'
  | 'cg'
  | 'ml'
  | 'kj'
  | 'oz'
  | 'iu'
  | 'IU'

export const DEFAULT_UNIT_MASS: UnitMass = {
  unit: 'g',
  value: 0,
}

export const unitConverter = {
  ['kCal']: 1.0,
  ['kcal']: 1.0,
  ['dag']: 0.01,
  ['kg']: 1.0,
  ['g']: 0.001,
  ['dg']: 0.0001,
  ['cg']: 0.00001,
  ['mg']: 0.000001,
  ['ug']: 0.000000001,
  ['µg']: 0.000000001,
  ['ml']: 0.001,
  ['kj']: 0.239006,
  ['IU']: 0.239006,
  ['iu']: 0.239006,
  ['oz']: 0.035274,
}

export const convertValueIntoGram = (mass?: UnitMass) => {
  if (mass?.value === undefined) {
    return 0
  }
  const value = unitConverter[(mass?.unit ?? 'g') as UnitType] * 1000
  return mass.value * value
}

export const servingWeight = (item: PassioIngredient): UnitMass => {
  let serving = item.amount.servingUnits?.find(
    (unit) => unit.unitName === item.amount.selectedUnit
  )
  let weight: UnitMass = serving
    ? {
        unit: serving.unit,
        value: serving.value * item.amount.selectedQuantity,
      }
    : DEFAULT_UNIT_MASS

  return weight
}

export const gramsValue = (value: number, unit: UnitType): number => {
  return value * unitConverter[unit] * 1000
}

export const plus = (previous: UnitMass, add?: UnitMass | null): UnitMass => {
  if (add === undefined || add === null) return previous

  if (add?.unit === previous.unit) {
    return {
      unit: previous.unit,
      value: previous.value + add.value,
    }
  } else {
    return {
      unit: add.unit,
      value:
        gramsValue(previous.value, previous.unit as UnitType) +
        gramsValue(add.value, add.unit as UnitType),
    }
  }
}

export const sumOfUnitMass = (unitMass?: UnitMass[]): UnitMass => {
  // Calculate the sum of the 'value' property using reduce

  if (unitMass === undefined) {
    return DEFAULT_UNIT_MASS
  }

  let previousValue: UnitMass | null = null

  unitMass.forEach((currentValue) => {
    previousValue = plus(currentValue, previousValue)
  })

  return previousValue ?? DEFAULT_UNIT_MASS
}

export const div = (first: UnitMass, second: UnitMass): number => {
  return (
    gramsValue(first.value, first.unit as UnitType) /
    gramsValue(second.value, second.unit as UnitType)
  )
}

export const ingredientWeight = (ingredients: PassioIngredient[]): UnitMass => {
  const ingredient = [...(ingredients ?? [])]
  const units = ingredient?.map(servingWeight)
  const selectedWeight = sumOfUnitMass(units)
  return selectedWeight
}

export const ingredientWeightInGram = (
  ingredients: PassioIngredient[]
): number => {
  const ingredient = [...(ingredients ?? [])]
  const units = ingredient?.map(servingWeight)
  const selectedWeight = sumOfUnitMass(units)
  return gramsValue(selectedWeight.value, selectedWeight.unit as UnitType)
}

export const selectedServingUnit = (
  unitName: string,
  servingUnits: ServingUnit[]
): number => {
  const weight = servingUnits.find((i) => i.unitName === unitName)
  if (weight) {
    return weight.value
  } else {
    return DEFAULT_UNIT_MASS.value
  }
}

export const selectedServingUnitGram = (
  unitName: string,
  servingUnits: ServingUnit[]
): number => {
  const weight = servingUnits.find((i) => i.unitName === unitName)
  if (weight) {
    return gramsValue(weight.value, weight.unit as UnitType)
  } else {
    return DEFAULT_UNIT_MASS.value
  }
}

import type { UnitMass } from '../UnitMass'
import { DEFAULT_UNIT_MASS, unitConverter } from './NutrientsHelper'
import type { UnitType } from './NutrientsHelper'
import type { PassioIngredient } from './PassioIngredient'
import type { PassioNutrients } from './PassioNutrients'

// Defining a class named PassioFoodItemNutrients implementing the PassioNutrients interface

interface IngredientData {
  reference: PassioNutrients
  value: number
}
interface FoodNutrients {
  ingredients?: PassioIngredient[]
}

export class PassioFoodItemNutrients {
  // Property to store the PassioFoodItem instance
  private passioFoodItem: PassioIngredient[]
  // Constructor to initialize the class instance with a PassioFoodItem object
  constructor(item: FoodNutrients) {
    this.passioFoodItem = item.ingredients ?? []
  }

  // Method to calculate nutrients for the selected size
  nutrientsSelectedSize(): PassioNutrients {
    return this.calculateIngredientsNutritionUsingWeight()
  }

  // Method to calculate nutrients for a specific weight
  nutrients(unitMass: UnitMass): PassioNutrients {
    return this.calculateIngredientsNutritionUsingWeight(unitMass)
  }

  // Method to calculate nutrients for a reference weight
  nutrientsReference(): PassioNutrients {
    return this.calculateIngredientsNutritionUsingWeight({
      unit: 'g',
      value: 100,
    })
  }

  private unitConverter = {
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

  convertValueIntoGram = (mass?: UnitMass) => {
    if (mass?.value === undefined) {
      return 0
    }
    const value = unitConverter[(mass?.unit ?? 'g') as UnitType] * 1000
    return mass.value * value
  }

  private servingWeight = (item: PassioIngredient): UnitMass => {
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

  private gramsValue(value: number, unit: UnitType): number {
    return value * this.unitConverter[unit] * 1000
  }

  private plus(previous: UnitMass, add?: UnitMass | null): UnitMass {
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
          this.gramsValue(previous.value, add.unit as UnitType) +
          this.gramsValue(add.value, add.unit as UnitType),
      }
    }
  }

  private sumOfUnitMass(unitMass?: UnitMass[]): UnitMass {
    // Calculate the sum of the 'value' property using reduce

    if (unitMass === undefined) {
      return DEFAULT_UNIT_MASS
    }

    let previousValue: UnitMass | null = null

    unitMass.forEach((currentValue) => {
      previousValue = this.plus(currentValue, previousValue)
    })

    return previousValue ?? DEFAULT_UNIT_MASS
  }

  private ingredientWeight(): UnitMass {
    const ingredient = [...(this.passioFoodItem ?? [])]
    const units = ingredient?.map(this.servingWeight)
    const selectedWeight = this.sumOfUnitMass(units)
    return selectedWeight
  }

  private div(first: UnitMass, second: UnitMass): number {
    return (
      this.gramsValue(first.value, first.unit as UnitType) /
      this.gramsValue(second.value, second.unit as UnitType)
    )
  }

  private scaleValueByAmount(
    currentWeight: UnitMass,
    referenceWeight: UnitMass,
    mass?: UnitMass | null
  ): UnitMass | null | undefined {
    if (mass == null) {
      return null
    }
    if (mass === undefined) {
      return undefined
    }

    return {
      unit: mass.unit,
      value:
        mass.value *
        (this.gramsValue(currentWeight.value, currentWeight.unit as UnitType) /
          this.gramsValue(
            referenceWeight.value,
            referenceWeight.unit as UnitType
          )),
    }
  }

  // Private method to calculate nutrients using a given weight
  private calculateIngredientsNutritionUsingWeight(computedWeight?: UnitMass) {
    const currentWeight = this.ingredientWeight()
    const weight = computedWeight ?? currentWeight
    const ingredients = [...(this.passioFoodItem ?? [])]

    let ingredientNutrients: IngredientData[] | undefined = ingredients?.map(
      (item) => {
        const data: IngredientData = {
          reference: item.referenceNutrients,
          value: this.div(this.servingWeight(item), currentWeight),
        }
        return data
      }
    )

    let passioNutrients: PassioNutrients = {
      weight: weight ?? currentWeight,
    }

    passioNutrients.vitaminA = this.sumOfUnitMass(
      ingredientNutrients?.map((item) => {
        let unitMas: UnitMass = {
          unit: item.reference.vitaminA?.unit ?? 'IU',
          value: (item.reference.vitaminA?.value ?? 0) * item.value,
        }
        return (
          this.scaleValueByAmount(weight, item.reference.weight, unitMas) ??
          DEFAULT_UNIT_MASS
        )
      })
    )

    passioNutrients.alcohol = this.sumOfUnitMass(
      ingredientNutrients?.map((item) => {
        let unitMas: UnitMass = {
          unit: item.reference.alcohol?.unit ?? 'g',
          value: (item.reference.alcohol?.value ?? 0) * item.value,
        }
        return (
          this.scaleValueByAmount(weight, item.reference.weight, unitMas) ??
          DEFAULT_UNIT_MASS
        )
      })
    )

    passioNutrients.calcium = this.sumOfUnitMass(
      ingredientNutrients?.map((item) => {
        let unitMas: UnitMass = {
          unit: item.reference.calcium?.unit ?? 'mg',
          value: (item.reference.calcium?.value ?? 0) * item.value,
        }
        return (
          this.scaleValueByAmount(weight, item.reference.weight, unitMas) ??
          DEFAULT_UNIT_MASS
        )
      })
    )

    passioNutrients.calories = this.sumOfUnitMass(
      ingredientNutrients?.map((item) => {
        let unitMas: UnitMass = {
          unit: item.reference.calories?.unit ?? 'kcal',
          value: (item.reference.calories?.value ?? 0) * item.value,
        }
        return (
          this.scaleValueByAmount(weight, item.reference.weight, unitMas) ??
          DEFAULT_UNIT_MASS
        )
      })
    )

    passioNutrients.carbs = this.sumOfUnitMass(
      ingredientNutrients?.map((item) => {
        let unitMas: UnitMass = {
          unit: item.reference.carbs?.unit ?? 'g',
          value: (item.reference.carbs?.value ?? 0) * item.value,
        }
        return (
          this.scaleValueByAmount(weight, item.reference.weight, unitMas) ??
          DEFAULT_UNIT_MASS
        )
      })
    )

    passioNutrients.cholesterol = this.sumOfUnitMass(
      ingredientNutrients?.map((item) => {
        let unitMas: UnitMass = {
          unit: item.reference.cholesterol?.unit ?? 'mg',
          value: (item.reference.cholesterol?.value ?? 0) * item.value,
        }
        return (
          this.scaleValueByAmount(weight, item.reference.weight, unitMas) ??
          DEFAULT_UNIT_MASS
        )
      })
    )

    passioNutrients.fat = this.sumOfUnitMass(
      ingredientNutrients?.map((item) => {
        let unitMas: UnitMass = {
          unit: item.reference.fat?.unit ?? 'g',
          value: (item.reference.fat?.value ?? 0) * item.value,
        }
        return (
          this.scaleValueByAmount(weight, item.reference.weight, unitMas) ??
          DEFAULT_UNIT_MASS
        )
      })
    )

    passioNutrients.fibers = this.sumOfUnitMass(
      ingredientNutrients?.map((item) => {
        let unitMas: UnitMass = {
          unit: item.reference.fibers?.unit ?? 'g',
          value: (item.reference.fibers?.value ?? 0) * item.value,
        }
        return (
          this.scaleValueByAmount(weight, item.reference.weight, unitMas) ??
          DEFAULT_UNIT_MASS
        )
      })
    )

    passioNutrients.iodine = this.sumOfUnitMass(
      ingredientNutrients?.map((item) => {
        let unitMas: UnitMass = {
          unit: item.reference.iodine?.unit ?? 'ug',
          value: (item.reference.iodine?.value ?? 0) * item.value,
        }
        return (
          this.scaleValueByAmount(weight, item.reference.weight, unitMas) ??
          DEFAULT_UNIT_MASS
        )
      })
    )

    passioNutrients.iron = this.sumOfUnitMass(
      ingredientNutrients?.map((item) => {
        let unitMas: UnitMass = {
          unit: item.reference.iron?.unit ?? 'mg',
          value: (item.reference.iron?.value ?? 0) * item.value,
        }
        return (
          this.scaleValueByAmount(weight, item.reference.weight, unitMas) ??
          DEFAULT_UNIT_MASS
        )
      })
    )

    passioNutrients.magnesium = this.sumOfUnitMass(
      ingredientNutrients?.map((item) => {
        let unitMas: UnitMass = {
          unit: item.reference.magnesium?.unit ?? 'mg',
          value: (item.reference.magnesium?.value ?? 0) * item.value,
        }
        return (
          this.scaleValueByAmount(weight, item.reference.weight, unitMas) ??
          DEFAULT_UNIT_MASS
        )
      })
    )

    passioNutrients.monounsaturatedFat = this.sumOfUnitMass(
      ingredientNutrients?.map((item) => {
        let unitMas: UnitMass = {
          unit: item.reference.monounsaturatedFat?.unit ?? 'g',
          value: (item.reference.monounsaturatedFat?.value ?? 0) * item.value,
        }
        return (
          this.scaleValueByAmount(weight, item.reference.weight, unitMas) ??
          DEFAULT_UNIT_MASS
        )
      })
    )

    passioNutrients.phosphorus = this.sumOfUnitMass(
      ingredientNutrients?.map((item) => {
        let unitMas: UnitMass = {
          unit: item.reference.phosphorus?.unit ?? 'mg',
          value: (item.reference.phosphorus?.value ?? 0) * item.value,
        }
        return (
          this.scaleValueByAmount(weight, item.reference.weight, unitMas) ??
          DEFAULT_UNIT_MASS
        )
      })
    )

    passioNutrients.polyunsaturatedFat = this.sumOfUnitMass(
      ingredientNutrients?.map((item) => {
        let unitMas: UnitMass = {
          unit: item.reference.polyunsaturatedFat?.unit ?? 'g',
          value: (item.reference.polyunsaturatedFat?.value ?? 0) * item.value,
        }
        return (
          this.scaleValueByAmount(weight, item.reference.weight, unitMas) ??
          DEFAULT_UNIT_MASS
        )
      })
    )

    passioNutrients.potassium = this.sumOfUnitMass(
      ingredientNutrients?.map((item) => {
        let unitMas: UnitMass = {
          unit: item.reference.potassium?.unit ?? 'mg',
          value: (item.reference.potassium?.value ?? 0) * item.value,
        }
        return (
          this.scaleValueByAmount(weight, item.reference.weight, unitMas) ??
          DEFAULT_UNIT_MASS
        )
      })
    )

    passioNutrients.protein = this.sumOfUnitMass(
      ingredientNutrients?.map((item) => {
        let unitMas: UnitMass = {
          unit: item.reference.protein?.unit ?? 'g',
          value: (item.reference.protein?.value ?? 0) * item.value,
        }
        return (
          this.scaleValueByAmount(weight, item.reference.weight, unitMas) ??
          DEFAULT_UNIT_MASS
        )
      })
    )

    passioNutrients.satFat = this.sumOfUnitMass(
      ingredientNutrients?.map((item) => {
        let unitMas: UnitMass = {
          unit: item.reference.satFat?.unit ?? 'g',
          value: (item.reference.satFat?.value ?? 0) * item.value,
        }
        return (
          this.scaleValueByAmount(weight, item.reference.weight, unitMas) ??
          DEFAULT_UNIT_MASS
        )
      })
    )

    passioNutrients.sodium = this.sumOfUnitMass(
      ingredientNutrients?.map((item) => {
        let unitMas: UnitMass = {
          unit: item.reference.sodium?.unit ?? 'mg',
          value: (item.reference.sodium?.value ?? 0) * item.value,
        }
        return (
          this.scaleValueByAmount(weight, item.reference.weight, unitMas) ??
          DEFAULT_UNIT_MASS
        )
      })
    )

    passioNutrients.sugarAlcohol = this.sumOfUnitMass(
      ingredientNutrients?.map((item) => {
        let unitMas: UnitMass = {
          unit: item.reference.sugarAlcohol?.unit ?? 'g',
          value: (item.reference.sugarAlcohol?.value ?? 0) * item.value,
        }
        return (
          this.scaleValueByAmount(weight, item.reference.weight, unitMas) ??
          DEFAULT_UNIT_MASS
        )
      })
    )

    passioNutrients.sugars = this.sumOfUnitMass(
      ingredientNutrients?.map((item) => {
        let unitMas: UnitMass = {
          unit: item.reference.sugars?.unit ?? 'g',
          value: (item.reference.sugars?.value ?? 0) * item.value,
        }
        return (
          this.scaleValueByAmount(weight, item.reference.weight, unitMas) ??
          DEFAULT_UNIT_MASS
        )
      })
    )

    passioNutrients.sugarsAdded = this.sumOfUnitMass(
      ingredientNutrients?.map((item) => {
        let unitMas: UnitMass = {
          unit: item.reference.sugarsAdded?.unit ?? 'g',
          value: (item.reference.sugarsAdded?.value ?? 0) * item.value,
        }
        return (
          this.scaleValueByAmount(weight, item.reference.weight, unitMas) ??
          DEFAULT_UNIT_MASS
        )
      })
    )

    passioNutrients.transFat = this.sumOfUnitMass(
      ingredientNutrients?.map((item) => {
        let unitMas: UnitMass = {
          unit: item.reference.transFat?.unit ?? 'g',
          value: (item.reference.transFat?.value ?? 0) * item.value,
        }
        return (
          this.scaleValueByAmount(weight, item.reference.weight, unitMas) ??
          DEFAULT_UNIT_MASS
        )
      })
    )

    passioNutrients.vitaminB12 = this.sumOfUnitMass(
      ingredientNutrients?.map((item) => {
        let unitMas: UnitMass = {
          unit: item.reference.vitaminB12?.unit ?? 'ug',
          value: (item.reference.vitaminB12?.value ?? 0) * item.value,
        }
        return (
          this.scaleValueByAmount(weight, item.reference.weight, unitMas) ??
          DEFAULT_UNIT_MASS
        )
      })
    )

    passioNutrients.vitaminB12Added = this.sumOfUnitMass(
      ingredientNutrients?.map((item) => {
        let unitMas: UnitMass = {
          unit: item.reference.vitaminB12Added?.unit ?? 'ug',
          value: (item.reference.vitaminB12Added?.value ?? 0) * item.value,
        }
        return (
          this.scaleValueByAmount(weight, item.reference.weight, unitMas) ??
          DEFAULT_UNIT_MASS
        )
      })
    )

    passioNutrients.vitaminB6 = this.sumOfUnitMass(
      ingredientNutrients?.map((item) => {
        let unitMas: UnitMass = {
          unit: item.reference.vitaminB6?.unit ?? 'mg',
          value: (item.reference.vitaminB6?.value ?? 0) * item.value,
        }
        return (
          this.scaleValueByAmount(weight, item.reference.weight, unitMas) ??
          DEFAULT_UNIT_MASS
        )
      })
    )

    passioNutrients.vitaminC = this.sumOfUnitMass(
      ingredientNutrients?.map((item) => {
        let unitMas: UnitMass = {
          unit: item.reference.vitaminC?.unit ?? 'mg',
          value: (item.reference.vitaminC?.value ?? 0) * item.value,
        }
        return (
          this.scaleValueByAmount(weight, item.reference.weight, unitMas) ??
          DEFAULT_UNIT_MASS
        )
      })
    )

    passioNutrients.vitaminD = this.sumOfUnitMass(
      ingredientNutrients?.map((item) => {
        let unitMas: UnitMass = {
          unit: item.reference.vitaminD?.unit ?? 'ug',
          value: (item.reference.vitaminD?.value ?? 0) * item.value,
        }
        return (
          this.scaleValueByAmount(weight, item.reference.weight, unitMas) ??
          DEFAULT_UNIT_MASS
        )
      })
    )

    passioNutrients.vitaminE = this.sumOfUnitMass(
      ingredientNutrients?.map((item) => {
        let unitMas: UnitMass = {
          unit: item.reference.vitaminE?.unit ?? 'mg',
          value: (item.reference.vitaminE?.value ?? 0) * item.value,
        }
        return (
          this.scaleValueByAmount(weight, item.reference.weight, unitMas) ??
          DEFAULT_UNIT_MASS
        )
      })
    )

    passioNutrients.vitaminEAdded = this.sumOfUnitMass(
      ingredientNutrients?.map((item) => {
        let unitMas: UnitMass = {
          unit: item.reference.vitaminEAdded?.unit ?? 'mg',
          value: (item.reference.vitaminEAdded?.value ?? 0) * item.value,
        }
        return (
          this.scaleValueByAmount(weight, item.reference.weight, unitMas) ??
          DEFAULT_UNIT_MASS
        )
      })
    )

    //New
    passioNutrients.zinc = this.sumOfUnitMass(
      ingredientNutrients?.map((item) => {
        let unitMas: UnitMass = {
          unit: item.reference.zinc?.unit ?? 'g',
          value: (item.reference.zinc?.value ?? 0) * item.value,
        }
        return (
          this.scaleValueByAmount(weight, item.reference.weight, unitMas) ??
          DEFAULT_UNIT_MASS
        )
      })
    )

    passioNutrients.selenium = this.sumOfUnitMass(
      ingredientNutrients?.map((item) => {
        let unitMas: UnitMass = {
          unit: item.reference.selenium?.unit ?? 'g',
          value: (item.reference.selenium?.value ?? 0) * item.value,
        }
        return (
          this.scaleValueByAmount(weight, item.reference.weight, unitMas) ??
          DEFAULT_UNIT_MASS
        )
      })
    )

    passioNutrients.folicAcid = this.sumOfUnitMass(
      ingredientNutrients?.map((item) => {
        let unitMas: UnitMass = {
          unit: item.reference.folicAcid?.unit ?? 'g',
          value: (item.reference.folicAcid?.value ?? 0) * item.value,
        }
        return (
          this.scaleValueByAmount(weight, item.reference.weight, unitMas) ??
          DEFAULT_UNIT_MASS
        )
      })
    )

    passioNutrients.vitaminKPhylloquinone = this.sumOfUnitMass(
      ingredientNutrients?.map((item) => {
        let unitMas: UnitMass = {
          unit: item.reference.vitaminKPhylloquinone?.unit ?? 'g',
          value:
            (item.reference.vitaminKPhylloquinone?.value ?? 0) * item.value,
        }
        return (
          this.scaleValueByAmount(weight, item.reference.weight, unitMas) ??
          DEFAULT_UNIT_MASS
        )
      })
    )

    passioNutrients.vitaminKMenaquinone4 = this.sumOfUnitMass(
      ingredientNutrients?.map((item) => {
        let unitMas: UnitMass = {
          unit: item.reference.vitaminKMenaquinone4?.unit ?? 'g',
          value: (item.reference.vitaminKMenaquinone4?.value ?? 0) * item.value,
        }
        return (
          this.scaleValueByAmount(weight, item.reference.weight, unitMas) ??
          DEFAULT_UNIT_MASS
        )
      })
    )

    passioNutrients.vitaminKDihydrophylloquinone = this.sumOfUnitMass(
      ingredientNutrients?.map((item) => {
        let unitMas: UnitMass = {
          unit: item.reference.vitaminKDihydrophylloquinone?.unit ?? 'g',
          value:
            (item.reference.vitaminKDihydrophylloquinone?.value ?? 0) *
            item.value,
        }
        return (
          this.scaleValueByAmount(weight, item.reference.weight, unitMas) ??
          DEFAULT_UNIT_MASS
        )
      })
    )

    passioNutrients.chromium = this.sumOfUnitMass(
      ingredientNutrients?.map((item) => {
        let unitMas: UnitMass = {
          unit: item.reference.chromium?.unit ?? 'g',
          value: (item.reference.chromium?.value ?? 0) * item.value,
        }
        return (
          this.scaleValueByAmount(weight, item.reference.weight, unitMas) ??
          DEFAULT_UNIT_MASS
        )
      })
    )

    passioNutrients.vitaminARAE = this.sumOfUnitMass(
      ingredientNutrients?.map((item) => {
        let unitMas: UnitMass = {
          unit: item.reference.vitaminARAE?.unit ?? 'g',
          value: (item.reference.vitaminARAE?.value ?? 0) * item.value,
        }
        return (
          this.scaleValueByAmount(weight, item.reference.weight, unitMas) ??
          DEFAULT_UNIT_MASS
        )
      })
    )
    return passioNutrients
  }
}

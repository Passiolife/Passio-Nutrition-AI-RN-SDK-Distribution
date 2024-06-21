import { useCallback, useEffect, useState } from 'react'
import {
  PassioSDK,
  type PassioFoodItem,
  type PassioNutrients,
  type ServingUnit,
  ingredientWeightInGram,
  selectedServingUnitGram,
} from '@passiolife/nutritionai-react-native-sdk-v3'

interface Props {
  passioFoodItem: PassioFoodItem
}

export interface FoodNutrient {
  title: string
  value: number
  unit: string
}

export interface ComputedWeight {
  value: number
  qty: string
}

const modifyPassioFoodItemByCheckSelectedUnitExist = (
  passioFoodItem: PassioFoodItem
) => {
  const updatedFoodItem = passioFoodItem
  const item = updatedFoodItem?.amount?.servingUnits?.find(
    (i) => i.unitName === updatedFoodItem?.amount.selectedUnit
  )
  if (item === undefined) {
    updatedFoodItem.amount.selectedUnit = 'gram'
    updatedFoodItem.amount.selectedQuantity =
      updatedFoodItem.amount?.weight.value
  }
  return updatedFoodItem
}

export const useFoodDetail = (prop: Props) => {
  const [passioFoodItem, setPassioFoodItem] = useState(
    modifyPassioFoodItemByCheckSelectedUnitExist({ ...prop.passioFoodItem })
  )

  const [isAddIngredients, openAddIngredients] = useState<boolean>(false)

  const [foodNutrients, setFoodNutrients] = useState<FoodNutrient[]>([])
  const [textInput, setTextInput] = useState(
    prop.passioFoodItem.amount.selectedQuantity.toString() ?? '1'
  )

  useEffect(() => {
    function init() {
      setFoodNutrients(
        extractFoodNutrients(
          PassioSDK.getNutrientsOfPassioFoodItem(
            passioFoodItem,
            passioFoodItem.amount.weight
          )
        )
      )
    }
    init()
  }, [passioFoodItem])

  const onServingQuantityChange = useCallback(
    (value: string) => {
      setTextInput(value)
      const newQuantity = Number(value.length > 0 ? value : 1)
      const weight =
        passioFoodItem.amount.servingUnits?.filter(
          (i) => i.unitName === passioFoodItem.amount.selectedUnit
        )[0].value ?? 1

      setPassioFoodItem((foodItem) => {
        foodItem.amount.weight.value = weight * newQuantity
        foodItem.amount.selectedQuantity = newQuantity
        return {
          ...foodItem,
        }
      })
    },
    [passioFoodItem.amount.selectedUnit, passioFoodItem.amount.servingUnits]
  )

  const onServingSizeSelect = useCallback(
    (value: ServingUnit) => {
      const defaultWeight = passioFoodItem.amount.weight.value ?? 0
      const newQuantity = Number((defaultWeight / value.value).toFixed(2))
      setTextInput((newQuantity ?? 1).toString())
      setPassioFoodItem((foodItem) => {
        foodItem.amount.selectedUnit = value.unitName
        foodItem.amount.selectedQuantity = newQuantity
        return {
          ...foodItem,
        }
      })
    },
    [passioFoodItem.amount.weight.value]
  )

  function extractFoodNutrients(
    passioNutrients: PassioNutrients | null
  ): FoodNutrient[] {
    if (passioNutrients == null) {
      return []
    }
    return Object.entries(passioNutrients)
      .map(([title, { value, unit }]) => ({
        title,
        value: value,
        unit,
      }))
      .filter((item) => item.title !== 'weight')
  }

  const showAddIngredients = () => {
    openAddIngredients(true)
  }
  const closeAddIngredients = () => {
    openAddIngredients(false)
  }
  const onAddIngredients = (item: PassioFoodItem) => {
    closeAddIngredients()
    setPassioFoodItem((foodItem) => {
      const oldIngredients = foodItem.ingredients ?? []
      const newIngredients = item.ingredients ?? []
      const ingredients = [...oldIngredients, ...newIngredients]

      foodItem.amount.selectedUnit = 'gram'
      foodItem.amount.weight.value = ingredientWeightInGram(ingredients)
      const newQuantity = Number(
        (
          (foodItem.amount.weight.value ?? 0) /
          selectedServingUnitGram(
            'gram',
            passioFoodItem.amount.servingUnits ?? []
          )
        ).toFixed(2)
      )

      foodItem.amount.selectedQuantity = newQuantity
      ;(foodItem.name =
        'Recipe with ' + foodItem.name.replace('Recipe with ', '')),
        setTextInput(newQuantity.toString())
      foodItem.ingredients = ingredients
      return { ...foodItem }
    })
  }

  return {
    calculatedWeight: passioFoodItem.amount?.weight.value,
    calculatedWeightUnit: passioFoodItem?.amount?.weight?.unit,
    selectedServingUnit: passioFoodItem?.amount.selectedUnit,
    textInputServingQty: textInput,
    extractFoodNutrients,
    isAddIngredients,
    onServingQuantityChange,
    onAddIngredients,
    onServingSizeSelect,
    showAddIngredients,
    closeAddIngredients,
    passioFoodItem,
    foodNutrients,
  }
}

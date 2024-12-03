import type {
  PassioIDAttributes,
  PassioFoodItem as PassioFoodItemV2,
  PassioRecipe,
} from '../models/v2'
import {
  PassioIDEntityType,
  type PassioFoodItem,
  type Measurement,
  type PassioIngredient,
  PassioSDK,
} from '..'

export const convertPassioFoodItemV3ToPassioIdAttributes = (
  foodItem: PassioFoodItem | null
): PassioIDAttributes | null => {
  if (foodItem) {
    const item: PassioIDAttributes = {
      passioID: foodItem.id,
      name: foodItem.name,
      imageName: foodItem.iconId ?? '',
      entityType: PassioIDEntityType.item,
      parents: [],
      children: [],
      siblings: [],
      isOpenFood: foodItem.isOpenFood ?? false,
      foodItem: convertPassioFoodItemV3ToPassioFoodItemV2(foodItem),
      recipe: convertPassioFoodItemV3ToPassioRecipeV2(foodItem),
    }
    return item
  }
  return null
}

export const convertPassioFoodItemV3ToPassioFoodItemV2 = (
  foodItem: PassioFoodItem | undefined
): PassioFoodItemV2 | undefined => {
  if (foodItem) {
    const nutrients =
      PassioSDK.getNutrientsSelectedSizeOfPassioFoodItem(foodItem)
    const item: PassioFoodItemV2 = {
      passioID: foodItem.id,
      name: foodItem.name,
      imageName: foodItem.iconId ?? '',
      selectedQuantity: foodItem.amount?.selectedQuantity ?? 0,
      selectedUnit: foodItem.amount?.selectedUnit ?? 'g',
      entityType: PassioIDEntityType.item,
      servingUnits: foodItem.amount?.servingUnits ?? [],
      servingSizes: foodItem.amount?.servingSizes ?? [],
      computedWeight: {
        value: foodItem.ingredientWeight?.value,
        unit: foodItem.ingredientWeight?.unit,
      } as Measurement,
      ...nutrients,
      ingredientsDescription: foodItem.details,
      magnesium: {
        unitName: nutrients?.magnesium?.unit ?? 'g',
        value: nutrients?.magnesium?.value ?? 0,
        unit: nutrients?.magnesium?.unit ?? 'g',
      },
      monounsaturatedFat: {
        unitName: nutrients?.monounsaturatedFat?.unit ?? 'g',
        value: nutrients?.monounsaturatedFat?.value ?? 0,
        unit: nutrients?.magnesium?.unit ?? 'g',
      },
    }
    return item
  }
  return undefined
}

export const convertPassioFoodItemV3ToPassioRecipeV2 = (
  foodItem: PassioFoodItem | undefined
): PassioRecipe | undefined => {
  if (foodItem) {
    const item: PassioRecipe = {
      passioID: foodItem.id,
      name: foodItem.name,
      imageName: foodItem.iconId ?? '',
      selectedQuantity: foodItem.amount?.selectedQuantity ?? 0,
      selectedUnit: foodItem.amount?.selectedUnit ?? 'g',
      servingUnits: foodItem.amount?.servingUnits ?? [],
      servingSizes: foodItem.amount?.servingSizes ?? [],
      foodItems:
        foodItem.ingredients
          ?.map(convertPassioIngredientV3ToPassioFoodItemV2)
          .filter(
            (filterItem): filterItem is PassioFoodItemV2 => !!filterItem
          ) ?? [],
    }
    return item
  }
  return undefined
}

export const convertPassioIngredientV3ToPassioFoodItemV2 = (
  foodItem: PassioIngredient | undefined
): PassioFoodItemV2 | undefined => {
  if (foodItem) {
    const nutrients = PassioSDK.getNutrientsSelectedSizeOfPassioFoodItem({
      ingredients: [foodItem],
      id: foodItem.id,
      name: foodItem.name,
      iconId: foodItem.iconId,
      amount: foodItem.amount,
      ingredientWeight: foodItem.weight,
      refCode: '',
    })

    const item: PassioFoodItemV2 = {
      passioID: foodItem.id,
      name: foodItem.name,
      imageName: foodItem.iconId ?? '',
      selectedQuantity: foodItem.amount?.selectedQuantity ?? 0,
      selectedUnit: foodItem.amount?.selectedUnit ?? 'g',
      entityType: PassioIDEntityType.item,
      servingUnits: foodItem.amount?.servingUnits ?? [],
      servingSizes: foodItem.amount?.servingSizes ?? [],
      computedWeight: {
        value: foodItem.weight?.value,
        unit: foodItem.weight?.unit,
      } as Measurement,
      ...nutrients,
      magnesium: {
        unitName: nutrients?.magnesium?.unit ?? 'g',
        unit: nutrients?.magnesium?.unit ?? 'g',
        value: nutrients?.magnesium?.value ?? 0,
      },
      monounsaturatedFat: {
        unit: nutrients?.magnesium?.unit ?? 'g',
        unitName: nutrients?.monounsaturatedFat?.unit ?? 'g',
        value: nutrients?.monounsaturatedFat?.value ?? 0,
      },
    }
    return item
  }
  return undefined
}

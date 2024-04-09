# Migrations

## Using SDK Migrations
To get the old API structure with V3 API then you have to just change import like @passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2 


## Manually Migrations
## Convert V3 New PassioFoodItem to V2 Old PassioIDAttributes

```typescript
export interface PassioIDAttributes {
  passioID: PassioID
  name: string
  imageName: string
  entityType: PassioIDEntityType
  foodItem?: PassioFoodItem
  recipe?: PassioRecipe
  parents: PassioAlternative[]
  children: PassioAlternative[]
  siblings: PassioAlternative[]
  isOpenFood: boolean
}
```

```typescript
export interface PassioFoodItem {
  passioID: PassioID
  name: string
  imageName: string
  selectedQuantity: number
  selectedUnit: string
  entityType: PassioIDEntityType
  servingUnits: ServingUnit[]
  servingSizes: ServingSize[]
  computedWeight: Measurement
  parents?: PassioAlternative[]
  children?: PassioAlternative[]
  siblings?: PassioAlternative[]
  calories?: UnitMass
  carbs?: UnitMass
  fat?: UnitMass
  protein?: UnitMass
  saturatedFat?: UnitMass
  transFat?: UnitMass
  monounsaturatedFat?: ServingUnit
  polyunsaturatedFat?: UnitMass
  cholesterol?: UnitMass
  sodium?: UnitMass
  fiber?: UnitMass
  sugar?: UnitMass
  sugarAdded?: UnitMass
  vitaminD?: UnitMass
  calcium?: UnitMass
  iron?: UnitMass
  potassium?: UnitMass
  vitaminA?: UnitMass
  vitaminC?: UnitMass
  alcohol?: UnitMass
  sugarAlcohol?: UnitMass
  vitaminB12?: UnitMass
  vitaminB12Added?: UnitMass
  vitaminB6?: UnitMass
  vitaminE?: UnitMass
  vitaminEAdded?: UnitMass
  magnesium?: ServingUnit
  phosphorus?: UnitMass
  iodine?: UnitMass
  ingredientsDescription?: string
  barcode?: string
  tags?: string[]
}
```

```typescript
export interface Measurement {
  value: number
  unit: string
}

```

```typescript 
export interface PassioAlternative {
  passioID: PassioID
  name: string
  quantity?: number
  unitName?: string
}
```

```typescript
export interface PassioRecipe {
  passioID: PassioID
  name: string
  imageName: string
  servingSizes: ServingSize[]
  servingUnits: ServingUnit[]
  selectedUnit: string
  selectedQuantity: number
  foodItems: PassioFoodItem[]
}
```

```typescript


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
      PassioSDK.fetchNutrientsSelectedSizeForPassioFoodItem(foodItem)
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
    const nutrients = PassioSDK.fetchNutrientsSelectedSizeForPassioFoodItem({
      ingredients: [foodItem],
      id: foodItem.id,
      name: foodItem.name,
      iconId: foodItem.iconId,
      amount: foodItem.amount,
      weight: foodItem.weight,
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


```
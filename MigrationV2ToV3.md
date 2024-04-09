## Deprecated APIs
```typescript
getAttributesForPassioID(passioID: PassioID): Promise<PassioIDAttributes | null>

fetchAttributesForBarcode(barcode: Barcode): Promise<PassioIDAttributes | null>

fetchPassioIDAttributesForPackagedFood(packagedFoodCode: PackagedFoodCode): Promise<PassioIDAttributes | null>

fetchSearchResult(result: FoodSearchResult): Promise<PassioIDAttributes | null>

onDowloadingPassioModelCallBacks: (downloadModelCallBack: DownloadModelCallBack) => Callback

```

## Refactored APIs

##### getAttributesForPassioID, fetchAttributesForBarcode, fetchPassioIDAttributesForPackagedFood now returns a PassioFoodItem result

```typescript
getAttributesForPassioID(passioID: PassioID): Promise<PassioFoodItem | null>

fetchAttributesForBarcode(barcode: Barcode): Promise<PassioFoodItem | null>

fetchPassioIDAttributesForPackagedFood(packagedFoodCode: PackagedFoodCode): Promise<PassioFoodItem | null>

onDownloadingPassioModelCallBacks: (downloadModelCallBack: DownloadModelCallBack) => Callback
```
##### searchForFood now returns PassioSearchResult and a list of search options. The PassioSearchResult represent a specific food item associated with the search term, while search options provide a list of possible suggested search terms connected to the input term.

```typescript
searchForFood(searchQuery: string): Promise<PassioSearchResult | null>

fetchSearchResult(result: FoodSearchResult): Promise<PassioFoodItem | null>

```

## Now DetectedCandidate have alternatives and croppedImage

## Added below nutrients in PassioNutrients

```typescript

 /** The amount of added zinc E. */
  zinc?: UnitMass
  /** The amount of added selenium. */
  selenium?: UnitMass
  /** The amount of added folicAcid. */
  folicAcid?: UnitMass
  /** The amount of added vitaminKPhylloquinone. */
  vitaminKPhylloquinone?: UnitMass
  /** The amount of added vitaminKMenaquinone4. */
  vitaminKMenaquinone4?: UnitMass
  /** The amount of added vitaminKDihydrophylloquinone. */
  vitaminKDihydrophylloquinone?: UnitMass
  /** The amount of added chromium. */
  chromium?: UnitMass
```

## New API
##### fetchSearchResult returns a PassioFoodItem object for a given PassioSearchResult

```typescript
fetchSearchResult(result: FoodSearchResult): Promise<PassioFoodItem | null>

searchForFood(searchQuery: string): Promise<PassioSearchResult |null >
```

#### Added API to fetch suggestions for a certain meal time.

```typescript
type MealTime = 'breakfast' | 'lunch' | 'dinner' | 'snack'
```

```typescript
fetchSuggestions(mealTime: MealTime): Promise<FoodSearchResult[] | null>

fetchFoodItemForSuggestion(result: FoodSearchResult): Promise<PassioFoodItem | null>
```


## To retrieve all macro and micronutrient values using `PassioSDK` by passing a `passioFoodItem`, you would typically follow these steps:

   ```typescript
    PassioSDK.fetchNutrientsSelectedSizeForPassioFoodItem(passioFoodItem)

    PassioSDK.fetchNutrientsForPassioFoodItem(passioFoodItem,{
      unit: calculatedWeightUnit,
      value: calculatedWeight,
    })

   PassioSDK.fetchNutrientsReferenceForPassioFoodItem(passioFoodItem)
   ```
import { useState, useCallback, useEffect } from 'react'
import {
  PassioSDK,
  type FoodSearchResult,
  MealTime,
} from '@passiolife/nutritionai-react-native-sdk-v2'
import type { Props } from './FoodSuggestion'

const useSuggestions = ({ onFoodDetail }: Props) => {
  // State variables
  const [mealTime, setMealTime] = useState<MealTime>('breakfast')
  const [loading, setLoading] = useState<boolean>(false)
  const [foodResults, setFoodResults] = useState<FoodSearchResult[] | null>()
  const mealTimes: MealTime[] = ['breakfast', 'dinner', 'lunch', 'snack']

  // Effect for handling debounced search term changes
  useEffect(() => {
    async function init() {
      try {
        setLoading(true)
        setFoodResults([])
        // Fetch food results from the PassioSDK based on the query
        const searchFoods = await PassioSDK.fetchSuggestions(mealTime)
        setFoodResults(searchFoods)
      } catch (error) {
        // Handle errors, e.g., network issues or API failures
        setFoodResults([])
      } finally {
        // Reset loading state to indicate the end of the search
        setLoading(false)
      }
    }
    init()
  }, [mealTime])

  const onSearchResultItemPress = useCallback(
    async (foodSearchResult: FoodSearchResult) => {
      const result = await PassioSDK.fetchFoodItemForSuggestion(
        foodSearchResult
      )
      if (result) {
        onFoodDetail(result)
      }
    },
    [onFoodDetail]
  )

  const onChangeMeal = (mealTime: MealTime) => {
    setMealTime(mealTime)
  }

  return {
    foodResults,
    mealTimes,
    onChangeMeal,
    loading,
    onSearchResultItemPress,
    mealTime,
  }
}

export default useSuggestions

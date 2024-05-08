import { useState, useCallback, useEffect } from 'react'
import {
  PassioSDK,
  type PassioFoodDataInfo,
  PassioMealTime,
} from '@passiolife/nutritionai-react-native-sdk-v3'
import type { Props } from './FoodSuggestion'

const useSuggestions = ({ onFoodDetail }: Props) => {
  // State variables
  const [mealTime, setMealTime] = useState<PassioMealTime>('breakfast')
  const [loading, setLoading] = useState<boolean>(false)
  const [foodResults, setFoodResults] = useState<PassioFoodDataInfo[] | null>()
  const mealTimes: PassioMealTime[] = ['breakfast', 'dinner', 'lunch', 'snack']

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

  const onResultItemPress = useCallback(
    async (foodSearchResult: PassioFoodDataInfo) => {
      const result = await PassioSDK.fetchFoodItemForDataInfo(foodSearchResult)
      if (result) {
        onFoodDetail(result)
      }
    },
    [onFoodDetail]
  )

  const onChangeMeal = (mealTime: PassioMealTime) => {
    setMealTime(mealTime)
  }

  return {
    foodResults,
    mealTimes,
    onChangeMeal,
    loading,
    onResultItemPress,
    mealTime,
  }
}

export default useSuggestions

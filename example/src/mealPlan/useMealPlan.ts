import { useState, useCallback, useEffect, useMemo } from 'react'
import {
  PassioSDK,
  type PassioFoodDataInfo,
  PassioMealPlan,
  PassioMealPlanItem,
} from '@passiolife/nutritionai-react-native-sdk-v3'
import type { Props } from './MealPlan'

const useMealPlan = ({ onFoodDetail }: Props) => {
  // State variables
  const [passioMealPlan, setPassioMealPlan] = useState<PassioMealPlan>()
  const [selectedDay, setSelectedDay] = useState<number>(0)
  const [passioMealPlans, setPassioMealPlans] = useState<PassioMealPlan[]>()
  const [loading, setLoading] = useState<boolean>(false)
  const [passioMealPlanItem, setPassioMealPlanItem] = useState<
    PassioMealPlanItem[] | null
  >()

  const generateDaysData = useMemo(() => {
    const days = []
    for (let i = 1; i <= 14; i++) {
      days.push(`Day ${i}`)
    }

    return days
  }, [])

  const onChangeDay = useCallback((day: number) => {
    setSelectedDay(day)
  }, [])

  // Effect for handling debounced search term changes
  useEffect(() => {
    async function init() {
      try {
        setLoading(true)
        setPassioMealPlanItem([])
        setPassioMealPlans([])
        // Fetch food results from the PassioSDK based on the query
        const mealPlans = await PassioSDK.fetchMealPlans()
        if (mealPlans) {
          setPassioMealPlans(mealPlans)
          const initial = mealPlans[0]
          if (initial) {
            setPassioMealPlan(initial)
          }
        }
      } catch (error) {
        setPassioMealPlans([])
        setPassioMealPlanItem([])
      } finally {
        // Reset loading state to indicate the end of the search
        setLoading(false)
      }
    }
    init()
  }, [])
  // Effect for handling debounced search term changes
  useEffect(() => {
    async function init() {
      try {
        setLoading(true)
        setPassioMealPlanItem([])
        if (passioMealPlan?.mealPlanLabel) {
          const mealPlans = await PassioSDK.fetchMealPlanForDay(
            passioMealPlan?.mealPlanLabel,
            selectedDay + 1
          )
          setPassioMealPlanItem(mealPlans)
        }
      } catch (error) {
        // Handle errors, e.g., network issues or API failures
        setPassioMealPlanItem([])
      } finally {
        // Reset loading state to indicate the end of the search
        setLoading(false)
      }
    }
    init()
  }, [passioMealPlan, passioMealPlan?.mealPlanLabel, selectedDay])

  const onResultItemPress = useCallback(
    async (foodSearchResult: PassioFoodDataInfo) => {
      let result = await PassioSDK.fetchFoodItemForDataInfo(foodSearchResult)

      if (result) {
        if (foodSearchResult.nutritionPreview?.weightUnit) {
          result.amount.weight = {
            unit: foodSearchResult.nutritionPreview?.weightUnit,
            value: foodSearchResult.nutritionPreview?.weightQuantity ?? 0,
          }
          result.amount.selectedUnit =
            foodSearchResult.nutritionPreview?.servingUnit
          result.amount.selectedQuantity =
            foodSearchResult.nutritionPreview?.servingQuantity ?? 0
        }

        console.log(JSON.stringify(result))

        onFoodDetail(result)
      }
    },
    [onFoodDetail]
  )

  const onChangeMeal = (plan: PassioMealPlan) => {
    setPassioMealPlan(plan)
  }

  return {
    passioMealPlanItem,
    passioMealPlans,
    onChangeMeal,
    loading,
    onResultItemPress,
    passioMealPlan,
    generateDaysData,
    onChangeDay,
    selectedDay,
  }
}

export default useMealPlan

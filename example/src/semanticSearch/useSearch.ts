import { useState, useCallback, useEffect } from 'react'
import {
  PassioSDK,
  type PassioFoodDataInfo,
} from '@passiolife/nutritionai-react-native-sdk-v3'
import { useDebounce } from '../utils/common'
import type { Props } from './SemanticSearch'

const useFoodSearch = ({ onFoodDetail }: Props) => {
  // State variables
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [foodResults, setFoodResults] = useState<PassioFoodDataInfo[] | null>()
  const [alternatives, setAlternative] = useState<string[] | null>()
  const debouncedSearchTerm: string = useDebounce<string>(searchQuery, 500)

  // Clears search results and resets state
  const cleanSearch = useCallback(() => {
    setSearchQuery('')
    setFoodResults([])
    setLoading(false)
  }, [])

  // Calls the search API based on the input value
  const callSearchApi = useCallback(
    async (query: string) => {
      // Check if the query is not empty
      if (query.length > 0) {
        // Set loading state to indicate the start of the search
        setLoading(true)

        try {
          // Fetch food results from the PassioSDK based on the query
          const searchFoods = await PassioSDK.searchForFoodSemantic(query)
          setFoodResults(searchFoods?.results)
          setAlternative(searchFoods?.alternatives)
        } catch (error) {
          // Handle errors, e.g., network issues or API failures
          setFoodResults([])
        } finally {
          // Reset loading state to indicate the end of the search
          setLoading(false)
        }
      } else {
        // If the query is empty, reset the search state
        cleanSearch()
      }
    },
    [cleanSearch]
  )

  // Initiates a new search with the provided query
  const onSearchFood = useCallback(
    async (q: string) => {
      if (q.length > 0) {
        setSearchQuery(q)
        setAlternative([])
        setFoodResults([])
      } else {
        cleanSearch()
      }
    },
    [cleanSearch]
  )

  // Effect for handling debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm.length > 0) {
      callSearchApi(debouncedSearchTerm)
    } else {
      cleanSearch()
    }
  }, [callSearchApi, debouncedSearchTerm, cleanSearch])

  const onSearchResultItemPress = useCallback(
    async (foodSearchResult: PassioFoodDataInfo) => {
      // Achieved Result through `fetchSearchResult`
      console.log(
        'foodSearchResult=========>',
        JSON.stringify(foodSearchResult)
      )
      const result = await PassioSDK.fetchFoodItemForDataInfo(
        foodSearchResult,
        foodSearchResult.nutritionPreview?.servingQuantity,
        foodSearchResult?.nutritionPreview?.servingUnit
      )
      if (result) {
        console.log(
          'foodSearchResult=========>result====>',
          JSON.stringify(result)
        )
        onFoodDetail(result)
      }
    },
    [onFoodDetail]
  )

  return {
    alternatives,
    cleanSearch,
    foodResults,
    loading,
    onSearchFood,
    onSearchResultItemPress,
    searchQuery,
  }
}

export default useFoodSearch

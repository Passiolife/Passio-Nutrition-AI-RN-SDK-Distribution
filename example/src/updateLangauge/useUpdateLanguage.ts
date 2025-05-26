import { useState, useCallback } from 'react'
import { PassioSDK } from '@passiolife/nutritionai-react-native-sdk-v3'

const useUpdateLanguage = () => {
  // State variables
  const [loading, setLoading] = useState<boolean>(false)

  // Clears search results and resets state
  const cleanSearch = useCallback(() => {
    setLoading(false)
  }, [])

  // Calls the search API based on the input value
  const onChangeLanguage = useCallback(
    async (query: string) => {
      // Check if the query is not empty
      if (query.length > 0) {
        // Set loading state to indicate the start of the search
        setLoading(true)

        try {
          // Fetch food results from the PassioSDK based on the query
          const result = await PassioSDK.updateLanguage(query)
          console.warn(result)
        } catch (error) {
          console.warn('Failed')
          setLoading(false)
        }
      } else {
        // If the query is empty, reset the search state
        cleanSearch()
      }
    },
    [cleanSearch]
  )

  return {
    cleanSearch,
    onChangeLanguage,
    loading,
  }
}

export default useUpdateLanguage

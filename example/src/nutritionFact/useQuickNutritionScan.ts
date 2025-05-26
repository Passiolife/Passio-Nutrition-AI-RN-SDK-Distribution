import { useState } from 'react'
import type { NutritionFacts } from '@passiolife/nutritionai-react-native-sdk-v3'

/**
 * Custom hook for handling quick food scanning using PassioSDK.
 * It provides functions and state variables related to food detection and alternative food items.
 */
export const useQuickNutritionScan = () => {
  const [loading] = useState(true)
  const [nutritionFacts, setNutritionFacts] = useState<
    NutritionFacts | undefined
  >(undefined)

  // useEffect(() => {
  //   // Function to handle food detection events
  //   const handleFoodDetection = async (detection: NutritionDetectionEvent) => {
  //     const { nutritionFacts: facts } = detection

  //     if (facts !== undefined) {
  //       setNutritionFacts(facts)
  //       console.log('Nutrition Fact', JSON.stringify(facts))
  //       return
  //     }
  //     setLoading(false)
  //   }

  //   const subscription =
  //     PassioSDK.startNutritionFactsDetection(handleFoodDetection)

  //   // Cleanup function to unsubscribe when the component unmounts
  //   return () => subscription.remove()
  // }, []) // Empty dependency array to run the effect only once during component mount

  // Return the hook's public API

  const onClearResultPress = () => {
    setNutritionFacts(undefined)
  }
  return {
    loading,
    nutritionFacts,
    onClearResultPress,
  }
}

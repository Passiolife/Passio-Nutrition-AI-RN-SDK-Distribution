import { useEffect, useState, useCallback } from 'react'
import {
  FoodDetectionConfig,
  FoodDetectionEvent,
  PassioSDK,
  DetectedCandidate,
} from '@passiolife/nutritionai-react-native-sdk-v3'

/**
 * Custom hook for handling multi-scanning using PassioSDK.
 * It provides functions and state variables related to the detection of multiple food items.
 */
export const useMultiScanning = () => {
  // State variables
  const [isLoading, setIsLoading] = useState(true)
  const [detectedCandidates, setDetectedCandidate] = useState<
    DetectedCandidate[]
  >([])

  useEffect(() => {
    // Configuration for food detection
    const config: FoodDetectionConfig = {
      detectBarcodes: false,
      detectPackagedFood: false,
      detectNutritionFacts: false,
    }

    // Start food detection and subscribe to events
    const subscription = PassioSDK.startFoodDetection(
      config,
      async (detection: FoodDetectionEvent) => {
        const { candidates } = detection
        const detectedCandidateResult = candidates?.detectedCandidates

        // Check if there are candidates with relevant information
        if (detectedCandidateResult && detectedCandidateResult.length > 0) {
          // Get attributes for the detected food candidates

          // Update passioIDAttributes state
          setDetectedCandidate((previousDetectedCandidate) => {
            const copyOfDetectedCandidate: DetectedCandidate[] = []
            // Filter out duplicate entries
            detectedCandidateResult.forEach((value) => {
              if (
                previousDetectedCandidate.every(
                  (item) => item.passioID !== value.passioID
                )
              ) {
                copyOfDetectedCandidate.push(value)
              }
            })

            // If there are new attributes, update the state
            if (copyOfDetectedCandidate.length > 0) {
              return [...previousDetectedCandidate, ...copyOfDetectedCandidate]
            } else {
              return previousDetectedCandidate
            }
          })

          setIsLoading(false)
        }
      }
    )

    // Cleanup function to unsubscribe when the component unmounts
    return () => {
      console.log('register-startFoodDetection', 'remove')
      subscription.remove()
    }
  }, [])

  // Function to delete a food item by its passioID
  const onDeleteFoodItem = useCallback(({ passioID }: DetectedCandidate) => {
    setDetectedCandidate((prev) =>
      prev.filter((value) => value.passioID !== passioID)
    )
  }, [])

  // Return the hook's public API
  return {
    isLoading,
    detectedCandidates,
    onDeleteFoodItem,
  }
}

import { useEffect, useRef, useState, useCallback } from 'react'
import {
  PassioSDK,
  type FoodDetectionConfig,
  type FoodDetectionEvent,
  PassioFoodItem,
  DetectedCandidate,
} from '@passiolife/nutritionai-react-native-sdk-v3'

/**
 * Custom hook for handling quick food scanning using PassioSDK.
 * It provides functions and state variables related to food detection and alternative food items.
 */
export const useQuickScan = () => {
  // State variables
  const [passioFoodItem, setPassioFoodItem] = useState<PassioFoodItem | null>(
    null
  )
  const [alternative, setAlternativePassioIDAttributes] = useState<
    DetectedCandidate[] | null | undefined
  >(null)
  const [loading, setLoading] = useState(true)
  const passioFoodItemRef = useRef<PassioFoodItem | null>(null)

  // Function to clear the scanning results
  const onClearResultPress = () => {
    setLoading(true)
    passioFoodItemRef.current = null
    setPassioFoodItem(null)
    setAlternativePassioIDAttributes(null)
  }

  useEffect(() => {
    // Function to handle food detection events
    const handleFoodDetection = async (detection: FoodDetectionEvent) => {
      const { candidates } = detection

      // If no candidates available, return
      if (!candidates) {
        return
      }

      let attributes: PassioFoodItem | null = null

      // Determine the type of food detection and fetch attributes accordingly
      if (candidates && candidates.barcodeCandidates?.[0]) {
        const barcode = candidates.barcodeCandidates[0].barcode
        attributes = await PassioSDK.fetchFoodItemForProductCode(barcode)
      } else if (candidates && candidates.packagedFoodCode?.[0]) {
        const packagedFoodCode = candidates.packagedFoodCode?.[0]
        attributes = await PassioSDK.fetchFoodItemForProductCode(
          packagedFoodCode
        )
      } else if (candidates && candidates.detectedCandidates?.[0]) {
        const passioID = candidates.detectedCandidates[0].passioID
        attributes = await PassioSDK.fetchFoodItemForPassioID(passioID)
      }

      // If attributes are null, return
      if (attributes === null) {
        return
      }

      // Check if the detected food is different from the previous one
      if (attributes?.id !== passioFoodItemRef.current?.id) {
        passioFoodItemRef.current = attributes

        // Update state variables and fetch alternative food items
        setPassioFoodItem((prev) => {
          if (attributes?.id === prev?.id) {
            return prev
          } else {
            setAlternativePassioIDAttributes(
              candidates.detectedCandidates?.[0]?.alternatives
            )
            return attributes
          }
        })

        setLoading(false)
      }
    }

    // Configuration for food detection
    const config: FoodDetectionConfig = {
      detectBarcodes: true,
      detectPackagedFood: true,
      detectVisual: true,
      volumeDetectionMode: 'auto',
    }

    // Start food detection and subscribe to events
    const subscription = PassioSDK.startFoodDetection(
      config,
      handleFoodDetection
    )

    // Cleanup function to unsubscribe when the component unmounts
    return () => subscription.remove()
  }, []) // Empty dependency array to run the effect only once during component mount

  // Function to handle changes in alternative food items
  const onAlternativeFoodItemChange = useCallback(
    async (attribute: DetectedCandidate) => {
      const alternatePassioFoodItem = await PassioSDK.fetchFoodItemForPassioID(
        attribute.passioID
      )
      if (alternatePassioFoodItem) {
        passioFoodItemRef.current = alternatePassioFoodItem
        setPassioFoodItem(alternatePassioFoodItem)
      }
    },
    []
  )

  // Return the hook's public API
  return {
    loading,
    passioFoodItem,
    onAlternativeFoodItemChange,
    onClearResultPress,
    alternative,
  }
}

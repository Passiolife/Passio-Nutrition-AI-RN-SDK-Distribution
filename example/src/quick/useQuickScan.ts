import { useEffect, useRef, useState, useCallback } from 'react'
import {
  PassioSDK,
  PassioFoodItem,
  BarcodeScanEvent,
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
    [] | null | undefined
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
    const handleFoodDetection = async (detection: BarcodeScanEvent) => {
      const barcodeCandidates = detection.barcodeCandidates

      // If no candidates available, return
      if (!barcodeCandidates) {
        return
      }

      let attributes: PassioFoodItem | null = null

      // Determine the type of food detection and fetch attributes accordingly
      if (barcodeCandidates?.[0]) {
        const barcode = barcodeCandidates[0].barcode
        attributes = await PassioSDK.fetchFoodItemForProductCode(barcode)
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
            return attributes
          }
        })

        setLoading(false)
      }
    }

    // Start food detection and subscribe to events
    console.log('Starting food detection')
    const subscription = PassioSDK.startBarcodeScanning(handleFoodDetection)

    // Cleanup function to unsubscribe when the component unmounts
    return () => subscription.remove()
  }, []) // Empty dependency array to run the effect only once during component mount

  // Function to handle changes in alternative food items
  const onAlternativeFoodItemChange = useCallback(async () => {}, [])

  // Return the hook's public API
  return {
    loading,
    passioFoodItem,
    onAlternativeFoodItemChange,
    onClearResultPress,
    alternative,
  }
}

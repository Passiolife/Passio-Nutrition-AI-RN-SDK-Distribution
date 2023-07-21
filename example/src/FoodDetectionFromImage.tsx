import React, { useEffect, useState } from 'react'
import {
  FoodCandidates,
  PassioSDK,
} from '@passiolife/nutritionai-react-native-sdk-v2'
import { Text } from 'react-native'

export const FoodDetectionFromImage = (props: { imageUri: string }) => {
  const [candidates, setCandidates] = useState<FoodCandidates | null>()
  useEffect(() => {
    PassioSDK.detectFoodFromImageURI(props.imageUri).then((foodCandidates) => {
      setCandidates(foodCandidates)
    })
  }, [props.imageUri])

  const [foodName, setFoodName] = useState('unknown')
  useEffect(() => {
    const { passioID } = candidates?.detectedCandidates?.[0] ?? {}
    if (!passioID) return
    PassioSDK.getAttributesForPassioID(passioID).then((attributes) => {
      setFoodName(attributes?.name ?? 'unknown')
    })
  }, [candidates])
  return <Text>{`Image detected from file: ${foodName}`}</Text>
}

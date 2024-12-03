import { useState, useCallback } from 'react'
import {
  PassioFoodItem,
  PassioSDK,
} from '@passiolife/nutritionai-react-native-sdk-v3'
import type { Props } from './RecognizeNutritionFactsRemote'
import { launchImageLibrary } from 'react-native-image-picker'
import { Alert } from 'react-native'

const useRecognizeNutritionFactsRemote = ({}: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [passioSpeechRecognitionModel, setPassioSpeechRecognitionModel] =
    useState<PassioFoodItem[]>([])

  const onScanImage = useCallback(async () => {
    try {
      const { assets } = await launchImageLibrary({ mediaType: 'photo' })
      if (assets) {
        setLoading(true)
        setPassioSpeechRecognitionModel([])
        PassioSDK.recognizeNutritionFactsRemote(
          assets?.[0].uri?.replace('file://', '') ?? '',
          'RES_512'
        )
          .then(async (candidates) => {
            console.log('candidates=====>', JSON.stringify(candidates))
            if (candidates) {
              setPassioSpeechRecognitionModel([candidates])
            }
          })
          .catch(() => {
            Alert.alert('Unable to recognized this image')
          })
          .finally(() => {
            setLoading(false)
          })
      }
    } catch (err) {
      setLoading(false)
    }
  }, [])

  return {
    onScanImage,
    passioSpeechRecognitionModel,
    loading,
  }
}

export default useRecognizeNutritionFactsRemote

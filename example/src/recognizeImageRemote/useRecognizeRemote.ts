import { useState, useCallback } from 'react'
import {
  PassioAdvisorFoodInfo,
  PassioFoodItem,
  PassioSDK,
} from '@passiolife/nutritionai-react-native-sdk-v3'
import type { Props } from './RecognizeRemote'
import { launchImageLibrary } from 'react-native-image-picker'
import { Alert } from 'react-native'

const useRecognizeRemote = ({ onFoodDetail }: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [passioSpeechRecognitionModel, setPassioSpeechRecognitionModel] =
    useState<PassioAdvisorFoodInfo[] | null>()

  const [passioFoodItem, setPassioFoodItem] = useState<PassioFoodItem | null>()

  const onScanImage = useCallback(async () => {
    try {
      const { assets } = await launchImageLibrary({ mediaType: 'photo' })
      if (assets) {
        console.log('image', 'image')
        setLoading(true)
        setPassioSpeechRecognitionModel(null)
        PassioSDK.recognizeImageRemoteWithGrouping(
          assets?.[0].uri?.replace('file://', '') ?? '',
          undefined,
          'RES_512'
        )
          .then(async (candidates) => {
            console.log('candidates', candidates)
            if (candidates?.status === 'Success') {
              setPassioFoodItem(candidates.response.items[0].foodItem)
              onFoodDetail(candidates.response.items[0].foodItem)
            }
            // setPassioSpeechRecognitionModel(candidates)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    onScanImage,
    passioSpeechRecognitionModel,
    loading,
    passioFoodItem,
  }
}

export default useRecognizeRemote

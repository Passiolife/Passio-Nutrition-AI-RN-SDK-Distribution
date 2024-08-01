import { useState, useCallback } from 'react'
import {
  PassioAdvisorFoodInfo,
  PassioSDK,
} from '@passiolife/nutritionai-react-native-sdk-v3'
import type { Props } from './RecognizeRemote'
import { launchImageLibrary } from 'react-native-image-picker'
import { Alert } from 'react-native'

const useRecognizeRemote = ({}: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [passioSpeechRecognitionModel, setPassioSpeechRecognitionModel] =
    useState<PassioAdvisorFoodInfo[] | null>()

  const onScanImage = useCallback(async () => {
    try {
      const { assets } = await launchImageLibrary({ mediaType: 'photo' })
      if (assets) {
        setLoading(true)
        setPassioSpeechRecognitionModel(null)
        PassioSDK.recognizeImageRemote(
          assets?.[0].uri?.replace('file://', '') ?? '',
          undefined,
          'RES_512'
        )
          .then(async (candidates) => {
            setPassioSpeechRecognitionModel(candidates)
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

export default useRecognizeRemote

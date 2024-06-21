import React, { useCallback, useState } from 'react'
import {
  StyleSheet,
  View,
  Image,
  Text,
  Pressable,
  Modal,
  ImageBackground,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native'
import { FoodDetectionView } from './detailScan/FoodDetectionView'
import { SDKStatus, useCameraAuthorization, usePassioSDK } from './App.hooks'
import { launchImageLibrary } from 'react-native-image-picker'
import { FoodSearchView } from './search'
import { MultiScanView } from './multiScan/MultiScanView'
import { QuickScanningScreen } from './quick/QuickScanningScreen'
import {
  PassioSDK,
  type PassioFoodItem,
} from '@passiolife/nutritionai-react-native-sdk-v3'
import FoodDetail from './editor/FoodDetail'
import { FoodSuggestion } from './suggestion'
import { MealPlan } from './mealPlan'
import { NutritionFactScreen } from './nutritionFact/NutritionFactScreen'
import { RecognizeImageRemote } from './recognizeImageRemote'
import { RecognizeTextRemote } from './recognizeTextRemote'
import { LegacyAPITest } from './legacyAPITest'
import { ChatScreen } from './chat'

type ViewType =
  | 'Scan'
  | 'Search'
  | 'MultiScan'
  | 'Home'
  | 'Quick'
  | 'Suggestion'
  | 'MealPlan'
  | 'NutritionFact'
  | 'recognizeImageRemote'
  | 'recognizeTextRemote'
  | 'legacyAPI'
  | 'Chat'

const logo = require('./assets/passio_logo.png')

export const LoadingContainerView = () => {
  const [viewType, setViewType] = useState<ViewType>('Home')
  const [loading, setLoading] = useState(false)
  const cameraAuthorized = useCameraAuthorization()

  const sdkStatus = usePassioSDK({
    key: 'PASSIO_KEY',
    autoUpdate: true,
  })

  const [passioFoodItem, setPassioFoodItem] = useState<PassioFoodItem | null>(
    null
  )

  const onStart = useCallback(() => {
    setViewType('Scan')
  }, [])

  const onBackToHome = useCallback(() => {
    setViewType('Home')
  }, [])

  const onRecognizeImageRemote = useCallback(() => {
    setViewType('recognizeImageRemote')
  }, [])

  const onRecognizeTextRemote = useCallback(() => {
    setViewType('recognizeTextRemote')
  }, [])

  const onLegacyAPI = useCallback(() => {
    setViewType('legacyAPI')
  }, [])

  const onScanImage = useCallback(async () => {
    try {
      const { assets } = await launchImageLibrary({ mediaType: 'photo' })
      if (assets) {
        setLoading(true)
        PassioSDK.detectFoodFromImageURI(
          assets?.[0].uri?.replace('file://', '') ?? ''
        )
          .then(async (candidates) => {
            const max = candidates?.detectedCandidates?.reduce(function (
              prev,
              current
            ) {
              return prev && prev.confidence > current.confidence
                ? prev
                : current
            })

            if (max) {
              if (max.passioID) {
                const result = await PassioSDK.fetchFoodItemForPassioID(
                  max.passioID
                )
                setPassioFoodItem(result)
              } else {
              }
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

  const onSearchFood = useCallback(() => {
    setViewType('Search')
  }, [])

  const onSuggestion = useCallback(() => {
    setViewType('Suggestion')
  }, [])

  const onMealPlan = useCallback(() => {
    setViewType('MealPlan')
  }, [])
  const onChat = useCallback(() => {
    setViewType('Chat')
  }, [])

  const onNutritionFact = useCallback(() => {
    setViewType('NutritionFact')
  }, [])

  const onMultiScanning = useCallback(() => {
    setViewType('MultiScan')
  }, [])

  const onQuickScanning = useCallback(() => {
    setViewType('Quick')
  }, [])

  return (
    <>
      {(() => {
        switch (viewType) {
          case 'Scan':
            return (
              <FoodDetectionView
                onStopPressed={onBackToHome}
                onItemPress={setPassioFoodItem}
              />
            )

          case 'Search':
            return (
              <FoodSearchView
                onClose={onBackToHome}
                onFoodDetail={setPassioFoodItem}
              />
            )
          case 'Suggestion':
            return (
              <FoodSuggestion
                onClose={onBackToHome}
                onFoodDetail={setPassioFoodItem}
              />
            )

          case 'MultiScan':
            return (
              <MultiScanView
                onClose={onBackToHome}
                onFoodDetail={setPassioFoodItem}
              />
            )

          case 'Quick':
            return (
              <QuickScanningScreen
                onClose={onBackToHome}
                onFoodDetail={setPassioFoodItem}
              />
            )
          case 'recognizeImageRemote':
            return (
              <RecognizeImageRemote
                onClose={onBackToHome}
                onFoodDetail={setPassioFoodItem}
              />
            )
          case 'recognizeTextRemote':
            return (
              <RecognizeTextRemote
                onClose={onBackToHome}
                onFoodDetail={setPassioFoodItem}
              />
            )
          case 'legacyAPI':
            return (
              <LegacyAPITest
                onClose={onBackToHome}
                onFoodDetail={setPassioFoodItem}
              />
            )

          case 'NutritionFact':
            return <NutritionFactScreen onClose={onBackToHome} />

          case 'MealPlan':
            return (
              <MealPlan
                onClose={onBackToHome}
                onFoodDetail={setPassioFoodItem}
              />
            )
          case 'Chat':
            return <ChatScreen onClose={onBackToHome} />

          default:
            // Handle invalid viewType or provide a default view
            return (
              <LoadingView
                status={sdkStatus.loadingState}
                cameraAuthorized={cameraAuthorized}
                fileLeft={sdkStatus.leftFile}
                onPressStart={onStart}
                imageUri={''}
                loading={loading}
                onScanImagePress={onScanImage}
                onSearchFood={onSearchFood}
                onMultiScanning={onMultiScanning}
                onQuickScanning={onQuickScanning}
                onSuggestion={onSuggestion}
                onMealPlan={onMealPlan}
                onNutritionFact={onNutritionFact}
                onRecognizeImageRemote={onRecognizeImageRemote}
                onRecognizeTextRemote={onRecognizeTextRemote}
                onLegacyAPI={onLegacyAPI}
                onChat={onChat}
              />
            )
        }
      })()}
      <Modal visible={passioFoodItem !== null}>
        {passioFoodItem ? (
          <FoodDetail
            onClose={() => {
              setPassioFoodItem(null)
            }}
            passioFoodItem={passioFoodItem}
          />
        ) : null}
      </Modal>
    </>
  )
}

const FeatureButton = ({
  title,
  onClick,
}: {
  title: string
  onClick: () => void
}) => {
  return (
    <Pressable style={styles.buttonContainer} onPress={onClick}>
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  )
}

const LoadingView = (props: {
  status: SDKStatus
  cameraAuthorized: boolean
  loading: boolean
  fileLeft: number | null
  onPressStart: () => void
  imageUri: string
  onScanImagePress: () => void
  onSearchFood: () => void
  onSuggestion: () => void
  onMealPlan: () => void
  onNutritionFact: () => void
  onRecognizeImageRemote: () => void
  onRecognizeTextRemote: () => void
  onLegacyAPI: () => void
  onMultiScanning: () => void
  onQuickScanning: () => void
  onChat: () => void
}) => {
  return (
    <ImageBackground
      source={require('./assets/splash.png')}
      style={styles.container}
    >
      <Image
        source={logo}
        style={styles.logo}
        resizeMode="contain"
        resizeMethod="resize"
      />
      <ScrollView>
        <View style={styles.actions}>
          {props.status === 'downloading' ? (
            <Text>{`'Downloading models... `}</Text>
          ) : null}
          {props.status === 'error' ? <Text>{'Error!'}</Text> : null}
          {props.fileLeft !== null && props.fileLeft !== 0 ? (
            <Text>{`Downloading file lefts... ${props.fileLeft}`}</Text>
          ) : null}

          {props.status === 'ready' ? (
            <>
              <View style={styles.space} />
              <FeatureButton title="Text Search" onClick={props.onSearchFood} />
              {props.status === 'ready' && props.cameraAuthorized ? (
                <>
                  <FeatureButton
                    title="Food Scanner"
                    onClick={props.onPressStart}
                  />
                  <FeatureButton
                    title="Quick Scan"
                    onClick={props.onQuickScanning}
                  />
                  <FeatureButton
                    title="Nutrition Label Scan"
                    onClick={props.onNutritionFact}
                  />
                  <FeatureButton
                    title="Recognize Text Remote"
                    onClick={props.onRecognizeTextRemote}
                  />
                  <FeatureButton
                    title="Recognize Image Remote"
                    onClick={props.onRecognizeImageRemote}
                  />
                  <FeatureButton
                    title="Multi Scan (Only visual food)"
                    onClick={props.onMultiScanning}
                  />
                  <FeatureButton
                    title="LegacyAPI"
                    onClick={props.onLegacyAPI}
                  />
                </>
              ) : null}
              <FeatureButton
                title="Meal Suggestion"
                onClick={props.onSuggestion}
              />
              <FeatureButton
                title={props.loading ? 'Please wait, Loading...' : 'Pick Image'}
                onClick={props.onScanImagePress}
              />
              <FeatureButton title="Meal Plan" onClick={props.onMealPlan} />
              <FeatureButton title="Chat" onClick={props.onChat} />
            </>
          ) : null}
        </View>
      </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(79, 70, 229, 1)',
  },
  loader: {
    position: 'absolute',
    backgroundColor: 'white',
    top: Dimensions.get('window').height / 2,
    bottom: 0,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    height: 150,
    padding: 16,
    right: 0,
    left: 0,
  },
  logo: {
    height: 150,
    width: 300,
    alignSelf: 'center',
    marginVertical: 32,
  },
  actions: {
    flex: 1,
  },
  buttonContainer: {
    padding: 16,
    flexDirection: 'row',
    borderRadius: 12,
    marginHorizontal: 16,
    borderColor: 'blue',
    backgroundColor: 'rgba(0, 0, 0, 0.50)',
    borderWidth: 2,
    shadowOffset: { width: 0, height: 0.1 },
    shadowOpacity: 0.5,
    shadowRadius: 0.5,
    marginVertical: 6,
  },
  buttonText: {
    flex: 1,
    color: 'white',
    fontWeight: '600',
  },
  space: {
    margin: 10,
  },
})

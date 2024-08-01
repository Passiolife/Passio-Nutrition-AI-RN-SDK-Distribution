import type {
  ConfigurationOptions,
  FoodDetectionEvent,
  PassioID,
  Barcode,
  RefCode,
  PassioStatus,
  FoodDetectionConfig,
  PackagedFoodCode,
  CompletedDownloadingFile,
  DownloadModelCallBack,
  DownloadingError,
  FoodCandidates,
  PassioNutrient,
  PassioFoodDataInfo,
  UnitMass,
  DetectedCandidate,
  NutritionDetectionEvent,
  PassioAccountListener,
  PassioTokenBudget,
  PassioCameraZoomLevel,
} from '../models'
import type {
  Callback,
  PassioSDKInterface,
  Subscription,
} from './PassioSDKInterface'
import { NativeModules, NativeEventEmitter, Platform } from 'react-native'
import { requestAndroidCameraPermission } from './Permissions'
import type {
  PassioFoodItem,
  PassioNutrients,
  PassioSearchResult,
  PassioMealTime,
  PassioMealPlan,
  PassioMealPlanItem,
  PassioAdvisorFoodInfo,
  PassioSpeechRecognitionModel,
  PassioImageResolution,
  PassioFetchAdvisorInfoResult,
} from '..'
import { PassioFoodItemNutrients } from '../models/v3/Nutrients'

const { PassioSDKBridge } = NativeModules

export const PassioSDK: PassioSDKInterface = {
  async configure(options: ConfigurationOptions): Promise<PassioStatus> {
    if (!sdkIsSupported()) {
      console.warn('Passio SDK not supported on this OS version')
      throw new Error('Passio SDK not supported on this OS version')
    }
    const debugMode = options.debugMode
      ? Platform.select({
          ios: 31418,
          android: -333,
        })
      : 0
    const autoUpdate = options.autoUpdate || false
    const modelURLs = options.localModelURLs || null

    return PassioSDKBridge.configure(
      options.key,
      debugMode,
      autoUpdate,
      modelURLs
    )
  },

  setAccountListener({ onTokenBudgetUpdate }: PassioAccountListener): Callback {
    const emitter =
      Platform.OS === 'ios'
        ? new NativeEventEmitter(PassioSDKBridge)
        : new NativeEventEmitter()

    PassioSDKBridge.accountUsageUpdates()

    const tokenBudgetUpdatedListener = emitter.addListener(
      'tokenBudgetUpdated',
      (event) => {
        onTokenBudgetUpdate(event as PassioTokenBudget)
      }
    )
    return {
      remove: () => {
        tokenBudgetUpdatedListener.remove()
      },
    }
  },

  onDownloadingPassioModelCallBacks({
    completedDownloadingFile,
    downloadingError,
  }: DownloadModelCallBack): Callback {
    const emitter =
      Platform.OS === 'ios'
        ? new NativeEventEmitter(PassioSDKBridge)
        : new NativeEventEmitter()

    const downloadingErrorListener = emitter.addListener(
      'downloadingError',
      (event) => {
        downloadingError(event as DownloadingError)
      }
    )
    const completedDownloadingFileListener = emitter.addListener(
      'completedDownloadingFile',
      (event) => {
        completedDownloadingFile(event as CompletedDownloadingFile)
      }
    )
    return {
      remove: () => {
        completedDownloadingFileListener.remove()
        downloadingErrorListener.remove()
      },
    }
  },

  async requestCameraAuthorization(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      return PassioSDKBridge.requestCameraAuthorization()
    } else {
      return requestAndroidCameraPermission()
    }
  },

  startFoodDetection(
    options: FoodDetectionConfig,
    callback: (detection: FoodDetectionEvent) => void
  ): Subscription {
    const emitter =
      Platform.OS === 'ios'
        ? new NativeEventEmitter(PassioSDKBridge)
        : new NativeEventEmitter()
    const subscription = emitter.addListener('onFoodDetection', (event) => {
      try {
        callback(event as FoodDetectionEvent)
      } catch (err) {
        console.error('Error in Passio food detection callback: ', err)
      }
    })
    const {
      detectBarcodes,
      detectPackagedFood,
      volumeDetectionMode,
      detectVisual,
    } = options
    if (Platform.OS === 'ios') {
      PassioSDKBridge.startFoodDetection(
        detectBarcodes,
        detectPackagedFood,
        volumeDetectionMode ?? 'auto',
        detectVisual ?? true
      )
    } else {
      PassioSDKBridge.startFoodDetection(
        detectBarcodes,
        detectPackagedFood, //ocr required for nutrition fact scanning
        detectVisual ?? true
      )
    }

    return {
      remove: () => {
        PassioSDKBridge.stopFoodDetection()
        subscription.remove()
      },
    }
  },

  startNutritionFactsDetection(
    callback: (detection: NutritionDetectionEvent) => void
  ): Subscription {
    const emitter =
      Platform.OS === 'ios'
        ? new NativeEventEmitter(PassioSDKBridge)
        : new NativeEventEmitter()
    const subscription = emitter.addListener(
      'NutritionFactsRecognitionListener',
      (event) => {
        try {
          callback(event as NutritionDetectionEvent)
        } catch (err) {
          console.error('Error in Passio nutrition detection callback: ', err)
        }
      }
    )
    PassioSDKBridge.startNutritionFactsDetection()
    return {
      remove: () => {
        PassioSDKBridge.stopNutritionFactsDetection()
        subscription.remove()
      },
    }
  },

  async enableFlashlight(enabled: boolean, torchLevel?: number): Promise<void> {
    if (Platform.OS === 'ios') {
      return PassioSDKBridge.enableFlashlight(enabled, torchLevel ?? 1.0)
    } else {
      return PassioSDKBridge.enableFlashlight(enabled)
    }
  },

  async setCameraZoomLevel(zoomLevel: number): Promise<void> {
    return PassioSDKBridge.setCameraVideoZoom(zoomLevel)
  },

  async getMinMaxCameraZoomLevel(): Promise<PassioCameraZoomLevel> {
    return PassioSDKBridge.getMinMaxCameraZoomLevel()
  },

  async fetchFoodItemForPassioID(
    passioID: PassioID
  ): Promise<PassioFoodItem | null> {
    return PassioSDKBridge.fetchFoodItemForPassioID(passioID)
  },

  async fetchFoodItemForRefCode(
    refCode: RefCode
  ): Promise<PassioFoodItem | null> {
    return PassioSDKBridge.fetchFoodItemForRefCode(refCode)
  },

  async fetchFoodItemForProductCode(
    code: Barcode | PackagedFoodCode
  ): Promise<PassioFoodItem | null> {
    return PassioSDKBridge.fetchFoodItemForProductCode(code)
  },

  async fetchFoodItemLegacy(
    passioID: PassioID
  ): Promise<PassioFoodItem | null> {
    return PassioSDKBridge.fetchFoodItemLegacy(passioID)
  },

  async recognizeSpeechRemote(
    text: string
  ): Promise<PassioSpeechRecognitionModel[] | null> {
    return PassioSDKBridge.recognizeSpeechRemote(text)
  },

  async recognizeImageRemote(
    imageUri: string,
    message?: string,
    resolution?: PassioImageResolution
  ): Promise<PassioAdvisorFoodInfo[] | null> {
    try {
      return PassioSDKBridge.recognizeImageRemote(
        imageUri,
        message,
        resolution ?? 'RES_512'
      )
    } catch (err) {
      return Promise.reject(err)
    }
  },

  async searchForFood(searchQuery: string): Promise<PassioSearchResult | null> {
    return PassioSDKBridge.searchForFood(searchQuery)
  },

  async fetchSuggestions(
    mealTime: PassioMealTime
  ): Promise<PassioFoodDataInfo[] | null> {
    return PassioSDKBridge.fetchSuggestions(mealTime)
  },

  getNutrientsOfPassioFoodItem(
    passioFoodItem: PassioFoodItem,
    weight: UnitMass
  ): PassioNutrients {
    return new PassioFoodItemNutrients(passioFoodItem).nutrients(weight)
  },

  getNutrientsSelectedSizeOfPassioFoodItem(
    passioFoodItem: PassioFoodItem
  ): PassioNutrients {
    return new PassioFoodItemNutrients(passioFoodItem).nutrientsSelectedSize()
  },

  getNutrientsReferenceOfPassioFoodItem(
    passioFoodItem: PassioFoodItem
  ): PassioNutrients {
    return new PassioFoodItemNutrients(passioFoodItem).nutrientsReference()
  },

  async detectFoodFromImageURI(
    imageUri: string
  ): Promise<FoodCandidates | null> {
    try {
      return PassioSDKBridge.detectFoodFromImageURI(imageUri)
    } catch (err) {
      return Promise.reject(err)
    }
  },

  addToPersonalization(
    visualCandidate: DetectedCandidate,
    alternative: DetectedCandidate
  ): boolean {
    const visualCandidateJSON = JSON.stringify(visualCandidate)
    const alternativeJSON = JSON.stringify(alternative)
    return PassioSDKBridge.addToPersonalization(
      visualCandidateJSON,
      alternativeJSON
    )
  },

  async fetchTagsForPassioID(passioID: PassioID): Promise<string[]> {
    const attributes = await PassioSDKBridge.getAttributesForPassioID(
      passioID
    ).catch(() => {
      Promise.reject('Error fetching attributes for passioID')
    })
    if (attributes?.foodItem?.tags) {
      return attributes?.foodItem?.tags
    }
    const fetchedTags = await PassioSDKBridge.fetchTagsFor(
      `${attributes?.foodItem?.passioID}`
    ).catch(() => {
      Promise.reject('Error fetching tags for passioID')
    })
    return fetchedTags
  },

  fetchNutrientsFor: function (
    passioID: string
  ): Promise<PassioNutrient[] | null> {
    return PassioSDKBridge.fetchNutrientsFor(passioID)
  },

  async fetchFoodItemForDataInfo(
    queryResult: PassioFoodDataInfo,
    weightGram?: number
  ): Promise<PassioFoodItem | null> {
    // -1 is considered an invalid value for weight in grams.
    if (Platform.OS === 'android') {
      return PassioSDKBridge.fetchFoodItemForDataInfo(
        queryResult,
        weightGram ?? -1
      )
    } else {
      return PassioSDKBridge.fetchFoodItemForDataInfo(
        JSON.stringify(queryResult),
        (weightGram ?? -1).toString()
      )
    }
  },
  async fetchMealPlans(): Promise<PassioMealPlan[] | null> {
    return PassioSDKBridge.fetchMealPlans()
  },

  fetchMealPlanForDay: function (
    mealPlanLabel: string,
    day: number
  ): Promise<PassioMealPlanItem[] | null> {
    return PassioSDKBridge.fetchMealPlanForDay(mealPlanLabel, day)
  },

  async fetchHiddenIngredients(
    foodName: string
  ): Promise<PassioFetchAdvisorInfoResult> {
    return PassioSDKBridge.fetchHiddenIngredients(foodName)
  },

  async fetchVisualAlternatives(
    foodName: string
  ): Promise<PassioFetchAdvisorInfoResult> {
    return PassioSDKBridge.fetchVisualAlternatives(foodName)
  },

  async fetchPossibleIngredients(
    foodName: string
  ): Promise<PassioFetchAdvisorInfoResult> {
    return PassioSDKBridge.fetchVisualAlternatives(foodName)
  },

  stopCamera() {
    return PassioSDKBridge.stopCamera()
  },
}

function sdkIsSupported(): boolean {
  if (Platform.OS === 'ios') {
    const majorVersionIOS = parseInt(Platform.Version as string, 10)
    return majorVersionIOS >= 13
  }
  if (Platform.OS === 'android') {
    const androidVersion = Number(Platform.Version)
    return androidVersion >= 21
  }
  return false
}

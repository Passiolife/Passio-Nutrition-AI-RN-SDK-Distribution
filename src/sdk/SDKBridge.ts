import type {
  UPCProduct,
  ConfigurationOptions,
  FoodDetectionEvent,
  PassioID,
  PassioIDAttributes,
  PassioIDEntityType,
  Barcode,
  PassioStatus,
  FoodDetectionConfig,
  FoodSearchResult,
  PackagedFoodCode,
  CompletedDownloadingFile,
  DownloadModelCallBack,
  DownloadingError,
  FoodCandidates,
  PersonalizedAlternative,
} from '../models'
import type {
  Callback,
  PassioSDKInterface,
  Subscription,
} from './PassioSDKInterface'
import { NativeModules, NativeEventEmitter, Platform } from 'react-native'
import { requestAndroidCameraPermission } from './Permissions'

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

  onDowloadingPassioModelCallBacks({
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
    const { detectBarcodes, detectPackagedFood, detectNutritionFacts } = options
    PassioSDKBridge.startFoodDetection(
      detectBarcodes,
      detectPackagedFood || detectNutritionFacts, //ocr required for nutrition fact scanning
      detectNutritionFacts
    )
    return {
      remove: () => {
        PassioSDKBridge.stopFoodDetection()
        subscription.remove()
      },
    }
  },

  async getAttributesForPassioID(
    passioID: PassioID
  ): Promise<PassioIDAttributes | null> {
    return PassioSDKBridge.getAttributesForPassioID(passioID)
  },

  async fetchAttributesForBarcode(
    barcode: Barcode
  ): Promise<PassioIDAttributes | null> {
    return PassioSDKBridge.fetchAttributesForBarcode(barcode)
  },

  async fetchPassioIDAttributesForPackagedFood(
    packagedFoodCode: PackagedFoodCode
  ): Promise<PassioIDAttributes | null> {
    return PassioSDKBridge.fetchPassioIDAttributesForPackagedFood(
      packagedFoodCode
    )
  },

  async searchForFood(searchQuery: string): Promise<FoodSearchResult[]> {
    return PassioSDKBridge.searchForFood(searchQuery)
  },

  async convertUPCProductToAttributes(
    product: UPCProduct,
    entityType: PassioIDEntityType
  ): Promise<PassioIDAttributes | null> {
    try {
      const json = JSON.stringify(product)
      return PassioSDKBridge.convertUPCProductToAttributes(json, entityType)
    } catch (err) {
      return Promise.reject(err)
    }
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
    personalizedAlternative: PersonalizedAlternative
  ): boolean {
    const json = JSON.stringify(personalizedAlternative)
    return PassioSDKBridge.addToPersonalization(json)
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

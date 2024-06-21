import type {
  PassioFoodItem,
  PassioNutrients,
  PassioSearchResult,
  PassioMealTime,
  PassioMealPlan,
  PassioMealPlanItem,
  PassioSpeechRecognitionModel,
  PassioAdvisorFoodInfo,
  PassioImageResolution,
  PassioFetchAdvisorInfoResult,
} from '..'
import type {
  Barcode,
  ConfigurationOptions,
  DownloadModelCallBack,
  FoodCandidates,
  FoodDetectionConfig,
  FoodDetectionEvent,
  PassioFoodDataInfo,
  PackagedFoodCode,
  PassioID,
  PassioNutrient,
  PassioStatus,
  UnitMass,
  RefCode,
  DetectedCandidate,
  NutritionDetectionEvent,
} from '../models'

export interface PassioSDKInterface {
  /**
   * Configure the SDK with the given options.
   *
   * @param options - The configuration options
   * @returns A `Promise` resolving with a `PassioStatus` indicating the current state of the SDK.
   */
  configure(options: ConfigurationOptions): Promise<PassioStatus>

  /**
   * Prompt the user for camera authorization if not already granted.
   * @remarks Your app's Info.plist must inclue an `NSCameraUsageDescription` value or this method will crash.
   * @returns A `Promise` resolving to `true` if authorization has been granted or `false` if not.
   */
  requestCameraAuthorization(): Promise<boolean>

  /**
   * Begin food detection using the device's camera.
   * @param options - An object to determine which types of scanning should be performed.
   * @param callback - A callback to repeatedly receive food detection events as they occur.
   * @returns A `Subscription` that should be retained by the caller while food detection is running. Call `remove` on the subscription to terminate food detection.
   */
  startFoodDetection(
    options: FoodDetectionConfig,
    callback: (detection: FoodDetectionEvent) => void
  ): Subscription

  /**
   * Begin nutrition fact label detection using the device's camera.
   * @param callback - A callback to repeatedly receive nutrition detection events as they occur.
   * @returns A `Subscription` that should be retained by the caller while nutrition detection is running. Call `remove` on the subscription to terminate nutrition detection.
   * NOTE: IOS:  <DetectionCameraView style={styles.detectionCamera} volumeDetectionMode='none' />
   */
  startNutritionFactsDetection(
    callback: (detection: NutritionDetectionEvent) => void
  ): Subscription

  /**
   * Look up the food item result for a given Passio ID.
   * @param passioID - The Passio ID for the  query.
   * @returns A `Promise` resolving to a `PassioFoodItem` object if the record exists in the database or `null` if not.
   */
  fetchFoodItemForPassioID(passioID: PassioID): Promise<PassioFoodItem | null>

  /**
   * Look up the food item result for a given refCode.
   * @param refCode - The refCode for the  query.
   * @returns A `Promise` resolving to a `PassioFoodItem` object if the record exists in the database or `null` if not.
   */
  fetchFoodItemForRefCode(refCode: RefCode): Promise<PassioFoodItem | null>

  /**
   * Look up the food item result for a given by barcode or packagedFoodCode.
   * @param barcode  - barcode for the  query.
   * or
   * @param packageFoodCode  - packageFoodCode for the query.
   * @returns A `Promise` resolving to a `PassioFoodItem` object if the record exists in the database or `null` if not.
   */
  fetchFoodItemForProductCode(
    code: Barcode | PackagedFoodCode
  ): Promise<PassioFoodItem | null>

  /**
   * Fetch PassioFoodItem for a v2 PassioID
   * @param passioID  - passioID for the query.
   * @returns A `Promise` resolving to a `PassioFoodItem` object if the record exists in the database or `null` if not.
   */
  fetchFoodItemLegacy(passioID: PassioID): Promise<PassioFoodItem | null>

  /**
   * Data info of the search food with a given search result.
   * @param passioFoodDataInfo - Provide `PassioFoodDataInfo` object get `PassioFoodItem` detail.
   * @returns A `Promise` resolving to `PassioFoodItem` detail.
   */
  fetchFoodItemForDataInfo(
    passioFoodDataInfo: PassioFoodDataInfo
  ): Promise<PassioFoodItem | null>

  /**
   * this method to fetch PassioAdvisorFoodInfo using Image (local image uri)
   * @param imageUri - The image uri for recognizing Food.
   * @returns A `Promise` resolving to a `PassioAdvisorFoodInfo` array or `null`.
   */

  /**
   * Search the database of foods with a given search term.
   * @param searchQuery - The search term to match against food item names.
   * @returns A `Promise` resolving to an array of food item names.
   */
  searchForFood(searchQuery: string): Promise<PassioSearchResult | null>

  /**
   * Retrieving food info using image uri,
   * Smaller resolutions will result in faster response times
   * while higher resolutions should provide more accurate results
   * @param imageUri - local image uri.
   * @param resolution - enables the caller to set the target resolution of the image uploaded to the server
   * @returns A `Promise` resolving to an array of `PassioAdvisorFoodInfo`.
   */

  recognizeImageRemote(
    imageUri: string,
    resolution?: PassioImageResolution
  ): Promise<PassioAdvisorFoodInfo[] | null>

  /**
   * Use this method to fetch PassioSpeechRecognitionModel using speech.
   * @param text - Text for recognizing food logging actions
   * @returns A `Promise` resolving to `PassioSpeechRecognitionModel` list.
   */
  recognizeSpeechRemote(
    text: string
  ): Promise<PassioSpeechRecognitionModel[] | null>

  /**
   * This method indicating downloading file status if model download from passio server.
   * @param callback - A callback to receive for downloading file lefts from queue.
   * @param callback - A callback to receive download file failed for some reason.
   * @returns A `Callback` that should be retained by the caller while downloading is running. Call `remove` on the callback to terminate listeners and relase from memory.
   */
  onDownloadingPassioModelCallBacks: (
    downloadModelCallBack: DownloadModelCallBack
  ) => Callback

  /**
   * This method detect food from image uri.
   * @param imageUri - The image uri to detect food.
   * @returns A `Promise` resolving to a `FoodCandidates` object if the record exists in the database or `null` if not.
   */
  detectFoodFromImageURI(imageUri: string): Promise<FoodCandidates | null>

  /**
   * This method adds personalized alternative to local database.
   * Status: This method is experimental and only available in the iOS SDK.
   * @param personalizedAlternative - The personalized alternative to add.
   * @returns A `boolean` value indicating if the personalized alternative was added successfully.
   */
  addToPersonalization(
    visualCandidate: DetectedCandidate,
    alternative: DetectedCandidate
  ): boolean

  /**
   * This method fetches tags for a given Passio ID.
   * @param passioID - The Passio ID for the tags query.
   * @returns A `string` array of tags if the record exists in the database or `null` if not.
   */
  fetchTagsForPassioID(passioID: PassioID): Promise<string[]>

  /**
   * fetch a map of nutrients for a 100 grams of a specific food item
   * @param passioID - The Passio ID for the attributes query.
   * @returns A `Promise` resolving to a `PassioNutrient` object if the record exists in the database or `null` if not.
   */
  fetchNutrientsFor(passioID: PassioID): Promise<PassioNutrient[] | null>

  /**
   * It retrieves all the nutrients by summing the reference nutrients of ingredients with the help of selectedUnit and selectedQuantity
   * @param passioFoodItem - The passioFoodItem for the attributes query.
   * @param weight - The weight for the query.
   * @returns "PassioNutrients" encompass all the nutrients found in a food item.
   */
  getNutrientsOfPassioFoodItem(
    passioFoodItem: PassioFoodItem,
    weight: UnitMass
  ): PassioNutrients

  /**
   * It retrieves all the nutrients by summing the reference nutrients of ingredients with the help of default selectedUnit and selectedQuantity
   * @param passioFoodItem - The passioFoodItem for the attributes query.
   * @returns "PassioNutrients" encompass all the nutrients found in a food item.
   */

  getNutrientsSelectedSizeOfPassioFoodItem(
    passioFoodItem: PassioFoodItem
  ): PassioNutrients

  /**
   * It retrieves all the nutrients by summing the reference nutrients of ingredients with the help of 100 gram sering unit and quantity
   * @param passioFoodItem - The passioFoodItem for the attributes query.
   * @returns "PassioNutrients" encompass all the nutrients found in a food item.
   */
  getNutrientsReferenceOfPassioFoodItem(
    passioFoodItem: PassioFoodItem
  ): PassioNutrients

  /**
   * fetch a suggestions for particular meal time  'breakfast' | 'lunch' | 'dinner' | 'snack' and returning results.
   * @param mealTime - 'breakfast' | 'lunch' | 'dinner' | 'snack',
   * @returns A `Promise` resolving to a `PassioFoodDataInfo` array if the record exists in the database or `null` if not.
   */
  fetchSuggestions(
    mealTime: PassioMealTime
  ): Promise<PassioFoodDataInfo[] | null>

  /**
   * fetch list of all meal Plans
   * @returns A `Promise` resolving to a `PassioMealPlan` array if the record exists in the database or `null` if not.
   */
  fetchMealPlans(): Promise<PassioMealPlan[] | null>

  /**
   * fetch list of all meal Plan item
   * @param mealPlanLabel - query for type of mealPlan.
   * @param day - for which day meal plan is needed
   * @returns A `Promise` resolving to a `PassioMealPlanItem` array if the record exists in the database or `null` if not.
   */
  fetchMealPlanForDay(
    mealPlanLabel: string,
    day: number
  ): Promise<PassioMealPlanItem[] | null>

  /**
   * fetch list of possible hidden ingredients for a given food name.
   * @param foodName - query for foodName.
   * @returns A `Promise` resolving to a `PassioFetchAdvisorInfoResult`.
   */
  fetchHiddenIngredients(
    foodName: string
  ): Promise<PassioFetchAdvisorInfoResult>

  /**
   * fetch list of possible visual alternatives for a given food name.
   * @param foodName - query for foodName.
   * @returns A `Promise` resolving to a `PassioFetchAdvisorInfoResult`.
   */
  fetchVisualAlternatives(
    foodName: string
  ): Promise<PassioFetchAdvisorInfoResult>

  /**
   * fetch list of possible ingredients if a more complex food for a given food name.
   * @param foodName - query for foodName.
   * @returns A `Promise` resolving to a `PassioFetchAdvisorInfoResult`.
   */
  fetchPossibleIngredients(
    foodName: string
  ): Promise<PassioFetchAdvisorInfoResult>
}

/**
 * A subscription that is created when food detection begins.
 * The caller must retain this object in memory and call remove
 * when detection should be terminated so resources can be released.
 * Failing to remove the subscription may result in significant
 * memory leaks.
 */
export interface Subscription {
  /**
   * Terminate the subscription and release any related resources.
   */
  remove(): void
}

export interface Callback {
  /**
   * Terminate the callback and release the attached listener.
   */
  remove(): void
}

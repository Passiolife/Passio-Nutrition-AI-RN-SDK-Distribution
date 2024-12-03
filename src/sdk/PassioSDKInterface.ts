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
  PassioResult,
  PassioReport,
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
  PassioAccountListener,
  PassioCameraZoomLevel,
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
   * Added support for localized content.
   * with a two digit ISO 639-1 language code will transform the food names and serving sizes in the SDK responses
   *
   * @param languageCode - with a two digit ISO 639-1 language code
   */
  updateLanguage(languageCode: string): Promise<Boolean>

  /**
   * setAccountListener to track account usage updates. Used to monitor total monthly
   * tokens, used tokens and how many tokens the last request used.
   */
  setAccountListener: (passioAccountListener: PassioAccountListener) => Callback

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
   * Use this method to turn Flashlight on/off.
   * @param enabled - Pass true to turn flashlight on or pass false to turn in off.
   * @param torchLevel - Only Available for IOS, Sets the illumination level when in Flashlight mode.
   * This value must be a floating-point number between 0.0 and 1.0 default is 1.0.
   */
  enableFlashlight(enabled: boolean, torchLevel?: number): void

  /**
   * Use this function if you want to change zoom level of SDK's camera
   * @param zoomLevel - Level of zoom. Allowed values range from 1.0 (full field of view) to the value of the active format’s of device.
   */
  setCameraZoomLevel(zoomLevel: number): void

  /**
   * Use this property to get Min and Max available VideoZoomFactor for camera
   */
  getMinMaxCameraZoomLevel(): Promise<PassioCameraZoomLevel>

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
   * Data info of the food with a given result.
   * @param passioFoodDataInfo - Provide `PassioFoodDataInfo` object get `PassioFoodItem` detail.
   * @param servingQuantity - Provide `servingQuantity` number to get `PassioFoodItem` detail.
   * @param servingUnit - Provide `servingUnit` unit to get `PassioFoodItem` detail.
   * @returns A `Promise` resolving to `PassioFoodItem` detail.
   */
  fetchFoodItemForDataInfo(
    passioFoodDataInfo: PassioFoodDataInfo,
    servingQuantity?: number,
    servingUnit?: String
  ): Promise<PassioFoodItem | null>

  /**
   * Search the database of foods with a given search term.
   * @param searchQuery - The search term to match against food item names.
   * @returns A `Promise` resolving to an array of food item result.
   */
  searchForFood(searchQuery: string): Promise<PassioSearchResult | null>

  /**
   * Search for food semantic will return a list of alternate search and search result
   * @param searchQuery - User typed text.
   * @returns A `Promise` resolving to an array of food item result.
   */
  searchForFoodSemantic(searchQuery: string): Promise<PassioSearchResult | null>

  /**
   * gives a list of predicted next ingredients based on the current list of ingredients in the recipe
   * @param currentIngredients - List of food ingredients name.
   * @returns A `Promise` resolving to an array of food data info.
   */
  predictNextIngredients(
    currentIngredients: string[]
  ): Promise<PassioFoodDataInfo[] | null>

  /**
   * Retrieving food info using image uri,
   * Smaller resolutions will result in faster response times
   * while higher resolutions should provide more accurate results
   * @param imageUri - The local URI of the image.
   * @param message - An optional message to indicate the context of the image.
   * @param resolution - enables the caller to set the target resolution of the image uploaded to the server, Default is RES_512
   * @returns A `Promise` resolving to an array of `PassioAdvisorFoodInfo`.
   */

  recognizeImageRemote(
    imageUri: string,
    message?: string,
    resolution?: PassioImageResolution
  ): Promise<PassioAdvisorFoodInfo[] | null>

  /**
   * Retrieving nutrition facts using image uri,
   * Smaller resolutions will result in faster response times
   * while higher resolutions should provide more accurate results
   * @param imageUri - The local URI of the image.
   * @param resolution - enables the caller to set the target resolution of the image uploaded to the server, Default is RES_512
   * @returns A `Promise` resolving to an array of `PassioFoodItem`.
   */

  recognizeNutritionFactsRemote(
    imageUri: string,
    resolution?: PassioImageResolution
  ): Promise<PassioFoodItem | null>

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
   * This method fetches tags for a given refCode.
   * @param refCode - The refCode for the tags query.
   * @returns A `string` array of tags if the record exists in the database or `null` if not.
   */
  fetchTagsFor(refCode: RefCode): Promise<string[]>

  /**
   * fetch a map of nutrients for a 100 grams of a specific food item
   * @param refCode - The refCode for the attributes query.
   * @returns A `Promise` resolving to a `PassioNutrient` object if the record exists in the database or `null` if not.
   */
  fetchNutrientsFor(refCode: RefCode): Promise<PassioNutrient[] | null>

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

  /**
   * Use this method to report incorrect food item
   * Precondition: Either `refCode` or `productCode` must be present
   * @param refCode - Reference code of food item
   * @param productCode - Product code
   * @param notes - Note if any (optional)
   * @returns It returns `PassioResult` that can be either an `errorMessage` or the `boolean` noting the success of the operation.
   */
  reportFoodItem(report: PassioReport): Promise<PassioResult>

  /**
   * Use this method to submit User Created Food. The method will return `true` if the uploading of user food is successful
   * @param passioFoodItem - Pass ``PassioFoodItem`` to submit it to Passio
   * @returns It returns `PassioResult` that can be either an `errorMessage` or the `boolean` noting the success of the operation.
   */
  submitUserCreatedFood(passioFoodItem: PassioFoodItem): Promise<PassioResult>

  /**
   Only available on android for stop camera if available
   */
  stopCamera(): void

  /** [DEPRECATED]
   * Alternatively, use the `recognizeImageRemote` method to recognize the image
   * This method detect food from image uri.
   * @param imageUri - The image uri to detect food.
   * @returns A `Promise` resolving to a `FoodCandidates` object if the record exists in the database or `null` if not.
   */
  detectFoodFromImageURI(imageUri: string): Promise<FoodCandidates | null>
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

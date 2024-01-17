import type {
  Barcode,
  ConfigurationOptions,
  DownloadModelCallBack,
  FoodCandidates,
  FoodDetectionConfig,
  FoodDetectionEvent,
  FoodSearchResult,
  PackagedFoodCode,
  PassioID,
  PassioIDAttributes,
  PassioIDEntityType,
  PassioNutrient,
  PassioStatus,
  PersonalizedAlternative,
  UPCProduct,
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
   * Look up the nutrition attributes for a given Passio ID.
   * @param passioID - The Passio ID for the attributes query.
   * @returns A `Promise` resolving to a `PassioIDAttributes` object if the record exists in the database or `null` if not.
   */
  getAttributesForPassioID(
    passioID: PassioID
  ): Promise<PassioIDAttributes | null>

  /**
   * Query Passio's UPC web service for nutrition attributes of a given barcode.
   * @param barcode - The barcode value for the attributes query, typically taken from a scanned `BarcodeCandidate`.
   * @returns A `Promise` resolving to a `PassioIDAttributes` object if the record exists in the database or `null` if not.
   */
  fetchAttributesForBarcode(
    barcode: Barcode
  ): Promise<PassioIDAttributes | null>

  /**
   * Query Passio's web service for nutrition attributes given an package food identifier.
   * @param packagedFoodCode - The code identifier for the attributes query, taken from the list of package food candidates on a `FoodDetectionEvent`.
   * @returns A `Promise` resolving to a `PassioIDAttributes` object if the record exists in the database or `null` if not.
   */
  fetchPassioIDAttributesForPackagedFood(
    packagedFoodCode: PackagedFoodCode
  ): Promise<PassioIDAttributes | null>

  /**
   * Search the local database of foods with a given search term.
   * @param searchQuery - The search term to match against food item names.
   * @returns A `Promise` resolving to an array of food item names.
   */
  searchForFood(searchQuery: string): Promise<FoodSearchResult[]>

  convertUPCProductToAttributes(
    product: UPCProduct,
    entityType: PassioIDEntityType
  ): Promise<PassioIDAttributes | null>

  /**
   * This method indicating downloading file status if model download from passio server.
   * @param callback - A callback to receive for dowloading file lefts from queue.
   * @param callback - A callback to receive dowload file failed for some reason.
   * @returns A `Callback` that should be retained by the caller while dowloading is running. Call `remove` on the callback to terminate listeners and relase from memory.
   */
  onDowloadingPassioModelCallBacks: (
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
    personalizedAlternative: PersonalizedAlternative
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

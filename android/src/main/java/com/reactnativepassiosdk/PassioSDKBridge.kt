package com.reactnativepassiosdk

import ai.passio.passiosdk.core.config.Bridge
import ai.passio.passiosdk.core.config.PassioConfiguration
import ai.passio.passiosdk.core.config.PassioMode
import ai.passio.passiosdk.core.config.PassioStatus
import ai.passio.passiosdk.passiofood.*
import ai.passio.passiosdk.passiofood.data.model.PassioResult
import ai.passio.passiosdk.passiofood.data.model.PassioTokenBudget
import ai.passio.passiosdk.passiofood.nutritionfacts.PassioNutritionFacts
import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.os.Handler
import android.os.Looper
import bridgeBitmap
import bridgeFoodCandidates
import bridgeInflammatoryEffectData
import bridgeNutritionFacts
import bridgePassioAdvisorFoodInfo
import bridgePassioAdvisorResultResponse
import bridgePassioMealPlan
import bridgePassioMealPlanItem
import bridgePassioResultPassioAdvisorFoodInfos
import bridgePassioSpeechRecognitionModel
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.reactnativepassiosdk.map.bridgePassioFoodDataInfoQuery
import com.reactnativepassiosdk.map.bridgePassioFoodItemMapper
import convertReadableArrayToList
import java.io.File
import java.io.FileInputStream
import java.io.IOException
import mapBridged
import mapNullable
import mapStringArray
import mapToStringArray
import org.json.JSONArray
import putIfNotNull

class PassioSDKBridge(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext), FoodRecognitionListener,
  NutritionFactsRecognitionListener, PassioAccountListener {

  override fun getName() = "PassioSDKBridge"

  private val mainHandler = Handler(Looper.getMainLooper())

  @ReactMethod
  fun configure(
    key: String,
    debugMode: Int,
    autoUpdate: Boolean,
    remoteOnly: Boolean,
    localModelURLs: ReadableArray?,
    promise: Promise,
  ) {
    mainHandler.post {
      val config = PassioConfiguration(reactApplicationContext, key).apply {
        if (localModelURLs != null) {
          this.localFiles = mapStringArray(localModelURLs) { str ->
            var uriStr = str
            if (!uriStr.startsWith("file://")) {
              uriStr = "file://$uriStr"
            }
            Uri.parse(uriStr)
          }
        } else {
          localFiles = listOf()
        }
        this.debugMode = debugMode
        this.sdkDownloadsModels = autoUpdate
        this.remoteOnly = remoteOnly
        this.bridge = Bridge.REACT_NATIVE
      }
      PassioSDK.instance.setPassioStatusListener(object : PassioStatusListener {
        override fun onCompletedDownloadingAllFiles(fileUris: List<Uri>) {
        }

        override fun onCompletedDownloadingFile(fileUri: Uri, filesLeft: Int) {
          val map = WritableNativeMap()
          map.putInt("filesLeft", filesLeft)
          sendCompletedDownloadingFileEvent(map)
        }

        override fun onDownloadError(message: String) {
          val map = WritableNativeMap()
          map.putString("message", message)
          sendDownloadingErrorEvent(map)
        }

        override fun onPassioStatusChanged(status: PassioStatus) {
          when (status.mode) {
            PassioMode.IS_DOWNLOADING_MODELS -> print("PassioSDK: auto update configured, downloading models...")
            PassioMode.IS_BEING_CONFIGURED -> {}
            PassioMode.IS_READY_FOR_DETECTION -> {
              val map = WritableNativeMap()
              map.putString("mode", "isReadyForDetection")
              map.putInt("activeModels", status.activeModels ?: 0)
              map.putArray("missingFiles", (status.missingFiles ?: listOf()).mapToStringArray())
              promise.resolve(map)
            }

            PassioMode.NOT_READY -> {
              val map = WritableNativeMap()
              map.putString("mode", "notReady")
              map.putArray("missingFiles", (status.missingFiles ?: listOf()).mapToStringArray())
              promise.resolve(map)
            }

            PassioMode.FAILED_TO_CONFIGURE -> {
              val error = status.error
              val errorMessage = if (error != null) {
                reactApplicationContext.resources.getString(error.errorRes)
              } else {
                "unknown"
              }
              val map = WritableNativeMap()
              map.putString("mode", "error")
              map.putString("errorMessage", errorMessage)
              promise.resolve(map)
            }
          }
        }
      })
      PassioSDK.instance.configure(config) { }
    }
  }

  private fun sentConfigureModeStatusEvent(args: ReadableMap) {
    val emitter =
      reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
    emitter.emit("onPassioStatusChanged", args)
  }

  @ReactMethod
  fun startFoodDetection(
    detectBarcodes: Boolean,
    detectPackagedFood: Boolean,
    detectVisual: Boolean? = true,
  ) {
    mainHandler.post {
      val config = FoodDetectionConfiguration(
        detectBarcodes = detectBarcodes,
        detectVisual = detectVisual ?: true,
        detectPackagedFood = detectPackagedFood
      )
      // The function will return false if the registration of the ```foodRecognitionListener``` failed.
      PassioSDK.instance.startFoodDetection(this, config)
    }
  }

  @ReactMethod
  fun stopFoodDetection() {
    // The function will return false if the unregistration of the current ```foodRecognitionListener``` failed.
    PassioSDK.instance.stopFoodDetection()
  }

  @ReactMethod
  fun startNutritionFactsDetection() {
    mainHandler.post {
      PassioSDK.instance.startNutritionFactsDetection(this)
    }
  }

  @ReactMethod
  fun stopNutritionFactsDetection() {
    PassioSDK.instance.stopNutritionFactsDetection()
  }

  @ReactMethod
  fun fetchFoodItemForPassioID(passioID: String, promise: Promise) {
    PassioSDK.instance.fetchFoodItemForPassioID(passioID) { attributes ->
      if (attributes === null) {
        promise.resolve(null)
      } else {
        val map = bridgePassioFoodItem(attributes)
        promise.resolve(map)
      }
    }
  }

  @ReactMethod
  fun fetchFoodItemForProductCode(barcode: String, promise: Promise) {
    PassioSDK.instance.fetchFoodItemForProductCode(barcode) { attributes ->
      val mapped = mapNullable(attributes, ::bridgePassioFoodItem)
      promise.resolve(mapped)
    }
  }

  @ReactMethod
  fun fetchFoodItemLegacy(passioID: String, promise: Promise) {
    PassioSDK.instance.fetchFoodItemLegacy(passioID) { attributes ->
      val mapped = mapNullable(attributes, ::bridgePassioFoodItem)
      promise.resolve(mapped)
    }
  }

  @ReactMethod
  fun fetchSuggestions(mealTime: String, promise: Promise) {
    PassioSDK.instance.fetchSuggestions(PassioMealTime.valueOf(mealTime.uppercase())) { result ->
      val array = WritableNativeArray()
      for (item in result) {
        array.pushMap(bridgePassioFoodDataInfo(item))
      }
      promise.resolve(array)
    }
  }

  @ReactMethod
  fun searchForFood(searchQuery: String, promise: Promise) {
    PassioSDK.instance.searchForFood(term = searchQuery, callback = { results, alternatives ->
      val map = WritableNativeMap()
      val mapAlternatives = alternatives.mapToStringArray()
      val mapPassioSearchResult = results.mapBridged(::bridgePassioFoodDataInfo)
      map.putIfNotNull("results", mapPassioSearchResult)
      map.putIfNotNull("alternatives", mapAlternatives)
      promise.resolve(map)
    })
  }

  @ReactMethod
  fun searchForFoodSemantic(searchQuery: String, promise: Promise) {
    PassioSDK.instance.searchForFoodSemantic(
      term = searchQuery,
      callback = { results, alternatives ->
        val map = WritableNativeMap()
        val mapAlternatives = alternatives.mapToStringArray()
        val mapPassioSearchResult = results.mapBridged(::bridgePassioFoodDataInfo)
        map.putIfNotNull("results", mapPassioSearchResult)
        map.putIfNotNull("alternatives", mapAlternatives)
        promise.resolve(map)
      })
  }

  @ReactMethod
  fun predictNextIngredients(currentIngredientsReadableArray: ReadableArray, promise: Promise) {
    PassioSDK.instance.predictNextIngredients(
      currentIngredients = currentIngredientsReadableArray.convertReadableArrayToList()
        ?: arrayListOf(), callback = { list ->

        promise.resolve((list.mapBridged(::bridgePassioFoodDataInfo)))
      })
  }

  @ReactMethod
  fun fetchFoodItemForDataInfo(
    searchQuery: ReadableMap,
    servingQuantityMap: Double? = null,
    servingUnit: String? = null,
    promise: Promise,
  ) {
    var servingQuantity = servingQuantityMap
    if (servingQuantity != null && servingQuantity < 0) {
      servingQuantity = null
    }

    PassioSDK.instance.fetchFoodItemForDataInfo(
      dataInfo = bridgePassioFoodDataInfoQuery(searchQuery),
      servingQuantity = servingQuantity,
      servingUnit = servingUnit,
      callback = { item ->
        if (item !== null) {
          promise.resolve(bridgePassioFoodItem(item))
        } else {
          promise.resolve(null)
        }
      })
  }

  @ReactMethod
  fun fetchFoodItemForRefCode(refCode: String, promise: Promise) {
    PassioSDK.instance.fetchFoodItemForRefCode(
      refCode = refCode,
      callback = { item ->
        if (item !== null) {
          promise.resolve(bridgePassioFoodItem(item))
        } else {
          promise.resolve(null)
        }
      })
  }

  @ReactMethod
  fun fetchMealPlans(promise: Promise) {
    PassioSDK.instance.fetchMealPlans { mealPlans ->
      if (mealPlans.isNotEmpty()) {
        promise.resolve(mealPlans.mapBridged(::bridgePassioMealPlan))
      } else {
        promise.resolve(null)
      }
    }
  }

  @ReactMethod
  fun fetchMealPlanForDay(
    mealPlanLabel: String,
    day: Int, promise: Promise,
  ) {
    PassioSDK.instance.fetchMealPlanForDay(
      mealPlanLabel = mealPlanLabel,
      day = day
    ) { mealPlansItem ->
      if (mealPlansItem.isNotEmpty()) {
        promise.resolve(mealPlansItem.mapBridged(::bridgePassioMealPlanItem))
      } else {
        promise.resolve(null)
      }
    }
  }

  @ReactMethod
  fun setCameraVideoZoom(
    level: Float,
  ) {
    PassioSDK.instance.setCameraZoomLevel(
      level,
    )
  }

  @ReactMethod
  fun getMinMaxCameraZoomLevel(
    promise: Promise,
  ) {
    val level = PassioSDK.instance.getMinMaxCameraZoomLevel()
    val map = WritableNativeMap()
    map.putIfNotNull("minZoomLevel", level.first)
    map.putIfNotNull("maxZoomLevel", level.second)
    promise.resolve(map)
  }

  @ReactMethod
  fun convertUPCProductToAttributes(productJSON: String, type: String, promise: Promise) {
    promise.reject(Throwable("convertUPCProductToAttributes is deprecated"))
  }

  @Throws(IOException::class)
  fun loadBitmapFromCache(context: Context, imageName: String, rootFolder: String): Bitmap? {
    val file = File(imageName)
    if (!file.exists()) {
      return null
    }

    val fis = FileInputStream(file)
    val bitmap = BitmapFactory.decodeStream(fis)
    fis.close()
    return bitmap
  }

  @ReactMethod
  fun detectFoodFromImageURI(imageUri: String, promise: Promise) {
    val config = FoodDetectionConfiguration(
      detectBarcodes = true,
      detectVisual = true,
      detectPackagedFood = true
    )
    val imageBitmap = loadBitmapFromCache(reactApplicationContext.applicationContext, imageUri, "")
    if (imageBitmap == null) {
      promise.reject(Throwable("no image found"))
    } else {
      PassioSDK.instance.detectFoodIn(imageBitmap, config, onDetectionCompleted = { candidates ->
        if (candidates == null) {
          promise.reject(Throwable("no candidates"))
        } else {
          val map = bridgeFoodCandidates(candidates)
          promise.resolve(map)
        }
      })
    }
  }

  @ReactMethod
  fun recognizeImageRemote(
    imageUri: String,
    message: String?,
    resolution: String,
    promise: Promise,
  ) {

    val imageBitmap = loadBitmapFromCache(reactApplicationContext.applicationContext, imageUri, "")
    if (imageBitmap == null) {
      promise.reject(Throwable("no image found"))
    } else {
      PassioSDK.instance.recognizeImageRemote(
        imageBitmap,
        message = message,
        resolution = PassioImageResolution.valueOf(resolution)
      ) { passioAdvisorFoodInfo ->
        val array = WritableNativeArray()
        for (item in passioAdvisorFoodInfo) {
          array.pushMap(bridgePassioAdvisorFoodInfo(item))
        }
        promise.resolve(array)
      }
    }
  }

  @ReactMethod
  fun recognizeNutritionFactsRemote(
    imageUri: String,
    resolution: String,
    promise: Promise,
  ) {
    val imageBitmap = loadBitmapFromCache(reactApplicationContext.applicationContext, imageUri, "")
    if (imageBitmap == null) {
      promise.reject(Throwable("no image found"))
    } else {
      PassioSDK.instance.recognizeNutritionFactsRemote(
        imageBitmap,
        resolution = PassioImageResolution.valueOf(resolution)
      ) { passioFoodItem ->

        if (passioFoodItem !== null) {
          promise.resolve(bridgePassioFoodItem(passioFoodItem))
        } else {
          promise.resolve(null)
        }
      }
    }
  }

  @SuppressLint("SuspiciousIndentation")
  @ReactMethod
  fun updateLanguage(
    languageCode: String,
    promise: Promise,
  ) {
    val isUpdate = PassioSDK.instance.updateLanguage(
      languageCode = languageCode,
    )
    promise.resolve(isUpdate)
  }

  @ReactMethod
  fun recognizeSpeechRemote(text: String, promise: Promise) {
    PassioSDK.instance.recognizeSpeechRemote(text) { passioSpeechRecognitionModel ->
      val array = WritableNativeArray()
      for (item in passioSpeechRecognitionModel) {
        array.pushMap(bridgePassioSpeechRecognitionModel(item))
      }
      promise.resolve(array)
    }
  }

  @ReactMethod
  fun fetchHiddenIngredients(foodName: String, promise: Promise) {
    PassioSDK.instance.fetchHiddenIngredients(foodName) { result ->
      promise.resolve(bridgePassioResultPassioAdvisorFoodInfos(result))
    }
  }

  @ReactMethod
  fun fetchVisualAlternatives(foodName: String, promise: Promise) {
    PassioSDK.instance.fetchVisualAlternatives(foodName) { result ->
      promise.resolve(bridgePassioResultPassioAdvisorFoodInfos(result))
    }
  }

  @ReactMethod
  fun fetchPossibleIngredients(foodName: String, promise: Promise) {
    PassioSDK.instance.fetchPossibleIngredients(foodName) { result ->
      promise.resolve(bridgePassioResultPassioAdvisorFoodInfos(result))
    }
  }

  @ReactMethod
  fun reportFoodItem(refCode: String, productCode: String, notesJson: String, promise: Promise) {

    val jsonArray: JSONArray = JSONArray(notesJson)
    val notes: MutableList<String> = ArrayList()

    for (i in 0 until jsonArray.length()) {
      notes.add(jsonArray.getString(i))
    }
    PassioSDK.instance.reportFoodItem(
      refCode = refCode,
      productCode = productCode,
      notes = notes
    ) { result ->
      promise.resolve(bridgePassioResultBoolean(result))
    }
  }

  @ReactMethod
  fun submitUserCreatedFood(passioFoodItem: ReadableMap, promise: Promise) {

    val passioFoodItem = bridgePassioFoodItemMapper(map = passioFoodItem)
    if (passioFoodItem === null) {
      return promise.reject("PASSIO-SDK", "unable to create passio food item")
    }
    PassioSDK.instance.submitUserCreatedFoodItem(foodItem = passioFoodItem) { result ->
      promise.resolve(bridgePassioResultBoolean(result))
    }
  }

  @ReactMethod
  fun initConversationAIAdvisor(promise: Promise) {
    NutritionAdvisor.instance.initConversation() { result ->
      val map = WritableNativeMap()
      when (result) {
        is PassioResult.Success -> {
          map.putString("status", "Success")
          promise.resolve(map)
        }

        is PassioResult.Error -> {
          map.putString("status", "Error")
          map.putIfNotNull("message", result.message)
          promise.resolve(map)
        }
      }
    }
  }

  @ReactMethod
  fun sendMessageAIAdvisor(
    message: String,
    promise: Promise,
  ) {
    NutritionAdvisor.instance.sendMessage(message) { result ->
      promise.resolve(bridgePassioAdvisorResultResponse(result))
    }
  }

  @ReactMethod
  fun sendImageAIAdvisor(
    imageURI: String,
    promise: Promise,
  ) {

    try {
      val imageBitmap =
        loadBitmapFromCache(reactApplicationContext.applicationContext, imageURI, "")
      if (imageBitmap == null) {
        promise.reject(Throwable("no image found"))
      } else {
        NutritionAdvisor.instance.sendImage(imageBitmap) { result ->
          promise.resolve(bridgePassioAdvisorResultResponse(result))
        }
      }
    } catch (error: Error) {
      promise.reject(Throwable(error.message))
    }
  }

  @ReactMethod
  fun fetchIngredientsAIAdvisor(
    response: ReadableMap,
    promise: Promise,
  ) {
    NutritionAdvisor.instance.fetchIngredients(bridgePassioAdvisorResponseQuery(response)) { result ->
      promise.resolve(bridgePassioAdvisorResultResponse(result))
    }
  }

  @ReactMethod
  fun fetchTagsFor(refCode: String, promise: Promise) {
    PassioSDK.instance.fetchTagsFor(refCode = refCode, onTagsFetched = { tags ->
      if (tags == null) {
        promise.reject(Throwable("no tags"))
      } else {
        promise.resolve(tags.mapToStringArray())
      }
    })
  }

  @ReactMethod
  fun stopCamera() {
    mainHandler.post {
      PassioSDK.instance.stopCamera()

    }
  }

  private fun sendDetectionEvent(args: ReadableMap) {
    val emitter =
      reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
    emitter.emit("onFoodDetection", args)
  }

  private fun sendNutritionFactsRecognitionListener(args: ReadableMap) {
    val emitter =
      reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
    emitter.emit("NutritionFactsRecognitionListener", args)
  }

  private fun sendTokenBudgetUpdatedListener(args: ReadableMap) {
    val emitter =
      reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
    emitter.emit("tokenBudgetUpdated", args)
  }

  private fun sendCompletedDownloadingFileEvent(args: ReadableMap) {
    val emitter =
      reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
    emitter.emit("completedDownloadingFile", args)
  }

  private fun sendDownloadingErrorEvent(args: ReadableMap) {
    val emitter =
      reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
    emitter.emit("downloadingError", args)
  }

  @ReactMethod
  fun fetchNutrientsFor(refCode: String, promise: Promise) {
    PassioSDK.instance.fetchInflammatoryEffectData(refCode = refCode, onResult = { nutrients ->
      if (nutrients == null) {
        promise.reject(Throwable("no nutrients for $refCode"))
      } else {
        val array = WritableNativeArray()
        for (item in nutrients) {
          array.pushMap(bridgeInflammatoryEffectData(item))
        }
        promise.resolve(array)
      }
    })
  }

  @ReactMethod
  fun accountUsageUpdates() {
    PassioSDK.instance.setAccountListener(this)
  }

  @ReactMethod
  fun enableFlashlight(enable: Boolean) {
    PassioSDK.instance.enableFlashlight(enable)
  }

  override fun onRecognitionResults(
    candidates: FoodCandidates?,
    image: Bitmap?,
  ) {
    val event = WritableNativeMap()
    event.putMap("candidates", bridgeFoodCandidates(candidates))
    if (image != null) {
      event.putMap("image", bridgeBitmap(image))
    }
    sendDetectionEvent(event)
  }

  override fun onRecognitionResult(nutritionFacts: PassioNutritionFacts?, text: String) {
    val event = WritableNativeMap()
    if (nutritionFacts != null) {
      event.putMap("nutritionFacts", bridgeNutritionFacts(nutritionFacts))
    }
    event.putIfNotNull("text", text)

    if (nutritionFacts !== null || text.isNotEmpty()) {
      sendNutritionFactsRecognitionListener(event)
    }
  }

  override fun onTokenBudgetUpdate(tokenBudget: PassioTokenBudget) {
    val event = WritableNativeMap()
    event.putDouble("budgetCap", tokenBudget.budgetCap.toDouble())
    event.putDouble("periodUsage", tokenBudget.periodUsage.toDouble())
    event.putInt("requestUsage", tokenBudget.tokensUsed)
    event.putString("apiName", tokenBudget.apiName)
    event.putDouble("usedPercent", tokenBudget.usedPercent().toDouble())
    sendTokenBudgetUpdatedListener(event)
  }
}


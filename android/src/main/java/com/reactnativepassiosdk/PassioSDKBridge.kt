package com.reactnativepassiosdk

import ai.passio.passiosdk.core.config.PassioConfiguration
import ai.passio.passiosdk.core.config.PassioMode
import ai.passio.passiosdk.core.config.PassioStatus
import ai.passio.passiosdk.passiofood.*
import ai.passio.passiosdk.passiofood.data.model.PassioIDAttributes
import ai.passio.passiosdk.passiofood.data.model.PassioIDEntityType
import ai.passio.passiosdk.passiofood.nutritionfacts.PassioNutritionFacts
import ai.passio.passiosdk.passiofood.upc.UPCProduct
import android.graphics.Bitmap
import android.net.Uri
import android.os.Handler
import android.os.Looper
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class PassioSDKBridge(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext), FoodRecognitionListener {

  override fun getName() = "PassioSDKBridge"

  private val mainHandler = Handler(Looper.getMainLooper())

  @ReactMethod
  fun configure(
    key: String,
    debugMode: Int,
    autoUpdate: Boolean,
    localModelURLs: ReadableArray?,
    promise: Promise
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
      }
      PassioSDK.instance.setPassioStatusListener(object : PassioStatusListener {
        override fun onCompletedDownloadingAllFiles(fileUris: List<Uri>) {
        }

        override fun onCompletedDownloadingFile(fileUri: Uri, filesLeft: Int) {
          val map = WritableNativeMap()
          map.putInt("filesLeft", filesLeft);
          sendCompletedDownloadingFileEvent(map);
        }

        override fun onDownloadError(message: String) {
          val map = WritableNativeMap()
          map.putString("message", message)
          sendDownloadingErrorEvent(map);
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

  @ReactMethod
  fun startFoodDetection(
    detectBarcodes: Boolean,
    detectPackagedFood: Boolean,
    detectNutritionFacts: Boolean
  ) {
    mainHandler.post {
      val config = FoodDetectionConfiguration(
        detectBarcodes = detectBarcodes,
        detectVisual = true,
        detectNutritionFacts = detectNutritionFacts,
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
  fun getAttributesForPassioID(passioID: String, promise: Promise) {
    val attributes =
      PassioSDK.instance.lookupPassioAttributesFor(passioID) ?: return promise.resolve(null)
    val map = bridgePassioAttributes(attributes)
    promise.resolve(map)
  }

  @ReactMethod
  fun fetchAttributesForBarcode(barcode: String, promise: Promise) {
    PassioSDK.instance.fetchPassioIDAttributesForBarcode(barcode) { attributes ->
      val mapped = mapNullable(attributes, ::bridgePassioAttributes)
      promise.resolve(mapped)
    }
  }

  @ReactMethod
  fun fetchPassioIDAttributesForPackagedFood(packagedFoodCode: String, promise: Promise) {
    PassioSDK.instance.fetchPassioIDAttributesForPackagedFood(packagedFoodCode) { attributes ->
      val mapped = mapNullable(attributes, ::bridgePassioAttributes)
      promise.resolve(mapped)
    }
  }

  @ReactMethod
  fun searchForFood(searchQuery: String, promise: Promise) {
    PassioSDK.instance.searchForFood(byText = searchQuery, callback = { results ->
      val array = WritableNativeArray()
      for (item in results) {
        array.pushMap(bridgeSearchResult(result = item))
      }
      promise.resolve(array)
    })
  }

  @ReactMethod
  fun convertUPCProductToAttributes(productJSON: String, type: String, promise: Promise) {
    try {
      val product = UPCProduct(productJSON)
      val entityType = PassioIDEntityType.fromString(type)
      val attributes = PassioIDAttributes(product, entityType)
      val bridged = bridgePassioAttributes(attributes)
      promise.resolve(bridged)
    } catch (err: Throwable) {
      promise.reject(err)
    }
  }

  override fun onRecognitionResults(
    candidates: FoodCandidates,
    image: Bitmap?,
    nutritionFacts: PassioNutritionFacts?
  ) {

    val event = WritableNativeMap()

    event.putMap("candidates", bridgeFoodCandidates(candidates))

    if (nutritionFacts != null) {
      event.putMap("nutritionFacts", bridgeNutritionFacts(nutritionFacts))
    }

    sendDetectionEvent(event)
  }

  private fun sendDetectionEvent(args: ReadableMap) {
    val emitter =
      reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
    emitter.emit("onFoodDetection", args)
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
}

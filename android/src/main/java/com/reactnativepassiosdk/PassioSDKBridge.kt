package com.reactnativepassiosdk

import ai.passio.passiosdk.core.config.Bridge
import ai.passio.passiosdk.core.config.PassioConfiguration
import ai.passio.passiosdk.core.config.PassioMode
import ai.passio.passiosdk.core.config.PassioStatus
import ai.passio.passiosdk.passiofood.*
import ai.passio.passiosdk.passiofood.nutritionfacts.PassioNutritionFacts
import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.os.Handler
import android.os.Looper
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.io.File
import java.io.FileInputStream
import java.io.IOException


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
      detectNutritionFacts = true,
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

  override fun onRecognitionResults(
    candidates: FoodCandidates,
    image: Bitmap?,
    nutritionFacts: PassioNutritionFacts?
  ) {

    val event = WritableNativeMap()

    event.putMap("candidates", bridgeFoodCandidates(candidates))

    if (image != null) {
      event.putMap("image", bridgeBitmap(image))
    }

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

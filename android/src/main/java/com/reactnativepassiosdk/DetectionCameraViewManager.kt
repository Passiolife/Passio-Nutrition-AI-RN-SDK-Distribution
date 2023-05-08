package com.reactnativepassiosdk

import androidx.appcompat.app.AppCompatActivity
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext

class DetectionCameraViewManager: SimpleViewManager<DetectionCameraView>() {

  override fun getName() = "DetectionCameraView"

  override fun createViewInstance(reactContext: ThemedReactContext): DetectionCameraView {
    val activity = reactContext.currentActivity as AppCompatActivity
    return DetectionCameraView(reactContext, activity)
  }
}

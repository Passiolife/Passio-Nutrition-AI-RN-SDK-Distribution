package com.reactnativepassiosdk

import ai.passio.passiosdk.core.icons.IconSize
import ai.passio.passiosdk.passiofood.PassioID
import ai.passio.passiosdk.passiofood.data.model.PassioIDEntityType
import android.util.Log
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableNativeMap
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import org.json.JSONObject

class PassioIconViewManager : SimpleViewManager<PassioIconView>() {

  override fun getName() = "PassioIconView"
  private var passioID: PassioID? = null
  private var iconSize: String? = null

  override fun createViewInstance(reactContext: ThemedReactContext): PassioIconView {
    return PassioIconView(reactContext)
  }

  @ReactProp(name = "config")
  public fun setConfig(
    view: PassioIconView,
    config: ReadableMap,
  ) {
    this.passioID = config.getString("passioID")
    this.iconSize = config.getString("iconSize")
    loadView(view)
  }

  private fun loadView(view: PassioIconView) {
    if (passioID != null && iconSize != null) {
      if (BuildConfig.DEBUG){
        Log.d("PassioIconView", "trying to load image for  $passioID")
      }
      view.loadView(
        passioID!!,
        PassioIDEntityType.item,
        iconSize = IconSize.valueOf(iconSize!!),
      )
    }
  }

}

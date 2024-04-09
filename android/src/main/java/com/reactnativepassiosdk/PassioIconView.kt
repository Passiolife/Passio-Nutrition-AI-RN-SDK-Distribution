package com.reactnativepassiosdk

import ai.passio.passiosdk.core.icons.IconSize
import ai.passio.passiosdk.passiofood.PassioID
import ai.passio.passiosdk.passiofood.PassioSDK
import ai.passio.passiosdk.passiofood.data.model.PassioIDEntityType
import android.content.Context
import android.util.Log
import android.widget.FrameLayout
import android.widget.ImageView
import java.io.IOException


class PassioIconView(context: Context) : FrameLayout(context) {


  private val imageView: ImageView = ImageView(context)

  init {
    imageView.layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
    addView(imageView)
  }

  fun loadView(
    passioID: PassioID,
    passioIDEntityType: PassioIDEntityType,
    iconSize: IconSize
  ) {
    try {
      val result = PassioSDK.instance.lookupIconsFor(
        context = context,
        passioID = passioID,
        iconSize = iconSize,
        type = passioIDEntityType
      )
      imageView.setImageDrawable(result.first)

      if (result.second === null) {
        PassioSDK.instance.fetchIconFor(context = context,
          iconSize = iconSize,
          passioID = passioID, callback = {
            if (it != null) {
              imageView.setImageDrawable(it)
            }
          })
      }else{
        imageView.setImageDrawable(result.second)
      }
    } catch (ex: IOException) {
      Log.e("PassioIconView", "Unable to load Passio image $passioID. Exception: $ex")
    }
  }

}

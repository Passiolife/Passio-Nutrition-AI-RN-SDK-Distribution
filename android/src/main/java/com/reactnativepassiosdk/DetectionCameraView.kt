package com.reactnativepassiosdk

import ai.passio.passiosdk.core.camera.PassioCameraViewProvider
import ai.passio.passiosdk.passiofood.PassioSDK
import android.annotation.SuppressLint
import android.content.Context
import android.widget.FrameLayout
import androidx.camera.view.PreviewView
import androidx.lifecycle.DefaultLifecycleObserver
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.LifecycleRegistry

@SuppressLint("ViewConstructor")
class DetectionCameraView(
  context: Context,
  private val lifecycleOwner: LifecycleOwner
) : FrameLayout(context), LifecycleOwner, DefaultLifecycleObserver, PassioCameraViewProvider {

  private val previewView: PreviewView = PreviewView(context)

  private val registry = LifecycleRegistry(this)

  override val lifecycle: Lifecycle
    get() = registry

  init {
    previewView.layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
    addView(previewView)
    lifecycleOwner.lifecycle.addObserver(this)
  }

  private fun stopCamera() {
    PassioSDK.instance.stopCamera()
    registry.currentState = Lifecycle.State.DESTROYED
  }

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()
    // Sobe o estado do Lifecycle desta view e inicia a câmera
    if (registry.currentState == Lifecycle.State.INITIALIZED) {
      registry.currentState = Lifecycle.State.CREATED
    }
    registry.currentState = Lifecycle.State.STARTED
    PassioSDK.instance.startCamera(this)
  }

  override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()
    stopCamera()
  }

  // ✅ Substitui @OnLifecycleEvent depreciado
  override fun onStop(owner: LifecycleOwner) {
    stopCamera()
  }

  override fun onDestroy(owner: LifecycleOwner) {
    stopCamera()
  }

  override fun requestLayout() {
    super.requestLayout()
    post(measureAndLayout)
  }

  private val measureAndLayout: Runnable = Runnable {
    measure(MeasureSpec.makeMeasureSpec(width, MeasureSpec.EXACTLY),
      MeasureSpec.makeMeasureSpec(height, MeasureSpec.EXACTLY))
    layout(left, top, right, bottom)
  }

  override fun requestPreviewView(): PreviewView {
    return previewView
  }

  override fun requestCameraLifecycleOwner(): LifecycleOwner {
    return this
  }
}

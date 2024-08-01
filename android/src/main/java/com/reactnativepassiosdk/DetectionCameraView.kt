package com.reactnativepassiosdk

import ai.passio.passiosdk.core.camera.PassioCameraViewProvider
import ai.passio.passiosdk.passiofood.PassioSDK
import android.annotation.SuppressLint
import android.content.Context
import android.widget.FrameLayout
import androidx.camera.view.PreviewView
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleObserver
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.LifecycleRegistry
import androidx.lifecycle.OnLifecycleEvent

@SuppressLint("ViewConstructor")
class DetectionCameraView(context: Context, private val lifecycleOwner: LifecycleOwner): FrameLayout(context), LifecycleOwner, LifecycleObserver, PassioCameraViewProvider {

  private val previewView: PreviewView = PreviewView(context)

  private val registry = LifecycleRegistry(this)

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
    PassioSDK.instance.startCamera(this)
    registry.currentState = Lifecycle.State.STARTED
  }

  override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()
    stopCamera()
  }

  @OnLifecycleEvent(Lifecycle.Event.ON_STOP)
  fun onParentLifecycleStopped() {
    stopCamera()
  }

  @OnLifecycleEvent(Lifecycle.Event.ON_DESTROY)
  fun onParentLifecycleDestroyed() {
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

  override fun getLifecycle(): Lifecycle {
    return registry
  }

  override fun requestPreviewView(): PreviewView {
    return previewView
  }

  override fun requestCameraLifecycleOwner(): LifecycleOwner {
    return this
  }

  protected fun finalize() {
    stopCamera()
  }
}

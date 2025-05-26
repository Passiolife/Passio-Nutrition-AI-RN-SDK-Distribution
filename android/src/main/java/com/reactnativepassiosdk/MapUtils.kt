package com.reactnativepassiosdk

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap


fun Map<String, Any>.toWritableMap(): WritableMap {
  val writableMap = Arguments.createMap()
  for ((k, v) in this) {
    when (v) {
      null -> writableMap.putNull(k)
      is Boolean -> writableMap.putBoolean(k, v)
      is Int -> writableMap.putInt(k, v)
      is Double -> writableMap.putDouble(k, v)
      is Float -> writableMap.putDouble(k, v.toDouble())
      is String -> writableMap.putString(k, v)
      is Map<*, *> -> {
        @Suppress("UNCHECKED_CAST")
        writableMap.putMap(k, (v as? Map<String, Any>)?.toWritableMap())
      }
      is List<*> -> {
        writableMap.putArray(k, v.toWritableArray())
      }
      else -> {
        // fallback to string conversion
        writableMap.putString(k, v.toString())
      }
    }
  }
  return writableMap
}


fun List<*>.toWritableArray(): WritableArray {
  val writableArray = Arguments.createArray()
  for (item in this) {
    when (item) {
      null -> writableArray.pushNull()
      is Boolean -> writableArray.pushBoolean(item)
      is Int -> writableArray.pushInt(item)
      is Double -> writableArray.pushDouble(item)
      is Float -> writableArray.pushDouble(item.toDouble())
      is String -> writableArray.pushString(item)
      is Map<*, *> -> {
        @Suppress("UNCHECKED_CAST")
        writableArray.pushMap((item as? Map<String, Any>)?.toWritableMap())
      }
      is List<*> -> writableArray.pushArray(item.toWritableArray())
      else -> writableArray.pushString(item.toString())
    }
  }
  return writableArray
}

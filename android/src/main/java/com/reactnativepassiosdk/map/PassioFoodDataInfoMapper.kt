package com.reactnativepassiosdk.map

import ai.passio.passiosdk.passiofood.PassioFoodDataInfo
import ai.passio.passiosdk.passiofood.PassioSearchNutritionPreview
import com.facebook.react.bridge.ReadableMap

fun bridgePassioFoodDataInfoQuery(searchQuery: ReadableMap): PassioFoodDataInfo {
  val previewMap = searchQuery.getMap("nutritionPreview")
  val preview = PassioSearchNutritionPreview(
    calories = previewMap?.getInt("calories") ?: 0,
    servingUnit = previewMap?.getString("servingUnit") ?: "",
    servingQuantity = previewMap?.getDouble("servingQuantity") ?: 0.0,
    weightQuantity = previewMap?.getDouble("weightQuantity") ?: 0.0,
    weightUnit = previewMap?.getString("weightUnit") ?: "",
    carbs = previewMap?.getDouble("carbs") ?: 0.0,
    protein = previewMap?.getDouble("protein") ?: 0.0,
    fat = previewMap?.getDouble("fat") ?: 0.0,
    fiber = previewMap?.getDouble("fiber") ?: 0.0,
  )

  val tags = ArrayList<String>()

  val toolReadableArray = searchQuery.getArray("tags");
  toolReadableArray?.let {
    for (i in 0 until it.size()) {
      val item: String = it.getString(i)
      tags.add(item)
    }
  }

  val query = PassioFoodDataInfo(
    foodName = searchQuery.getString("foodName") ?: "",
    brandName = searchQuery.getString("brandName") ?: "",
    iconID = searchQuery.getString("iconID") ?: "",
    score = searchQuery.getDouble("score") ?: 0.0,
    scoredName = searchQuery.getString("scoredName") ?: "",
    labelId = searchQuery.getString("labelId") ?: "",
    type = searchQuery.getString("type") ?: "",
    resultId = searchQuery.getString("resultId") ?: "",
    nutritionPreview = preview,
    isShortName = searchQuery.getBoolean("isShortName"),
    tags = tags,
    refCode = "",
  )
  return query
}

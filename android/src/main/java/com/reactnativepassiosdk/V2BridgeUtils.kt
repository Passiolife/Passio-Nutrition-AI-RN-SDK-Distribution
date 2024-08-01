package com.reactnativepassiosdk

import ai.passio.passiosdk.passiofood.PassioFoodDataInfo
import ai.passio.passiosdk.passiofood.PassioSearchNutritionPreview
import ai.passio.passiosdk.passiofood.data.model.PassioAdvisorFoodInfo
import ai.passio.passiosdk.passiofood.data.model.PassioAdvisorResponse
import ai.passio.passiosdk.passiofood.data.model.PassioFoodAmount
import ai.passio.passiosdk.passiofood.data.model.PassioFoodItem
import ai.passio.passiosdk.passiofood.data.model.PassioFoodMetadata
import ai.passio.passiosdk.passiofood.data.model.PassioFoodOrigin
import ai.passio.passiosdk.passiofood.data.model.PassioIngredient
import ai.passio.passiosdk.passiofood.data.model.PassioNutrients
import bridgeMeasurementIU
import bridgeServingSize
import bridgeServingUnits
import bridgeUnitEnergy
import bridgeUnitMass
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableNativeMap
import mapBridged
import mapToStringArray
import putIfNotNull

fun bridgePassioFoodItem(foodItem: PassioFoodItem): ReadableMap {
  val map = WritableNativeMap()
  map.putIfNotNull("id", foodItem.id)
  map.putIfNotNull("refCode", foodItem.refCode)
  map.putIfNotNull("name", foodItem.name)
  map.putIfNotNull("details", foodItem.details)
  map.putIfNotNull("iconId", foodItem.iconId)
  map.putIfNotNull("amount", bridgePassioFoodAmount(foodItem.amount))
  map.putIfNotNull("ingredients", foodItem.ingredients.mapBridged(::bridgePassioIngredient))
  map.putIfNotNull("ingredientWeight", bridgeUnitMass((foodItem.ingredientWeight())))
  map.putIfNotNull("isOpenFood", foodItem.isOpenFoodAsBoolean())
  map.putIfNotNull("openFoodLicense", foodItem.openFoodLicense())
  return map
}

fun bridgePassioFoodAmount(passioFoodAmount: PassioFoodAmount): ReadableMap {
  val map = WritableNativeMap()
  map.putIfNotNull("selectedUnit", passioFoodAmount.selectedUnit)
  map.putIfNotNull("selectedQuantity", passioFoodAmount.selectedQuantity)
  map.putIfNotNull("weightGrams", passioFoodAmount.weightGrams())
  map.putIfNotNull("servingUnits", passioFoodAmount.servingUnits.mapBridged(::bridgeServingUnits))
  map.putIfNotNull("servingSizes", passioFoodAmount.servingSizes.mapBridged(::bridgeServingSize))
  map.putIfNotNull("weight", bridgeUnitMass(passioFoodAmount.weight()))
  return map
}

fun bridgePassioIngredient(passioIngredient: PassioIngredient): ReadableMap {
  val map = WritableNativeMap()
  map.putIfNotNull("name", passioIngredient.name)
  map.putIfNotNull("refCode", passioIngredient.refCode)
  map.putIfNotNull("id", passioIngredient.id)
  map.putIfNotNull("iconId", passioIngredient.iconId)
  map.putIfNotNull("weight", bridgeUnitMass(passioIngredient.weight()))
  map.putIfNotNull("referenceNutrients", bridgePassioNutrients(passioIngredient.referenceNutrients))
  map.putIfNotNull("metadata", bridgePassioFoodMetadata(passioIngredient.metadata))
  map.putIfNotNull("amount", bridgePassioFoodAmount(passioIngredient.amount))
  return map
}

fun bridgePassioFoodMetadata(passioFoodMetadata: PassioFoodMetadata): ReadableMap {
  val map = WritableNativeMap()
  map.putIfNotNull("barcode", passioFoodMetadata.barcode)
  map.putIfNotNull("ingredientsDescription", passioFoodMetadata.ingredientsDescription)
  map.putIfNotNull("tags", passioFoodMetadata.tags?.mapToStringArray())
  map.putIfNotNull(
    "foodOrigins",
    passioFoodMetadata.foodOrigins?.mapBridged(::bridgePassioFoodOrigin)
  )
  return map
}

fun bridgePassioFoodOrigin(passioFoodOrigin: PassioFoodOrigin): ReadableMap {
  val map = WritableNativeMap()
  map.putIfNotNull("id", passioFoodOrigin.id)
  map.putIfNotNull("licenseCopy", passioFoodOrigin.licenseCopy)
  map.putIfNotNull("source", passioFoodOrigin.source)
  return map
}

fun bridgePassioNutrients(passioNutrients: PassioNutrients): ReadableMap {
  val map = WritableNativeMap()
  map.putIfNotNull("weight", bridgeUnitMass(passioNutrients.weight))
  map.putIfNotNull("vitaminA", bridgeMeasurementIU(passioNutrients.vitaminA()))
  map.putIfNotNull("alcohol", bridgeUnitMass(passioNutrients.alcohol()))
  map.putIfNotNull("calcium", bridgeUnitMass(passioNutrients.calcium()))
  map.putIfNotNull("calories", bridgeUnitEnergy(passioNutrients.calories()))
  map.putIfNotNull("carbs", bridgeUnitMass(passioNutrients.carbs()))
  map.putIfNotNull("cholesterol", bridgeUnitMass(passioNutrients.cholesterol()))
  map.putIfNotNull("fat", bridgeUnitMass(passioNutrients.fat()))
  map.putIfNotNull("fibers", bridgeUnitMass(passioNutrients.fibers()))
  map.putIfNotNull("iodine", bridgeUnitMass(passioNutrients.iodine()))
  map.putIfNotNull("iron", bridgeUnitMass(passioNutrients.iron()))
  map.putIfNotNull("magnesium", bridgeUnitMass(passioNutrients.magnesium()))
  map.putIfNotNull("monounsaturatedFat", bridgeUnitMass(passioNutrients.monounsaturatedFat()))
  map.putIfNotNull("phosphorus", bridgeUnitMass(passioNutrients.phosphorus()))
  map.putIfNotNull("polyunsaturatedFat", bridgeUnitMass(passioNutrients.polyunsaturatedFat()))
  map.putIfNotNull("potassium", bridgeUnitMass(passioNutrients.potassium()))
  map.putIfNotNull("protein", bridgeUnitMass(passioNutrients.protein()))
  map.putIfNotNull("satFat", bridgeUnitMass(passioNutrients.satFat()))
  map.putIfNotNull("sodium", bridgeUnitMass(passioNutrients.sodium()))
  map.putIfNotNull("sugarAlcohol", bridgeUnitMass(passioNutrients.sugarAlcohol()))
  map.putIfNotNull("sugars", bridgeUnitMass(passioNutrients.sugars()))
  map.putIfNotNull("sugarsAdded", bridgeUnitMass(passioNutrients.sugarsAdded()))
  map.putIfNotNull("transFat", bridgeUnitMass(passioNutrients.transFat()))
  map.putIfNotNull("vitaminB12", bridgeUnitMass(passioNutrients.vitaminB12()))
  map.putIfNotNull("vitaminB12Added", bridgeUnitMass(passioNutrients.vitaminB12Added()))
  map.putIfNotNull("vitaminB6", bridgeUnitMass(passioNutrients.vitaminB6()))
  map.putIfNotNull("vitaminC", bridgeUnitMass(passioNutrients.vitaminC()))
  map.putIfNotNull("vitaminD", bridgeUnitMass(passioNutrients.vitaminD()))
  map.putIfNotNull("vitaminE", bridgeUnitMass(passioNutrients.vitaminE()))
  map.putIfNotNull("vitaminEAdded", bridgeUnitMass(passioNutrients.vitaminEAdded()))

  // New micros
  map.putIfNotNull("zinc", bridgeUnitMass(passioNutrients.zinc()))
  map.putIfNotNull("selenium", bridgeUnitMass(passioNutrients.selenium()))
  map.putIfNotNull("folicAcid", bridgeUnitMass(passioNutrients.folicAcid()))
  map.putIfNotNull("vitaminKPhylloquinone", bridgeUnitMass(passioNutrients.vitaminKPhylloquinone()))
  map.putIfNotNull("vitaminKMenaquinone4", bridgeUnitMass(passioNutrients.vitaminKMenaquinone4()))
  map.putIfNotNull(
    "vitaminKDihydrophylloquinone",
    bridgeUnitMass(passioNutrients.vitaminKDihydrophylloquinone())
  )
  map.putIfNotNull("chromium", bridgeUnitMass(passioNutrients.chromium()))



  return map
}

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
  )
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
  );
  return query
}

fun bridgePassioAdvisorResponseQuery(query: ReadableMap): PassioAdvisorResponse {
  val tools = ArrayList<String>()
  val extractedIngredients = ArrayList<PassioAdvisorFoodInfo>()

  //Tools
  val toolReadableArray = query.getArray("tools");
  toolReadableArray?.let {
    for (i in 0 until it.size()) {
      val item: String = it.getString(i)
      tools.add(item)
    }
  }

  //extractedIngredients
  val extractedIngredientsReadableArray = query.getArray("extractedIngredients");
  extractedIngredientsReadableArray?.let {
    for (i in 0 until it.size()) {
      val map: ReadableMap = it.getMap(i)
      var foodDataInfo: PassioFoodDataInfo? = null

      map.getMap("foodDataInfo")?.let {info->
        foodDataInfo = bridgePassioFoodDataInfoQuery(info)
      }
      val info = PassioAdvisorFoodInfo(
        portionSize = map.getString("portionSize") ?: "",
        weightGrams = map.getDouble("weightGrams") ?: 0.0,
        recognisedName = map.getString("recognisedName") ?: "",
        foodDataInfo = foodDataInfo,
      )
      extractedIngredients.add(info)
    }
  }

  val preview = PassioAdvisorResponse(
    markupContent = query.getString("markupContent") ?: "",
    messageId = query.getString("messageId") ?: "",
    rawContent = query.getString("rawContent") ?: "",
    threadId = query.getString("threadId") ?: "",
    tools = tools,
    extractedIngredients = extractedIngredients, // Need to parse
  )

  return preview
}

fun bridgePassioFoodDataInfo(passioFoodDataInfo: PassioFoodDataInfo): ReadableMap {
  val map = WritableNativeMap()
  map.putIfNotNull("brandName", passioFoodDataInfo.brandName)
  map.putIfNotNull("foodName", passioFoodDataInfo.foodName)
  map.putIfNotNull("iconID", passioFoodDataInfo.iconID)
  map.putIfNotNull("labelId", passioFoodDataInfo.labelId)
  map.putIfNotNull("resultId", passioFoodDataInfo.resultId)
  map.putIfNotNull("score", passioFoodDataInfo.score)
  map.putIfNotNull("scoredName", passioFoodDataInfo.scoredName)
  map.putIfNotNull("type", passioFoodDataInfo.type)
  map.putIfNotNull("isShortName", passioFoodDataInfo.isShortName)

  map.putIfNotNull(
    "nutritionPreview",
    bridgePassioSearchNutritionPreview((passioFoodDataInfo.nutritionPreview))
  )
  return map
}

fun bridgePassioSearchNutritionPreview(passioSearchNutritionPreview: PassioSearchNutritionPreview): ReadableMap {
  val map = WritableNativeMap()
  map.putIfNotNull("calories", passioSearchNutritionPreview.calories)
  map.putIfNotNull("carbs", passioSearchNutritionPreview.carbs)
  map.putIfNotNull("fat", passioSearchNutritionPreview.fat)
  map.putIfNotNull("protein", passioSearchNutritionPreview.protein)
  map.putIfNotNull("servingQuantity", passioSearchNutritionPreview.servingQuantity)
  map.putIfNotNull("servingUnit", passioSearchNutritionPreview.servingUnit)
  map.putIfNotNull("weightQuantity", passioSearchNutritionPreview.weightQuantity)
  map.putIfNotNull("weightUnit", passioSearchNutritionPreview.weightUnit)
  return map
}

fun PassioFoodItem.isOpenFoodAsBoolean(): Boolean {

  ingredients.forEach { ingredient ->
    if (ingredient.metadata.foodOrigins?.find { it.source == "openfood" } != null) {
      return true
    }
  }
  return false
}

fun PassioFoodItem.openFoodLicense(): String? {
  ingredients.forEach { ingredient ->
    if (ingredient.metadata.openFoodLicense() != null) {
      return ingredient.metadata.openFoodLicense()
    }
  }
  return null
}



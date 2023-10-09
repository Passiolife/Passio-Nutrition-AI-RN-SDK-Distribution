package com.reactnativepassiosdk

import ai.passio.passiosdk.passiofood.BarcodeCandidate
import ai.passio.passiosdk.passiofood.DetectedCandidate
import ai.passio.passiosdk.passiofood.FoodCandidates
import ai.passio.passiosdk.passiofood.PassioID
import ai.passio.passiosdk.passiofood.data.measurement.UnitEnergy
import ai.passio.passiosdk.passiofood.data.measurement.UnitMass
import ai.passio.passiosdk.passiofood.data.model.*
import ai.passio.passiosdk.passiofood.nutritionfacts.PassioNutritionFacts
import android.R.attr.bitmap
import android.graphics.Bitmap
import android.graphics.RectF
import android.util.Base64
import android.util.Log
import com.facebook.react.bridge.*
import java.io.ByteArrayOutputStream


fun bridgeFoodCandidates(candidates: FoodCandidates): ReadableMap {
  val map = WritableNativeMap()
  if (candidates.detectedCandidates != null) {
    val detectedCandidates = WritableNativeArray()
    for (candidate in candidates.detectedCandidates!!) {
      detectedCandidates.pushMap(bridgeDetectedCandidate(candidate))
    }
    map.putArray("detectedCandidates", detectedCandidates)
  }
  if (candidates.barcodeCandidates != null) {
    val barcodeCandidates = WritableNativeArray()
    for (candidate in candidates.barcodeCandidates!!) {
      barcodeCandidates.pushMap(bridgeBarcodeCandidate(candidate))
    }
    map.putArray("barcodeCandidates", barcodeCandidates)
  }
  if (candidates.packagedFoodCandidates != null) {
    val packagedFoodCode = WritableNativeArray()
    for (ocrCode in candidates.packagedFoodCandidates!!) {
      packagedFoodCode.pushString(ocrCode.packagedFoodCode)
    }
    map.putArray("packagedFoodCode", packagedFoodCode)
  }
  return map
}

fun bridgeDetectedCandidate(candidate: DetectedCandidate): ReadableMap {
  val map = WritableNativeMap()
  map.putString("passioID", candidate.passioID)
  map.putDouble("confidence", candidate.confidence.toDouble())
  map.putMap("boundingBox", bridgeBoundingBox(candidate.boundingBox))
  return map
}

fun bridgeBarcodeCandidate(candidate: BarcodeCandidate): ReadableMap {
  val map = WritableNativeMap()
  map.putString("barcode", candidate.barcode)
  map.putMap("boundingBox", bridgeBoundingBox(candidate.boundingBox))
  return map
}

fun bridgePassioAttributes(attributes: PassioIDAttributes): ReadableMap {
  val map = WritableNativeMap()
  map.putString("passioID", attributes.passioID)
  map.putString("name", attributes.name)
  map.putString("entityType", attributes.entityType.value)
  val parents = attributes.parents?.mapBridged(::bridgeAlternative) ?: WritableNativeArray()
  map.putArray("parents", parents)
  val children = attributes.children?.mapBridged(::bridgeAlternative) ?: WritableNativeArray()
  map.putArray("children", children)
  val siblings = attributes.siblings?.mapBridged(::bridgeAlternative) ?: WritableNativeArray()
  map.putArray("siblings", siblings)
  val foodItem = mapNullable(attributes.passioFoodItemData, ::bridgeFoodItem)
  map.putIfNotNull("foodItem", foodItem)
  val recipe = mapNullable(attributes.passioFoodRecipe, ::bridgeRecipe)
  map.putIfNotNull("recipe", recipe)
  map.putBoolean("isOpenFood", attributes.isOpenFood())
  return map
}

fun bridgeFoodItem(foodItem: PassioFoodItemData): ReadableMap {
  val map = WritableNativeMap()
  map.putString("passioID", foodItem.passioID)
  map.putString("name", foodItem.name)
  map.putDouble("selectedQuantity", foodItem.selectedQuantity)
  map.putString("selectedUnit", foodItem.selectedUnit)
  map.putString("entityType", foodItem.entityType.value)
  map.putArray("servingUnits", foodItem.servingUnits.mapBridged(::bridgeServingUnits))
  map.putArray("servingSizes", foodItem.servingSizes.mapBridged(::bridgeServingSize))
  map.putMap("computedWeight", bridgeUnitMass(foodItem.computedWeight()))
  val parents =
    mapNullable(foodItem.parents, { parents -> parents.mapBridged(::bridgeAlternative) })
  map.putIfNotNull("parents", parents)
  val siblings =
    mapNullable(foodItem.siblings, { siblings -> siblings.mapBridged(::bridgeAlternative) })
  map.putIfNotNull("siblings", siblings)
  val children =
    mapNullable(foodItem.children, { children -> children.mapBridged(::bridgeAlternative) })
  map.putIfNotNull("children", children)
  map.putMap("calories", foodItem.totalCalories()?.let { bridgeUnitEnergy(it) })
  map.putMap("carbs", foodItem.totalCarbs()?.let { bridgeUnitMass(it) })
  map.putMap("fat", foodItem.totalFat()?.let { bridgeUnitMass(it) })
  map.putMap("protein", foodItem.totalProtein()?.let { bridgeUnitMass(it) })
  map.putMap("saturatedFat", foodItem.totalSatFat()?.let { bridgeUnitMass(it) })
  map.putMap("transFat", foodItem.totalTransFat()?.let { bridgeUnitMass(it) })
  map.putMap("monounsaturatedFat", foodItem.totalMonounsaturatedFat()?.let { bridgeUnitMass(it) })
  map.putMap("polyunsaturatedFat", foodItem.totalPolyunsaturatedFat()?.let { bridgeUnitMass(it) })
  map.putMap("cholesterol", foodItem.totalCholesterol()?.let { bridgeUnitMass(it) })
  map.putMap("sodium", foodItem.totalSodium()?.let { bridgeUnitMass(it) })
  map.putMap("fiber", foodItem.totalFibers()?.let { bridgeUnitMass(it) })
  map.putMap("sugar", foodItem.totalSugars()?.let { bridgeUnitMass(it) })
  map.putMap("sugarAdded", foodItem.totalSugarsAdded()?.let { bridgeUnitMass(it) })
  map.putMap("vitaminD", foodItem.totalVitaminD()?.let { bridgeUnitMass(it) })
  map.putMap("calcium", foodItem.totalCalcium()?.let { bridgeUnitMass(it) })
  map.putMap("iron", foodItem.totalIron()?.let { bridgeUnitMass(it) })
  map.putMap("potassium", foodItem.totalPotassium()?.let { bridgeUnitMass(it) })
  map.putMap("vitaminC", foodItem.totalVitaminC()?.let { bridgeUnitMass(it) })
  map.putMap("alcohol", foodItem.totalAlcohol()?.let { bridgeUnitMass(it) })
  map.putMap("sugarAlcohol", foodItem.totalSugarAlcohol()?.let { bridgeUnitMass(it) })
  map.putMap("vitaminB12", foodItem.totalVitaminB12()?.let { bridgeUnitMass(it) })
  map.putMap("vitaminB12Added", foodItem.totalVitaminB12Added()?.let { bridgeUnitMass(it) })
  map.putMap("vitaminB6", foodItem.totalVitaminB6()?.let { bridgeUnitMass(it) })
  map.putMap("vitaminE", foodItem.totalVitaminE()?.let { bridgeUnitMass(it) })
  map.putMap("vitaminEAdded", foodItem.totalVitaminEAdded()?.let { bridgeUnitMass(it) })
  map.putMap("magnesium", foodItem.totalMagnesium()?.let { bridgeUnitMass(it) })
  map.putMap("phosphorus", foodItem.totalPhosphorus()?.let { bridgeUnitMass(it) })
  map.putMap("iodine", foodItem.totalIodine()?.let { bridgeUnitMass(it) })
  map.putMap("vitaminA", foodItem.totalVitaminA()?.let { bridgeMeasurementIU(it) })
  map.putIfNotNull("ingredientsDescription", foodItem.ingredientsDescription)
  map.putIfNotNull("barcode", foodItem.barcode)
  map.putIfNotNull("tags", foodItem.tags?.mapToStringArray())
  return map
}

fun bridgeRecipe(recipe: PassioFoodRecipe): ReadableMap {
  val map = WritableNativeMap()
  map.putString("passioID", recipe.passioID)
  map.putString("name", recipe.name)
  map.putArray("servingSizes", recipe.servingSizes.mapBridged(::bridgeServingSize))
  map.putArray("servingUnits", recipe.servingUnits.mapBridged(::bridgeServingUnits))
  map.putDouble("selectedQuantity", recipe.selectedQuantity)
  map.putString("selectedUnit", recipe.selectedUnit)
  map.putArray("foodItems", recipe.foodItems.mapBridged(::bridgeFoodItem))
  return map
}

fun bridgeBoundingBox(box: RectF): ReadableMap {
  val map = WritableNativeMap()
  map.putDouble("x", box.left.toDouble())
  map.putDouble("y", box.top.toDouble())
  val width = box.right - box.left
  val height = box.bottom - box.top
  map.putDouble("width", width.toDouble())
  map.putDouble("height", height.toDouble())
  return map
}

fun bridgeAlternative(alternative: PassioAlternative): ReadableMap {
  val map = WritableNativeMap()
  map.putString("passioID", alternative.passioID)
  map.putString("name", alternative.name)
  map.putIfNotNull("unitName", alternative.unit)
  map.putIfNotNull("quantity", alternative.number)
  return map
}

fun bridgeServingSize(servingSize: PassioServingSize): ReadableMap {
  val map = WritableNativeMap()
  map.putDouble("quantity", servingSize.quantity)
  map.putString("unitName", servingSize.unitName)
  return map
}

fun bridgeServingUnits(servingUnit: PassioServingUnit): ReadableMap {
  val map = WritableNativeMap()
  map.putString("unitName", servingUnit.unitName)
  map.putDouble("value", servingUnit.weight.value)
  return map
}

fun bridgeUnitMass(unitMass: UnitMass): ReadableMap{
  val map = WritableNativeMap()
  map.putString("unit", unitMass.unit.symbol)
  map.putDouble("value", unitMass.value)
  return map
}

fun bridgeMeasurementIU(value: Double): ReadableMap {
  val map = WritableNativeMap()
  map.putString("unit", "IU")
  map.putDouble("value", value)
  return map
}

fun bridgeUnitEnergy(unitMass: UnitEnergy): ReadableMap {
  val map = WritableNativeMap()
  map.putString("unit", unitMass.unit.symbol)
  map.putDouble("value", unitMass.value)
  return map
}

fun bridgeNutritionFacts(nutritionFacts: PassioNutritionFacts): ReadableMap {
  val map = WritableNativeMap()
  map.putIfNotNull("servingSizeQuantity", nutritionFacts.servingSizeQuantity)
  map.putIfNotNull("servingSizeUnit", nutritionFacts.servingSize)
  map.putIfNotNull("servingSizeUnitName", nutritionFacts.servingSizeUnitName)
  map.putIfNotNull("calories", nutritionFacts.calories)
  map.putIfNotNull("fat", nutritionFacts.fat)
  map.putIfNotNull("carbs", nutritionFacts.carbs)
  map.putIfNotNull("protein", nutritionFacts.protein)
  return map
}

fun bridgeSearchResult(result: Pair<PassioID, String>): ReadableMap {
  val map = WritableNativeMap()
  map.putString("passioID", result.first)
  map.putString("name", result.second)
  return map
}

fun bridgeBitmap(value: Bitmap): ReadableMap {
  val map = WritableNativeMap()
  val outputStream = ByteArrayOutputStream()
  value.compress(Bitmap.CompressFormat.JPEG, 85, outputStream)
  val byteArray = outputStream.toByteArray()
  val base64 = Base64.encodeToString(byteArray, Base64.DEFAULT)
  map.putString("base64", base64)
  return map
}

fun WritableMap.putIfNotNull(key: String, value: String?) {
  if (value != null) {
    putString(key, value)
  }
}

fun WritableMap.putIfNotNull(key: String, value: Double?) {
  if (value != null) {
    putDouble(key, value)
  }
}

fun WritableMap.putIfNotNull(key: String, value: ReadableMap?) {
  if (value != null) {
    putMap(key, value)
  }
}

fun WritableMap.putIfNotNull(key: String, value: ReadableArray?) {
  if (value != null) {
    putArray(key, value)
  }
}

fun <T> List<T>.mapBridged(fn: (T) -> ReadableMap): ReadableArray {
  val array = WritableNativeArray()
  for (item in this) {
    val mapped = fn(item)
    array.pushMap(mapped)
  }
  return array
}

fun List<String>.mapToStringArray(): ReadableArray {
  val array = WritableNativeArray()
  for (item in this) {
    array.pushString(item)
  }
  return array
}

fun <T, U> mapNullable(value: T?, fn: (T) -> U): U? {
  if (value != null) {
    return fn(value)
  }
  return null
}

fun <T> mapStringArray(array: ReadableArray, map: (String) -> T): List<T> {
  val mapped = ArrayList<T>()
  for (i in 0 until array.size()) {
    val str = array.getString(i)
    mapped.add(map(str))
  }
  return mapped
}

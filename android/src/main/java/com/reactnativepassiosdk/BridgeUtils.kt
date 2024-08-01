
import ai.passio.passiosdk.passiofood.BarcodeCandidate
import ai.passio.passiosdk.passiofood.DetectedCandidate
import ai.passio.passiosdk.passiofood.FoodCandidates
import ai.passio.passiosdk.passiofood.InflammatoryEffectData
import ai.passio.passiosdk.passiofood.data.measurement.UnitEnergy
import ai.passio.passiosdk.passiofood.data.measurement.UnitMass
import ai.passio.passiosdk.passiofood.data.model.PassioAdvisorFoodInfo
import ai.passio.passiosdk.passiofood.data.model.PassioAdvisorResponse
import ai.passio.passiosdk.passiofood.data.model.PassioMealPlan
import ai.passio.passiosdk.passiofood.data.model.PassioMealPlanItem
import ai.passio.passiosdk.passiofood.data.model.PassioResult
import ai.passio.passiosdk.passiofood.data.model.PassioServingSize
import ai.passio.passiosdk.passiofood.data.model.PassioServingUnit
import ai.passio.passiosdk.passiofood.data.model.PassioSpeechRecognitionModel
import ai.passio.passiosdk.passiofood.nutritionfacts.PassioNutritionFacts
import android.graphics.Bitmap
import android.graphics.RectF
import android.util.Base64
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import com.reactnativepassiosdk.bridgePassioFoodDataInfo
import java.io.ByteArrayOutputStream

fun bridgeFoodCandidates(candidates: FoodCandidates?): ReadableMap? {
  val map = WritableNativeMap()

  if (candidates === null) {
    return null
  }

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
  map.putString("foodName", candidate.foodName)
  map.putDouble("confidence", candidate.confidence.toDouble())
  map.putIfNotNull("croppedImage", bridgeBitmap(candidate.croppedImage))
  map.putIfNotNull("alternatives", candidate.alternatives?.mapBridged(::bridgeDetectedCandidate))
  map.putMap("boundingBox", bridgeBoundingBox(candidate.boundingBox))
  return map
}

fun bridgeBarcodeCandidate(candidate: BarcodeCandidate): ReadableMap {
  val map = WritableNativeMap()
  map.putString("barcode", candidate.barcode)
  map.putMap("boundingBox", bridgeBoundingBox(candidate.boundingBox))
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

fun bridgePassioMealPlan(passioMealPlan: PassioMealPlan): ReadableMap {
  val map = WritableNativeMap()
  map.putIfNotNull("mealPlanLabel", passioMealPlan.mealPlanLabel)
  map.putIfNotNull("mealPlanTitle", passioMealPlan.mealPlanTitle)
  map.putIfNotNull("carbTarget", passioMealPlan.carbTarget)
  map.putIfNotNull("fatTarget", passioMealPlan.fatTarget)
  map.putIfNotNull("proteinTarget", passioMealPlan.proteinTarget)

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
  map.putString("unit", servingUnit.weight.unit.symbol)
  return map
}

fun bridgeUnitMass(unitMass: UnitMass?): ReadableMap? {
  if (unitMass == null) {
    return null
  }
  val map = WritableNativeMap()
  map.putString("unit", unitMass.unit.symbol)
  map.putDouble("value", unitMass.value)
  return map
}

fun bridgeMeasurementIU(value: Double?): ReadableMap? {
  if (value == null) {
    return null
  }
  val map = WritableNativeMap()
  map.putString("unit", "IU")
  map.putDouble("value", value)
  return map
}

fun bridgeUnitEnergy(unitMass: UnitEnergy?): ReadableMap? {
  if (unitMass == null) {
    return null
  }
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
  map.putIfNotNull("saturatedFat", nutritionFacts.saturatedFat)
  map.putIfNotNull("transFat", nutritionFacts.transFat)
  map.putIfNotNull("cholesterol", nutritionFacts.cholesterol)
  map.putIfNotNull("sugarAlcohol", nutritionFacts.sugarAlcohol)
  map.putIfNotNull("sugars", nutritionFacts.sugars)
  return map
}


fun bridgeBitmap(value: Bitmap?): ReadableMap? {
  if (value == null) {
    return null
  }
  val map = WritableNativeMap()
  val outputStream = ByteArrayOutputStream()
  value.compress(Bitmap.CompressFormat.JPEG, 85, outputStream)
  val byteArray = outputStream.toByteArray()
  val base64 = Base64.encodeToString(byteArray, Base64.DEFAULT)
  map.putString("base64", base64)
  return map
}

fun bridgeInflammatoryEffectData(value: InflammatoryEffectData): ReadableMap {
  val map = WritableNativeMap()
  map.putIfNotNull("nutrient", value.nutrient)
  map.putIfNotNull("amount", value.amount)
  map.putIfNotNull("unit", value.unit)
  map.putIfNotNull("inflammatoryEffectScore", value.inflammatoryEffectScore)
  return map
}


fun bridgePassioMealPlanItem(passioMealPlanItem: PassioMealPlanItem): ReadableMap {

  val map = WritableNativeMap()
  map.putIfNotNull("dayNumber", passioMealPlanItem.dayNumber)
  map.putIfNotNull("dayTitle", passioMealPlanItem.dayTitle)
  map.putIfNotNull("mealTime", passioMealPlanItem.mealTime.name)
  map.putIfNotNull("meal", bridgePassioFoodDataInfo(passioMealPlanItem.meal))
  return map

}
fun bridgePassioSpeechRecognitionModel(item: PassioSpeechRecognitionModel): ReadableMap {

  val map = WritableNativeMap()
  map.putIfNotNull("date", item.date)
  item.mealTime?.name.let {
    map.putIfNotNull("mealTime", it?.lowercase())
  }
  item.action?.name.let {
    map.putIfNotNull("action", it?.lowercase())
  }
  map.putIfNotNull("advisorInfo", bridgePassioAdvisorFoodInfo(item.advisorInfo))
  return map
}
fun bridgePassioAdvisorFoodInfo(item: PassioAdvisorFoodInfo): ReadableMap {

  val map = WritableNativeMap()
  map.putIfNotNull("portionSize", item.portionSize)
  item.foodDataInfo?.let {
    map.putIfNotNull("foodDataInfo", bridgePassioFoodDataInfo(it))
  }
  map.putIfNotNull("weightGrams", item.weightGrams)
  map.putIfNotNull("recognisedName", item.recognisedName)
  return map

}

fun bridgePassioAdvisorResponse(item: PassioAdvisorResponse): ReadableMap {
  val map = WritableNativeMap()
  map.putIfNotNull("threadId", item.threadId)
  map.putIfNotNull("messageId", item.messageId)
  map.putIfNotNull("rawContent", item.rawContent)
  map.putIfNotNull("markupContent", item.markupContent)
  map.putIfNotNull("tools", item.tools?.mapToStringArray())
  map.putIfNotNull("extractedIngredients", item.extractedIngredients?.mapBridged(::bridgePassioAdvisorFoodInfo))
  return map
}
fun bridgePassioAdvisorResultResponse(result: PassioResult<PassioAdvisorResponse>): ReadableMap {
  val map = WritableNativeMap()
  when (result) {
    is PassioResult.Success -> {
      map.putString("status", "Success")
      map.putIfNotNull("response", bridgePassioAdvisorResponse(result.value))
    }
    is PassioResult.Error -> {
      map.putString("status", "Error")
      map.putIfNotNull("message", result.message)
    }
  }
  return map
}

fun bridgePassioResultPassioAdvisorFoodInfos(result: PassioResult<List<PassioAdvisorFoodInfo>>): ReadableMap {
  val map = WritableNativeMap()
  when (result) {
    is PassioResult.Success -> {
      map.putString("status", "Success")
      map.putIfNotNull("response",result.value.mapBridged(::bridgePassioAdvisorFoodInfo))
    }
    is PassioResult.Error -> {
      map.putString("status", "Error")
      map.putIfNotNull("message", result.message)
    }
  }
  return map
}

fun WritableMap.putIfNotNull(key: String, value: Boolean?) {
  if (value != null) {
    putBoolean(key, value)
  }
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

fun WritableMap.putIfNotNull(key: String, value: Int?) {
  if (value != null) {
    putInt(key, value)
  }
}

fun WritableMap.putIfNotNull(key: String, value: ReadableMap?) {
  if (value != null) {
    putMap(key, value)
  }
}
fun WritableMap.putIfNotNull(key: String, value: Float?) {
  if (value != null) {
    putDouble(key, value.toDouble())
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

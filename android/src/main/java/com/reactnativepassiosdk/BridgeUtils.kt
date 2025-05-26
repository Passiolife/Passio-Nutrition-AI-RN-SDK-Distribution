import ai.passio.passiosdk.passiofood.BarcodeCandidate
import ai.passio.passiosdk.passiofood.DetectedCandidate
import ai.passio.passiosdk.passiofood.FoodCandidates
import ai.passio.passiosdk.passiofood.InflammatoryEffectData
import ai.passio.passiosdk.passiofood.PassioMealTime
import ai.passio.passiosdk.passiofood.data.measurement.UnitEnergy
import ai.passio.passiosdk.passiofood.data.measurement.UnitMass
import ai.passio.passiosdk.passiofood.data.model.PassioAdvisorFoodInfo
import ai.passio.passiosdk.passiofood.data.model.PassioAdvisorResponse
import ai.passio.passiosdk.passiofood.data.model.PassioFoodResultType
import ai.passio.passiosdk.passiofood.data.model.PassioGeneratedMealPlan
import ai.passio.passiosdk.passiofood.data.model.PassioGeneratedMealPlanConstraints
import ai.passio.passiosdk.passiofood.data.model.PassioGeneratedMealPlanDay
import ai.passio.passiosdk.passiofood.data.model.PassioGeneratedMealPlanMacros
import ai.passio.passiosdk.passiofood.data.model.PassioGeneratedMealPlanRecipe
import ai.passio.passiosdk.passiofood.data.model.PassioGeneratedMealPlanShoppingItem
import ai.passio.passiosdk.passiofood.data.model.PassioMealPlan
import ai.passio.passiosdk.passiofood.data.model.PassioMealPlanItem
import ai.passio.passiosdk.passiofood.data.model.PassioRecognitionItem
import ai.passio.passiosdk.passiofood.data.model.PassioRecognitionResult
import ai.passio.passiosdk.passiofood.data.model.PassioResult
import ai.passio.passiosdk.passiofood.data.model.PassioServingSize
import ai.passio.passiosdk.passiofood.data.model.PassioServingUnit
import ai.passio.passiosdk.passiofood.data.model.PassioSpeechRecognitionModel
import ai.passio.passiosdk.passiofood.data.model.PassioUPFRating
import ai.passio.passiosdk.passiofood.nutritionfacts.PassioNutritionFacts
import android.graphics.Bitmap
import android.graphics.RectF
import android.util.Base64
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import com.reactnativepassiosdk.bridgePassioFoodDataInfo
import com.reactnativepassiosdk.bridgePassioFoodItem
import com.reactnativepassiosdk.bridgePassioIngredient
import com.reactnativepassiosdk.toWritableMap
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

fun bridgeServingSize(servingSize: PassioServingSize?): ReadableMap {
  val map = WritableNativeMap()
  map.putDouble("quantity", servingSize?.quantity ?: 0.0)
  map.putString("unitName", servingSize?.unitName)
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
  map.putIfNotNull("servingSizeQuantity", nutritionFacts.servingQuantity)
  map.putIfNotNull("servingSizeUnit", nutritionFacts.servingUnit)
  map.putIfNotNull("servingSizeGram", nutritionFacts.weightQuantity)

  map.putIfNotNull("servingSizeUnitName", nutritionFacts.weightUnit)

  map.putIfNotNull("calories", nutritionFacts.calories)
  map.putIfNotNull("fat", nutritionFacts.fat)
  map.putIfNotNull("carbs", nutritionFacts.carbs)
  map.putIfNotNull("protein", nutritionFacts.protein)
  map.putIfNotNull("saturatedFat", nutritionFacts.saturatedFat)
  map.putIfNotNull("transFat", nutritionFacts.transFat)
  map.putIfNotNull("cholesterol", nutritionFacts.cholesterol)
  map.putIfNotNull("sugarAlcohol", nutritionFacts.sugarAlcohol)
  map.putIfNotNull("sugars", nutritionFacts.sugars)

  // sodium and dietaryFiber are  missing in android but available in ios.
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
  map.putIfNotNull("mealTime", passioMealPlanItem.mealTime.get())
  map.putIfNotNull("meal", bridgePassioFoodDataInfo(passioMealPlanItem.meal))
  return map

}
fun bridgePassioSpeechRecognitionModel(item: PassioSpeechRecognitionModel): ReadableMap {

  val map = WritableNativeMap()
  map.putIfNotNull("date", item.date)
  item.mealTime?.let {
    map.putIfNotNull("mealTime", it.get())
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

  item.packagedFoodItem?.let {
    map.putIfNotNull("packagedFoodItem", bridgePassioFoodItem(it))
  }

  when (item.resultType.name) {
      PassioFoodResultType.FOOD_ITEM.name -> {
        map.putIfNotNull("resultType", "foodItem")
      }
      PassioFoodResultType.NUTRITION_FACTS.name -> {
        map.putIfNotNull("resultType", "nutritionFacts")
      }
      PassioFoodResultType.BARCODE.name -> {
        map.putIfNotNull("resultType", "barcode")
      }
  }

  return map

}


fun bridgePassioGeneratedMealPlanRecipe(item: PassioGeneratedMealPlanRecipe): ReadableMap {
  val map = WritableNativeMap()
  map.putIfNotNull("macros", bridgePassioGeneratedMealPlanMacros(item.macros))
  map.putIfNotNull("preparation", item.preparation)
  map.putIfNotNull("ingredients", item.ingredients.mapBridged { bridgePassioFoodDataInfo((it)) })
  map.putIfNotNull("name", item.name)
  return map
}

fun bridgePassioGeneratedMealPlanDay(item: PassioGeneratedMealPlanDay): ReadableMap {
  val map = WritableNativeMap()
  map.putIfNotNull("macros", bridgePassioGeneratedMealPlanMacros(item.macros))
  map.putIfNotNull("dinner", item.dinner.mapBridged { bridgePassioGeneratedMealPlanRecipe(it) })
  map.putIfNotNull("lunch", item.lunch.mapBridged { bridgePassioGeneratedMealPlanRecipe(it) })
  map.putIfNotNull("snack", item.snack.mapBridged { bridgePassioGeneratedMealPlanRecipe(it) })
  map.putIfNotNull("breakfast", item.breakfast.mapBridged { bridgePassioGeneratedMealPlanRecipe(it) })
  return map
}

fun bridgePassioGeneratedMealPlanShoppingItem(item: PassioGeneratedMealPlanShoppingItem): ReadableMap {
  val map = WritableNativeMap()
  map.putIfNotNull("portionSize", item.portionSize)
  map.putIfNotNull("name", item.name)
  map.putIfNotNull("portionQuantity", item.portionQuantity)
  return map
}
fun bridgePassioGeneratedMealPlanMacros(item: PassioGeneratedMealPlanMacros): ReadableMap {
  val map = WritableNativeMap()
  map.putIfNotNull("calories", item.calories)
  map.putIfNotNull("protein", item.protein)
  map.putIfNotNull("fiber", item.fiber)
  map.putIfNotNull("carbs", item.carbs)
  map.putIfNotNull("fat", item.fat)
  map.putIfNotNull("sugar", item.sugar)
  return map
}
fun bridgePassioGeneratedMealPlanConstraints(item: PassioGeneratedMealPlanConstraints): ReadableMap {
  val map = WritableNativeMap()
  map.putIfNotNull("macros", bridgePassioGeneratedMealPlanMacros(item.macros))
  map.putIfNotNull("constraints", item.constraints)
  return map
}


fun bridgePassioGeneratedMealPlan(item: PassioGeneratedMealPlan): ReadableMap {

  val map = WritableNativeMap()
  map.putIfNotNull("shoppingList", item.shoppingList.mapBridged { bridgePassioGeneratedMealPlanShoppingItem(it) })
  map.putIfNotNull("mealPlanDays", item.mealPlanDays.mapBridged { bridgePassioGeneratedMealPlanDay(it) })

  item.constraints?.let {
    map.putIfNotNull("constraints", bridgePassioGeneratedMealPlanConstraints(it))
  }



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


fun bridgePassioUPFRating(item: PassioUPFRating): ReadableMap {
  val map = WritableNativeMap()
  map.putIfNotNull("chainOfThought", item.chainOfThought)
  map.putIfNotNull("rating", item.rating)
  map.putIfNotNull("highlightedIngredients", item.highlightedIngredients.mapToStringArray())
  return map
}
fun bridgePassioRecognitionItem(item: PassioRecognitionItem): ReadableMap {
  val map = WritableNativeMap()
  map.putIfNotNull("date", item.date)
  item.action?.let {
    map.putIfNotNull("action", it.name.lowercase())
  }
  item.mealTime?.let { time->
    map.putIfNotNull("mealTime", time.get())
  }
  map.putIfNotNull("resultType",item.resultType.get())
  map.putIfNotNull("foodItem", bridgePassioFoodItem(item.foodItem))
  return map
}



fun bridgePassioRecognitionResult(item: PassioRecognitionResult): ReadableMap {
  val map = WritableNativeMap()
  map.putIfNotNull("mealName", item.mealName)
  map.putIfNotNull("items", item.items.mapBridged {bridgePassioRecognitionItem(it)  })
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

fun bridgePassioUPFRatingResponse(result: PassioResult<PassioUPFRating>): ReadableMap {
  val map = WritableNativeMap()
  when (result) {
    is PassioResult.Success -> {
      map.putString("status", "Success")
      map.putIfNotNull("response", bridgePassioUPFRating(result.value))
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

fun bridgePassioResultPassioGeneratedMealPlan(result: PassioResult<PassioGeneratedMealPlan>): ReadableMap {
  val map = WritableNativeMap()
  when (result) {
    is PassioResult.Success -> {
      map.putString("status", "Success")
      map.putIfNotNull("response",bridgePassioGeneratedMealPlan(result.value))
    }
    is PassioResult.Error -> {
      map.putString("status", "Error")
      map.putIfNotNull("message", result.message)
    }
  }
  return map
}

fun bridgePassioRecognitionResultStatus(result: PassioResult<PassioRecognitionResult>): ReadableMap {
  val map = WritableNativeMap()
  when (result) {
    is PassioResult.Success -> {
      map.putString("status", "Success")
      map.putIfNotNull("response",bridgePassioRecognitionResult(result.value))
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

fun WritableMap.putIfNotNull(key:String , value: Map<String,Any>?) {
  if (value != null) {
    putMap(key, value.toWritableMap())
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

fun List<Int>.mapToNumberArray(): ReadableArray {

  val array = WritableNativeArray()
  for (item in this) {
    array.pushInt(item)
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
    mapped.add(map(str!!))
  }
  return mapped
}

fun ReadableArray.convertReadableArrayToList( ): List<String>? {
  val list: MutableList<String> = ArrayList()
  for (i in 0 until this.size()) {
    if (this.getType(i) == ReadableType.String) {
      // Add non-null assertion `!!` as list expects String, not String?
      list.add(this.getString(i)!!)

    }
  }
  return list
}

fun ReadableMap?.toMapString(): Map<String, String>? {
  if (this == null) return null

  val map = mutableMapOf<String, String>()
  val iterator = this.keySetIterator()
  while (iterator.hasNextKey()) {
    val key = iterator.nextKey()
    val value = this.getString(key) // Assuming all values are strings
    if (value != null) {
      map[key] = value
    }
  }
  return map
}

fun PassioFoodResultType.get(): String {
  return when (this.name) {
    PassioFoodResultType.FOOD_ITEM.name -> {
      "foodItem"
    }
    PassioFoodResultType.NUTRITION_FACTS.name -> {
      "nutritionFacts"
    }
    PassioFoodResultType.BARCODE.name -> {
      "barcode"
    }
    else -> {
      "foodItem"
    }
  }
}
fun PassioMealTime.get(): String {
  return  this.name.lowercase()
}

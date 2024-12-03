package com.reactnativepassiosdk.map

import ai.passio.passiosdk.passiofood.data.measurement.Centigrams
import ai.passio.passiosdk.passiofood.data.measurement.Decigrams
import ai.passio.passiosdk.passiofood.data.measurement.Dekagrams
import ai.passio.passiosdk.passiofood.data.measurement.Grams
import ai.passio.passiosdk.passiofood.data.measurement.KiloCalories
import ai.passio.passiosdk.passiofood.data.measurement.KiloJoule
import ai.passio.passiosdk.passiofood.data.measurement.Kilograms
import ai.passio.passiosdk.passiofood.data.measurement.Micrograms
import ai.passio.passiosdk.passiofood.data.measurement.Milligrams
import ai.passio.passiosdk.passiofood.data.measurement.Milliliters
import ai.passio.passiosdk.passiofood.data.measurement.Ounce
import ai.passio.passiosdk.passiofood.data.measurement.Unit
import ai.passio.passiosdk.passiofood.data.measurement.UnitEnergy
import ai.passio.passiosdk.passiofood.data.measurement.UnitMass
import ai.passio.passiosdk.passiofood.data.model.PassioFoodAmount
import ai.passio.passiosdk.passiofood.data.model.PassioFoodItem
import ai.passio.passiosdk.passiofood.data.model.PassioFoodMetadata
import ai.passio.passiosdk.passiofood.data.model.PassioFoodOrigin
import ai.passio.passiosdk.passiofood.data.model.PassioIngredient
import ai.passio.passiosdk.passiofood.data.model.PassioNutrients
import ai.passio.passiosdk.passiofood.data.model.PassioServingSize
import ai.passio.passiosdk.passiofood.data.model.PassioServingUnit
import android.util.Log
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap

private const val TAG = "PASSIO-SDK-Mapper"
fun bridgeUnitMapper(value: String): Unit {
    when (value) {
        "kg" -> {
            return Kilograms
        }

        "dag" -> {
            return Dekagrams
        }

        "g" -> {
            return Grams
        }

        "dg" -> {
            return Decigrams
        }

        "cg" -> {
            return Centigrams
        }

        "mg" -> {
            return Milligrams
        }

        "ug" -> {
            return Micrograms
        }

        "µg" -> {
            return Micrograms
        }

        "ml" -> {
            return Milliliters
        }

        "kcal" -> {
            return KiloCalories
        }

        "kj" -> {
            return KiloJoule
        }

        "oz" -> {
            return Ounce
        }

        else -> return Grams
    }
}

fun bridgePassioFoodAmountMapper(map: ReadableMap?): PassioFoodAmount? {
    if (map == null) {
        Log.e(TAG, "unable to create PassioFoodAmount")
        return null
    }
    val passioServingSize = ArrayList<PassioServingSize>()
    map.getArray("servingSizes")?.let {
        for (i in 0 until it.size()) {
            val item: ReadableMap = it.getMap(i)
            passioServingSize.add(
                PassioServingSize(
                    quantity = item.getDouble("quantity"),
                    unitName = item.getString("unitName") ?: ""
                )
            )
        }
    }
    val passioServingUnit = ArrayList<PassioServingUnit>()
    map.getArray("servingUnits")?.let {
        for (i in 0 until it.size()) {
            val item: ReadableMap = it.getMap(i)
            passioServingUnit.add(
                PassioServingUnit(
                    weight = UnitMass(
                        unit = bridgeUnitMapper(map.getString("unit") ?: ""),
                        value = item.getDouble("value")
                    ), unitName = item.getString("unitName") ?: ""
                )
            )
        }
    }
    return PassioFoodAmount(servingSizes = passioServingSize, servingUnits = passioServingUnit)
}

fun ReadableMap.returnUnitMass(value: String): UnitMass {
    val defaultUnit = "g"
    return UnitMass(
        value = this.getMap(value)?.getDouble("value") ?: 0.0,
        unit = bridgeUnitMapper(this.getMap(value)?.getString("unit") ?: defaultUnit)
    )
}

fun ReadableMap.returnUnitEnergy(value: String): UnitEnergy {
    val defaultUnit = "g"
    return UnitEnergy(
        value = this.getMap(value)?.getDouble("value") ?: 0.0,
        unit = bridgeUnitMapper(this.getMap(value)?.getString("unit") ?: defaultUnit)
    )
}

fun bridgePassioNutrientsMapper(map: ReadableMap?): PassioNutrients? {
    if (map == null) {
        Log.e(TAG, "unable to create PassioNutrients")
        return null
    }

    val defaultUnit = "g"

    // vitaminARAE: UnitMass? = null,
    return PassioNutrients(
        weight = UnitMass(
            value = map.getMap("weight")?.getDouble("value") ?: 100.0,
            unit = bridgeUnitMapper(map.getMap("weight")?.getString("unit") ?: defaultUnit)
        ),
        fat = map.returnUnitMass("fat"),
        satFat = map.returnUnitMass("satFat"),
        monounsaturatedFat = map.returnUnitMass("monounsaturatedFat"),
        polyunsaturatedFat = map.returnUnitMass("polyunsaturatedFat"),
        proteins = map.returnUnitMass("protein"),
        carbs = map.returnUnitMass("carbs"),
        calories = map.returnUnitEnergy("calories"),
        cholesterol = map.returnUnitMass("cholesterol"),
        sodium = map.returnUnitMass("sodium"),
        fibers = map.returnUnitMass("fibers"),
        transFat = map.returnUnitMass("transFat"),
        sugars = map.returnUnitMass("sugars"),
        sugarsAdded = map.returnUnitMass("sugarsAdded"),
        alcohol = map.returnUnitMass("alcohol"),
        iron = map.returnUnitMass("iron"),
        vitaminC = map.returnUnitMass("vitaminC"),
        vitaminD = map.returnUnitMass("vitaminD"),
        vitaminB6 = map.returnUnitMass("vitaminB6"),
        vitaminB12 = map.returnUnitMass("vitaminB12"),
        vitaminB12Added = map.returnUnitMass("vitaminB12Added"),
        vitaminE = map.returnUnitMass("vitaminE"),
        vitaminEAdded = map.returnUnitMass("vitaminEAdded"),
        iodine = map.returnUnitMass("iodine"),
        calcium = map.returnUnitMass("calcium"),
        potassium = map.returnUnitMass("potassium"),
        magnesium = map.returnUnitMass("magnesium"),
        phosphorus = map.returnUnitMass("phosphorus"),
        sugarAlcohol = map.returnUnitMass("sugarAlcohol"),
        vitaminA = map.getMap("vitaminA")?.getDouble("value") ?: 100.0,
        vitaminARAE = map.returnUnitMass("vitaminARAE"),
        zinc = map.returnUnitMass("zinc"),
        selenium = map.returnUnitMass("selenium"),
        folicAcid = map.returnUnitMass("folicAcid"),
        vitaminKPhylloquinone = map.returnUnitMass("vitaminKPhylloquinone"),
        vitaminKMenaquinone4 = map.returnUnitMass("vitaminKMenaquinone4"),
        vitaminKDihydrophylloquinone = map.returnUnitMass("vitaminKDihydrophylloquinone"),
        chromium = map.returnUnitMass("chromium"),
    )
}

fun bridgePassioIngredientMapper(map: ReadableMap): PassioIngredient? {
    val amount = bridgePassioFoodAmountMapper(map.getMap("amount")) ?: return null
    val referenceNutrients =
        bridgePassioNutrientsMapper(map.getMap("referenceNutrients")) ?: return null
    val metadata = bridgePassioFoodMetadataMapper(map.getMap("metadata")) ?: return null
    return PassioIngredient(
        id = map.getString("id") ?: "",
        refCode = map.getString("refCode") ?: "",
        name = map.getString("name") ?: "",
        iconId = map.getString("iconId") ?: "",
        amount = amount,
        referenceNutrients = referenceNutrients,
        metadata = metadata
    )
}

fun bridgePassioFoodMetadataMapper(map: ReadableMap?): PassioFoodMetadata? {
    if (map == null) {
        Log.e(TAG, "unable to create PassioFoodMetadata")
        return null
    }

    val passioFoodOrigins = ArrayList<PassioFoodOrigin>()
    val passioFoodOriginArray = map.getArray("foodOrigins")
    passioFoodOriginArray?.let {
        for (i in 0 until it.size()) {
            val item: ReadableMap = it.getMap(i)
            val foodOrigin = bridgePassioFoodOriginMapper(item)
            if (foodOrigin !== null) {
                passioFoodOrigins.add(foodOrigin)
            }
        }
    }

    val tags = ArrayList<String>()
    val toolReadableArray = map.getArray("tags");
    toolReadableArray?.let {
        for (i in 0 until it.size()) {
            val item: String = it.getString(i)
            tags.add(item)
        }
    }
    return PassioFoodMetadata(
        barcode = map.getString("barcode"),
        ingredientsDescription = map.getString("ingredientsDescription"),
        foodOrigins = passioFoodOrigins,
        tags = tags
    )
}

fun bridgePassioFoodOriginMapper(map: ReadableMap?): PassioFoodOrigin? {
    if (map == null) {
        Log.e(TAG, "unable to create PassioFoodOrigin")
        return null
    }
    return PassioFoodOrigin(
        id = map.getString("id") ?: "",
        source = map.getString("source") ?: "",
        licenseCopy = map.getString("licenseCopy") ?: "",
    )
}

fun bridgePassioIngredientListMapper(map: ReadableArray?): ArrayList<PassioIngredient>? {
    if (map == null) {
        return null
    }
    val passioIngredients = ArrayList<PassioIngredient>()
    map.let {
        for (i in 0 until it.size()) {
            val item: ReadableMap = it.getMap(i)
            val ingredient = bridgePassioIngredientMapper(item)
            if (ingredient !== null) {
                passioIngredients.add(ingredient)
            }
        }
    }

    return passioIngredients
}

fun bridgePassioFoodItemMapper(map: ReadableMap): PassioFoodItem? {
    val amount = bridgePassioFoodAmountMapper(map.getMap("amount")) ?: return null
    val ingredients = bridgePassioIngredientListMapper(map.getArray("ingredients")) ?: return null

    val query = PassioFoodItem(
        id = map.getString("id") ?: "",
        refCode = map.getString("refCode") ?: "",
        name = map.getString("name") ?: "",
        iconId = map.getString("iconId") ?: "",
        details = map.getString("details") ?: "",
        amount = amount,
        ingredients = ingredients,
    )
    return query
}


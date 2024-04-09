import Foundation
#if canImport(PassioSDK)
import PassioNutritionAI
#elseif canImport(PassioNutritionAISDK)
import PassioNutritionAISDK
#endif

@objc(PassioSDKBridge)
class PassioSDKBridge: RCTEventEmitter {
    
    private let sdk = PassioNutritionAI.shared
    private var debugMode = false
    private let completedDownloadingFileEventName = "completedDownloadingFile"
    private let downloadingErrorEventName = "downloadingError"
    
    @objc(configure:debugMode:autoUpdate:localModelURLs:withResolver:withRejecter:)
    func configure(key: String,
                   debugMode: Int,
                   autoUpdate: Bool,
                   localModelURLs: [String]?,
                   resolve: @escaping RCTPromiseResolveBlock,
                   reject: @escaping RCTPromiseRejectBlock) -> Void {
        
        let localFiles = localModelURLs?.compactMap(URL.init(fileURLWithPath:))
        
        var config = PassioConfiguration(key: key)
        config.debugMode = debugMode
        config.sdkDownloadsModels = autoUpdate
        config.filesLocalURLs = localFiles
        config.bridge = .reactNative
        self.debugMode = debugMode == 0 ? false : true
        
        sdk.statusDelegate = self
        
        if #available(iOS 13.0, *) {
            sdk.configure(passioConfiguration: config) { (status) in
                
                switch status.mode {
                case .isReadyForDetection:
                    resolve([
                        "mode": "isReadyForDetection",
                        "activeModels": status.activeModels ?? 0,
                        "missingFiles": (status.missingFiles as [String]?) ?? []
                    ])
                case .notReady:
                    resolve([
                        "mode": "notReady",
                        "missingFiles": (status.missingFiles as [String]?) ?? []
                    ])
                case .isDownloadingModels:
                    print("PassioSDK: auto update configured, downloading models...")
                case .isBeingConfigured: break
                case .failedToConfigure:
                    resolve([
                        "mode": "error",
                        "errorMessage": status.error?.errorDescription ?? "unknown"
                    ])
                @unknown default: break
                }
            }
        } else {
            let errMessage = "PassioSDK Error: Only iOS versions >=13 supported"
            print(errMessage)
            resolve([
                "mode": "error",
                "errorMessage": errMessage
            ])
        }
    }
    
    @objc(startFoodDetection:detectPackagedFood:detectNutritionFacts:)
    func startFoodDetection(detectBarcodes: Bool, detectPackagedFood: Bool, detectNutritionFacts: Bool) {
        
        let config = FoodDetectionConfiguration(
            detectVisual: true,
            volumeDetectionMode: PassioNutritionAISDK.VolumeDetectionMode.auto,
            detectBarcodes: detectBarcodes,
            detectPackagedFood: detectPackagedFood,
            nutritionFacts: detectNutritionFacts
        )
        
        if #available(iOS 13.0, *) {
            if debugMode {
                
                print("PassioSDK: Starting food detection...")
            }
            
            sdk.startFoodDetection(detectionConfig: config, foodRecognitionDelegate: self) { [weak self] (isReady) in
                
                if self?.debugMode == true {
                    
                    print("PassioSDK: Food detection ready = \(isReady)")
                }
            }
            
        } else {
            print("PassioSDK Error: Food detection only supported on iOS 13 and above")
        }
    }
    
    @objc(stopFoodDetection)
    func stopFoodDetection() {
        
        if debugMode {
            
            print("PassioSDK: Stopping food detection...")
        }
        
        sdk.stopFoodDetection()
    }
    
    @objc(getAttributesForPassioID:withResolver:withRejecter:)
    func getAttributesForPassioID(passioID: String,
                                  resolve: @escaping RCTPromiseResolveBlock,
                                  reject: @escaping RCTPromiseRejectBlock) {
        
        sdk.fetchFoodItemFor(passioID: passioID) {attributes in
            if let attributes = attributes {
                let bridged = bridgePassioFoodItem(attributes)
                resolve(bridged)
            } else {
                resolve(NSNull())
            }
        }
    }
    

    @objc(fetchAttributesForBarcode:withResolver:withRejecter:)
    func fetchAttributesForBarcode(barcode: String,
                                   resolve: @escaping RCTPromiseResolveBlock,
                                   reject: @escaping RCTPromiseRejectBlock) {
        
        sdk.fetchFoodItemFor(productCode: barcode) { attributes in
            if let attributes = attributes {
                let bridged = bridgePassioFoodItem(attributes)
                resolve(bridged)
            } else {
                resolve(NSNull())
            }
        }
    }
    
    @objc(fetchPassioIDAttributesForPackagedFood:withResolver:withRejecter:)
    func fetchPassioIDAttributesForPackagedFood(packagedFoodCode: String,
                                   resolve: @escaping RCTPromiseResolveBlock,
                                   reject: @escaping RCTPromiseRejectBlock) {
        
        sdk.fetchFoodItemFor(productCode: packagedFoodCode) { attributes in
            if let attributes = attributes {
                let bridged = bridgePassioFoodItem(attributes)
                resolve(bridged)
            } else {
                resolve(NSNull())
            }
        }
    }
    
    @objc(searchForFood:withResolver:withRejecter:)
    func searchForFood(searchQuery: String,
                       resolve: @escaping RCTPromiseResolveBlock,
                       reject: @escaping RCTPromiseRejectBlock) {
        
        
        sdk.searchForFood(byText: searchQuery) { searchResponse in
            
            
            if let searchResponse = searchResponse {
                  resolve(bridgeSearchResponse(searchResponse))
            } else {
                resolve(NSNull())
            }
        }
        
    }
    
    
    
    @objc(fetchSearchResult:withResolver:withRejecter:)
    func fetchSearchResult(searchResult: String,
                       resolve: @escaping RCTPromiseResolveBlock,
                       reject: @escaping RCTPromiseRejectBlock) {
        
        var requestBody = preparePassioSearchResult(searchResult)
        
        if let requestBody = requestBody {
            sdk.fetchSearchResult(searchResult: requestBody) { data in
                if let data = data {
                    resolve(bridgePassioFoodItem(data))
                } else {
                    resolve(NSNull())
                }
            }
        } else {
            resolve(NSNull())
        }
        
    }
    
    @objc(fetchSuggestions:withResolver:withRejecter:)
    func fetchSuggestions(searchQuery: String,
                       resolve: @escaping RCTPromiseResolveBlock,
                       reject: @escaping RCTPromiseRejectBlock) {
        
        let mealTime = MealTime(rawValue: searchQuery) ?? MealTime.breakfast
        
        sdk.fetchSuggestions(mealTime: mealTime) { (response: [Any]) in
            
            if let searchResult = response as? [PassioSearchResult] {
                resolve(searchResult.map(bridgePassioSearchResult))
            } else {
                resolve(NSNull())
            }
           
        }
    }
    
    
    
    @objc(fetchFoodItemForSuggestion:withResolver:withRejecter:)
    func fetchFoodItemForSuggestion(searchResult: String,
                       resolve: @escaping RCTPromiseResolveBlock,
                       reject: @escaping RCTPromiseRejectBlock) {
        
        var requestBody = preparePassioSearchResult(searchResult)
        
        if let requestBody = requestBody {
            sdk.fetchFoodItemForSuggestion(suggestion: requestBody) { data in
                if let data = data {
                    resolve(bridgePassioFoodItem(data))
                } else {
                    resolve(NSNull())
                }
            }
        } else {
            resolve(NSNull())
        }
        
    }
    
    @objc
    override class func requiresMainQueueSetup() -> Bool {
      return true
    }
    
    override func supportedEvents() -> [String]! {
        
        return [foodDetectionEventName, completedDownloadingFileEventName, downloadingErrorEventName]
    }

    @objc(convertUPCProductToAttributes:entityType:withResolver:withRejecter:)
    func convertUPCProductToAttributes(json: String,
                                       type: String,
                                       resolve: @escaping RCTPromiseResolveBlock,
                                       reject: @escaping RCTPromiseRejectBlock) {
        
        guard let data = json.data(using: .utf8),
              let upcProduct = try? JSONDecoder().decode(UPCProduct.self, from: data),
              let entityType = PassioIDEntityType(rawValue: type) else {
            
            return resolve(NSNull())
        }
        
        do {
            let foodItem = try PassioFoodItemData(upcProduct: upcProduct)
            
            let attributes = PassioIDAttributes(
                passioID: foodItem.passioID,
                name: foodItem.name,
                foodItemDataForDefault: foodItem,
                entityType: entityType
            )
            
            let bridged = bridgePassioIDAttributes(attributes)
            resolve(bridged)
        } catch let error {
            reject("PASSIO-SDK", "convertUPCProductToAttributes failed", error)
        }
        
        
    }
    
    @objc(detectFoodFromImageURI:withResolver:withRejecter:)
    func detectFoodFromImageURI(imageUri: String,
                                       resolve: @escaping RCTPromiseResolveBlock,
                                       reject: @escaping RCTPromiseRejectBlock) {
        let image = UIImage(contentsOfFile: imageUri)
        let config = FoodDetectionConfiguration(
            detectVisual: true,
            volumeDetectionMode: PassioNutritionAISDK.VolumeDetectionMode.auto,
            detectBarcodes: true,
            detectPackagedFood: true,
            nutritionFacts: true
        )

        if image == nil {
            reject("PASSIO-SDK", "no image found", nil)
        } else {
            sdk.detectFoodIn(image: image!, detectionConfig: config) { foodCandidates in
                if let candidates = foodCandidates {
                    resolve(bridgeFoodCandidate(candidates))
                } else {
                    reject("PASSIO-SDK", "no candidates", nil)
                }
            }
        }
    }
    
    @objc(addToPersonalization:)
    func addToPersonalization(personalizedAlternativeJSON: String) -> Bool {
        guard let data = personalizedAlternativeJSON.data(using: .utf8),
              let personalizedAlternative = try? JSONDecoder().decode(PersonalizedAlternative.self, from: data) else {
            return false
        }
        sdk.addToPersonalization(personalizedAlternative: personalizedAlternative)
        return true
    }

    @objc(fetchTagsFor:withResolver:withRejecter:)
    func fetchTagsFor(passioID: String,
                                       resolve: @escaping RCTPromiseResolveBlock,
                                       reject: @escaping RCTPromiseRejectBlock) {
        sdk.fetchTagsFor(passioID: passioID) { foodItemTags in
            if let tags = foodItemTags {
                resolve(tags)
            } else {
                reject("PASSIO-SDK", "no tags", nil)
            }
        }
    }
    
    @objc(fetchNutrientsFor:withResolver:withRejecter:)
    func fetchNutrientsFor(passioID: String,
                       resolve: @escaping RCTPromiseResolveBlock,
                       reject: @escaping RCTPromiseRejectBlock) {
        
        sdk.fetchInflammatoryEffectData(passioID: passioID) { results in
            
            if let nutrients = results {
                resolve(nutrients.map(bridgePassioNutrient))
            } else {
                reject("PASSIO-SDK", "no nutrients", nil)
            }
           
        }
    }
    

    override var methodQueue: DispatchQueue! {
        .main
    }
}

private let foodDetectionEventName = "onFoodDetection"

extension PassioSDKBridge: FoodRecognitionDelegate {
    
    func recognitionResults(candidates: FoodCandidates?, image: UIImage?, nutritionFacts: PassioNutritionFacts?) {
        
        var body: [String: Any] = [:]
        
        if let candidates = candidates {
            body["candidates"] = bridgeFoodCandidate(candidates)
        }
        
        if let image = image {
            body["image"] = bridgeUIImage(image)
        }
        
        if let nutritionFacts = nutritionFacts,
           let servingSize = nutritionFacts.servingSizeUnitName,
           servingSize.count > 0 {
            body["nutritionFacts"] = bridgeNutritionFacts(nutritionFacts)
        }
        
        sendEvent(withName: foodDetectionEventName, body: body)
    }
}


extension PassioSDKBridge: PassioStatusDelegate {
    func passioStatusChanged(status: PassioStatus) {
        
        
    }
    
    func passioProcessing(filesLeft: Int) {
       
    }
    
    func completedDownloadingAllFiles(filesLocalURLs: [FileLocalURL]) {
       
    }
  
   
    func downloadingError(message: String) {
        var body: [String: Any] = [:]
        body.addIfPresent(key: "message", value: message)
        sendEvent(withName: downloadingErrorEventName, body: body)
    }
    
    func completedDownloadingFile(fileLocalURL: PassioNutritionAISDK.FileLocalURL, filesLeft: Int) {
        var body: [String: Any] = [:]
        body.addIfPresent(key: "filesLeft", value: filesLeft)
        sendEvent(withName: completedDownloadingFileEventName, body: body)
    }

}



import AVFoundation

extension PassioSDKBridge {
    
    
    @objc(requestCameraAuthorization:withRejecter:)
    func requestCameraAuthorization(resolve: @escaping RCTPromiseResolveBlock,
                                   reject: @escaping RCTPromiseRejectBlock) {
        
        if AVCaptureDevice.authorizationStatus(for: .video) == .authorized {
            resolve(true)
        } else {
            AVCaptureDevice.requestAccess(for: .video) { (granted) in
                resolve(granted)
            }
        }
    }
}

private func bridgeFoodCandidate(_ val: FoodCandidates) -> [String: Any] {
    
    var body: [String: Any] = [:]
    
    body["detectedCandidates"] = val.detectedCandidates.map(bridgeDetectedCandidate)
    
    if let barcodeCandidates = val.barcodeCandidates, barcodeCandidates.count > 0 {
        body["barcodeCandidates"] = barcodeCandidates.map(bridgeBarcodeCandidate)
    }
    
    if let packagedFoodCandidates = val.packagedFoodCandidates, packagedFoodCandidates.count > 0 {
        body["packagedFoodCode"] = packagedFoodCandidates.map(bridgePackageFoodCandidate)
    }
    
    return body
}

private func bridgeDetectedCandidate(_ val: DetectedCandidate) -> [String: Any] {
    var body: [String: Any] = [:]
    
    body["passioID"] = val.passioID
    body["foodName"] = val.name
    body["confidence"] = val.confidence
    body["boundingBox"] = bridgeCGRect(val.boundingBox)
    body["alternatives"] = val.alternatives.map(bridgeDetectedCandidate)
    
    body.addIfPresent(key: "croppedImage", value: bridgeUIImage(val.croppedImage))
    
    // Not include in android
    if let amountEstimate = val.amountEstimate, val.amountEstimate != nil {
        body["amountEstimate"] = bridgeAmountEstimate(amountEstimate)
    }

   return body
}

private func bridgeClassificationCandidate(_ val: ClassificationCandidate) -> [String: Any] {
    [
        "passioID": val.passioID,
        "confidence": val.confidence
    ]
}

private func bridgeObjectDetectionCandidate(_ val: ObjectDetectionCandidate) -> [String: Any] {
    var body = bridgeClassificationCandidate(val)
    body["boundingBox"] = bridgeCGRect(val.boundingBox)
    return body
}

private func bridgeCGRect(_ val: CGRect) -> [String: Any] {
    [
        "x": val.origin.x,
        "y": val.origin.y,
        "width": val.width,
        "height": val.height
    ]
}

private func bridgeNutritionFacts(_ val: PassioNutritionFacts) -> [String: Any] {
    var body: [String: Any] = [
        "servingSizeQuantity": val.servingSizeQuantity,
        "servingSizeUnit": val.servingSizeUnit.rawValue
    ]
    body.addIfPresent(key: "servingSizeUnitName", value: val.servingSizeUnitName)
    body.addIfPresent(key: "servingSizeGram", value: val.servingSizeGram)
    body.addIfPresent(key: "calories", value: val.calories)
    body.addIfPresent(key: "fat", value: val.fat)
    body.addIfPresent(key: "carbs", value: val.carbs)
    body.addIfPresent(key: "protein", value: val.protein)
    body.addIfPresent(key: "saturatedFat", value: val.saturatedFat)
    body.addIfPresent(key: "transFat", value: val.transFat)
    body.addIfPresent(key: "cholesterol", value: val.cholesterol)
    body.addIfPresent(key: "sodium", value: val.sodium)
    body.addIfPresent(key: "dietaryFiber", value: val.dietaryFiber)
    body.addIfPresent(key: "sugars", value: val.sugars)
    body.addIfPresent(key: "sugarAlcohol", value: val.sugarAlcohol)
    return body
}

private func bridgePassioIDAttributes(_ val: PassioIDAttributes) -> [String: Any] {
    var body: [String: Any] = [
        "passioID": val.passioID,
        "name": val.name,
        "entityType": val.entityType.rawValue,
        "parents": val.parents?.map(bridgePassioAlternative) ?? [],
        "children": val.children?.map(bridgePassioAlternative) ?? [],
        "siblings": val.siblings?.map(bridgePassioAlternative) ?? []
    ]
    body.addIfPresent(key: "foodItem", value: val.passioFoodItemData.map(bridgeFoodItem))
    body.addIfPresent(key: "recipe", value: val.recipe.map(bridgeRecipe))
    body.addIfPresent(key: "isOpenFood", value: val.isOpenFood)
    return body
}

private func bridgePassioAlternative(_ val: PassioAlternative) -> [String: Any] {
    var body: [String: Any] = [
        "passioID": val.passioID,
        "name": val.name
    ]
    body.addIfPresent(key: "quantity", value: val.quantity)
    body.addIfPresent(key: "unitName", value: val.unitName)
    return body
}


private func bridgeSearchResult(_ val: PassioIDAndName) -> [String: Any] {
    var body: [String: Any] = [
        "passioID": val.passioID,
        "name": val.name
    ]
    return body
}

private func bridgeBarcodeCandidate(_ val: BarcodeCandidate) -> [String: Any] {
    [
        "barcode": val.value,
        "boundingBox": bridgeCGRect(val.boundingBox)
    ]
}

private func bridgePackageFoodCandidate(_ val: PackagedFoodCandidate) -> String {
    return val.packagedFoodCode
}

private func bridgeStringArray(_ val: String) -> String {
    return val
}



private func bridgeFoodItem(_ val: PassioFoodItemData) -> [String: Any] {
    var body: [String: Any] = [
        "passioID": val.passioID,
        "name": val.name,
        "selectedQuantity": val.selectedQuantity,
        "selectedUnit": val.selectedUnit,
        "entityType": val.entityType.rawValue,
        "servingUnits": val.servingUnits.map(bridgeServingUnit),
        "servingSizes": val.servingSizes.map(bridgeServingSize),
        "computedWeight": bridgeMeasurement(val.computedWeight)
    ]
    body.addIfPresent(key: "parents", value: val.parents?.map(bridgePassioAlternative))
    body.addIfPresent(key: "children", value: val.children?.map(bridgePassioAlternative))
    body.addIfPresent(key: "siblings", value: val.siblings?.map(bridgePassioAlternative))
    body.addIfPresent(key: "calories", value: bridgeUnitEnergy(val.totalCalories))
    body.addIfPresent(key: "carbs", value: bridgeUnitMass(val.totalCarbs))
    body.addIfPresent(key: "fat", value: bridgeUnitMass(val.totalFat))
    body.addIfPresent(key: "protein", value: bridgeUnitMass(val.totalProteins))
    body.addIfPresent(key: "saturatedFat", value: bridgeUnitMass(val.totalSaturatedFat))
    body.addIfPresent(key: "transFat", value: bridgeUnitMass(val.totalTransFat))
    body.addIfPresent(key: "monounsaturatedFat", value: bridgeUnitMass(val.totalMonounsaturatedFat))
    body.addIfPresent(key: "polyunsaturatedFat", value: bridgeUnitMass(val.totalPolyunsaturatedFat))
    body.addIfPresent(key: "cholesterol", value: bridgeUnitMass(val.totalCholesterol))
    body.addIfPresent(key: "sodium", value: bridgeUnitMass(val.totalSodium))
    body.addIfPresent(key: "fiber", value: bridgeUnitMass(val.totalFibers))
    body.addIfPresent(key: "sugar", value: bridgeUnitMass(val.totalSugars))
    body.addIfPresent(key: "sugarAdded", value: bridgeUnitMass(val.totalSugarsAdded))
    body.addIfPresent(key: "vitaminD", value: bridgeUnitMass(val.totalVitaminD))
    body.addIfPresent(key: "calcium", value: bridgeUnitMass(val.totalCalcium))
    body.addIfPresent(key: "iron", value: bridgeUnitMass(val.totalIron))
    body.addIfPresent(key: "potassium", value: bridgeUnitMass(val.totalPotassium))
    body.addIfPresent(key: "vitaminC", value: bridgeUnitMass(val.totalVitaminC))
    body.addIfPresent(key: "alcohol", value: bridgeUnitMass(val.totalAlcohol))
    body.addIfPresent(key: "sugarAlcohol", value: bridgeUnitMass(val.totalSugarAlcohol))
    body.addIfPresent(key: "vitaminB12", value: bridgeUnitMass(val.totalVitaminB12))
    body.addIfPresent(key: "vitaminB12Added", value: bridgeUnitMass(val.totalVitaminB12Added))
    body.addIfPresent(key: "vitaminB6", value: bridgeUnitMass(val.totalVitaminB6))
    body.addIfPresent(key: "vitaminE", value: bridgeUnitMass(val.totalVitaminE))
    body.addIfPresent(key: "vitaminEAdded", value: bridgeUnitMass(val.totalVitaminEAdded))
    body.addIfPresent(key: "magnesium", value: bridgeUnitMass(val.totalMagnesium))
    body.addIfPresent(key: "phosphorus", value: bridgeUnitMass(val.totalVitaminEAdded))
    body.addIfPresent(key: "iodine", value: bridgeUnitMass(val.totalIodine))
    body.addIfPresent(key: "vitaminA", value: bridgeMeasurementIU(val.totalVitaminA))
    body.addIfPresent(key: "ingredientsDescription", value: val.ingredientsDescription)
    body.addIfPresent(key: "barcode", value: val.barcode)
    body.addIfPresent(key: "tags", value: val.tags)
    return body
}

private func bridgeServingUnit(_ val: PassioServingUnit) -> [String: Any] {
    [
        "unitName": val.unitName,
        "value": val.weight.value,
        "unit": val.weight.unit.symbol
    ]
}

private func bridgeUnitMass(_ val: Measurement<UnitMass>?) -> [String: Any]? {
    if let messurment = val  {
   return [
      "unit": messurment.unit.symbol,
      "value": messurment.value
    ]}else{
        return nil
    }
}

private func bridgeMeasurementIU(_ val: PassioNutritionAISDK.MeasurementIU?) -> [String: Any]? {
    if let messurment = val  {
   return [
    "unit": messurment.unit,
      "value": messurment.value
    ]}else{
        return nil
    }
}
private func bridgeMeasurementIUDobule(_ val: Double?) -> [String: Any?]? {
    if let messurment = val  {
   return [
    "unit": "IU",
    "value": val
    ]}else{
        return nil
    }
}


private func bridgeUnitEnergy(_ val: Measurement<UnitEnergy>?) -> [String: Any]? {
    if let messurment = val  {
   return [
      "unit": messurment.unit.symbol,
      "value": messurment.value
    ]}else{
        return nil
    }
}

private func bridgeServingSize(_ val: PassioServingSize) -> [String: Any] {
    [
        "quantity": val.quantity,
        "unitName": val.unitName
    ]
}

private func bridgeMeasurement<UnitType: UnitMass>(_ val: Measurement<UnitType>) -> [String: Any] {
    [
        "unit": val.unit.symbol,
        "value": val.value
    ]
}

private func bridgeRecipe(_ val: PassioFoodRecipe) -> [String: Any] {
    [
        "passioID": val.passioID,
        "name": val.name,
        "servingSizes": val.servingSizes.map(bridgeServingSize),
        "servingUnits": val.servingUnits.map(bridgeServingUnit),
        "selectedUnit": val.selectedUnit,
        "selectedQuantity": val.selectedQuantity,
        "foodItems": val.foodItems.map(bridgeFoodItem)
    ]
}


private func bridgeAmountEstimate(_ val: AmountEstimate) -> [String: Any] {
    var body: [String: Any] = [:]
    body.addIfPresent(key: "estimationQuality", value: val.estimationQuality?.rawValue)
    body.addIfPresent(key: "moveDevice", value: val.moveDevice?.rawValue)
    body.addIfPresent(key: "viewingAngle", value: val.viewingAngle)
    body.addIfPresent(key: "volumeEstimate", value: val.volumeEstimate)
    body.addIfPresent(key: "weightEstimate", value: val.weightEstimate)
    return body
}

private func bridgePassioNutrient(_ val: InflammatoryEffectData) -> [String: Any] {
    var body: [String: Any] = [
        "amount": val.amount,
        "name": val.name,
        "inflammatoryEffectScore": val.inflammatoryEffectScore,
        "unit": val.unit,
    ]
    return body
}

private func bridgeUIImage(_ val: UIImage?) -> [String: Any]? {
    
    guard let val else { return nil }
    
    if let base64 = val.jpegData(compressionQuality: 0.85)?.base64EncodedString() {
        return ["base64": base64]
    }
    return nil
  
}

fileprivate extension Dictionary {
    
    mutating func addIfPresent(key: Key, value: Value?) {
        if let val = value {
            self[key] = val
        }
    }
}



//V3


private func bridgePassioFoodItem(_ val: PassioFoodItem) -> [String: Any?] {
    var body = [String: Any?]()
    body["id"] = val.id
    body["name"] = val.name
    body["details"] = val.details
    body["iconId"] = val.iconId
    body["amount"] = bridgePassioFoodAmount(val.amount)
    body["ingredients"] = val.ingredients.map { bridgePassioIngredient($0) }
    body["nutrients"] = bridgePassioNutrients(val.nutrients(weight: val.amount.weight()))
    body["nutrientsReference"] = bridgePassioNutrients(val.nutrientsReference())
    body["nutrientsSelectedSize"] = bridgePassioNutrients(val.nutrientsSelectedSize())
    body["weight"] = bridgeUnitMass(val.weight())
    
    // Not include in android
    body["licenseCopy"] = val.licenseCopy
    body["scannedId"] = val.scannedId
    body["isOpenFood"] = isOpenFood(val)

    return body
}


private func bridgePassioFoodAmount(_ val: PassioFoodAmount) -> [String: Any?]  {
  var body = [String: Any?]()
    
    body["selectedUnit"] = val.selectedUnit
    body["selectedQuantity"] = val.selectedQuantity
    body["weightGrams"] = val.weightGrams()
    body["servingUnits"] = val.servingUnits.map { bridgeServingUnit($0) }
    body["servingSizes"] = val.servingSizes.map { bridgeServingSize($0) }
    body["weight"] = bridgeUnitMass(val.weight())

    return body
}



private func bridgePassioIngredient(_ val: PassioIngredient) -> [String: Any?] {
    var body = [String: Any?]()

    body["name"] = val.name
    body["id"] = val.id
    body["iconId"] = val.iconId
    body["weight"] = bridgeUnitMass(val.weight())
    body["referenceNutrients"] = bridgePassioNutrients(val.referenceNutrients)
    body["nutrients"] = bridgePassioNutrients(val.nutrients(weight: val.weight()))
    body["metadata"] = bridgePassioFoodMetadata(val.metadata)
    body["amount"] = bridgePassioFoodAmount(val.amount)
    return body
}


private func  bridgePassioFoodMetadata(_ val: PassioFoodMetadata) -> [String: Any?] {
    
    var body = [String: Any?]()
    
    body["barcode"] = val.barcode
    body["ingredientsDescription"] = val.ingredientsDescription
    body["foodOrigins"] = val.foodOrigins?.map(bridgePassioFoodOrigin)
    body.addIfPresent(key: "tags", value: val.tags)
    return body
}

private func bridgePassioFoodOrigin(_ val:PassioFoodOrigin) -> [String: Any?] {
    var body = [String: Any?]()
    body["id"] = val.id
    body["licenseCopy"] = val.licenseCopy
    body["source"] = val.source
  return body
}


private func  bridgePassioNutrients(_ val: PassioNutrients) -> [String: Any?] {
    
    var body = [String: Any?]()
    
    body.addIfPresent(key: "weight", value: bridgeUnitMass(val.weight))
    body.addIfPresent(key: "vitaminA",value:  bridgeMeasurementIUDobule(val.vitaminA()))
    body.addIfPresent(key: "alcohol",value:  bridgeUnitMass(val.alcohol()))
    body.addIfPresent(key: "calcium",value:  bridgeUnitMass(val.calcium()))
    body.addIfPresent(key: "calories", value: bridgeUnitEnergy(val.calories()))
    body.addIfPresent(key: "carbs", value: bridgeUnitMass(val.carbs()))
    body.addIfPresent(key: "cholesterol", value: bridgeUnitMass(val.cholesterol()))
    body.addIfPresent(key: "fat", value: bridgeUnitMass(val.fat()))
    body.addIfPresent(key: "fibers", value: bridgeUnitMass(val.fibers()))
    body.addIfPresent(key: "iodine", value: bridgeUnitMass(val.iodine()))
    body.addIfPresent(key: "iron", value: bridgeUnitMass(val.iron()))
    body.addIfPresent(key: "magnesium", value: bridgeUnitMass(val.magnesium()))
    body.addIfPresent(key: "monounsaturatedFat",value:  bridgeUnitMass(val.monounsaturatedFat()))
    body.addIfPresent(key: "phosphorus", value: bridgeUnitMass(val.phosphorus()))
    body.addIfPresent(key: "polyunsaturatedFat", value: bridgeUnitMass(val.polyunsaturatedFat()))
    body.addIfPresent(key: "potassium", value: bridgeUnitMass(val.potassium()))
    body.addIfPresent(key: "protein", value: bridgeUnitMass(val.protein()))
    body.addIfPresent(key: "satFat", value: bridgeUnitMass(val.satFat()))
    body.addIfPresent(key: "sodium", value: bridgeUnitMass(val.sodium()))
    body.addIfPresent(key: "sugarAlcohol", value: bridgeUnitMass(val.sugarAlcohol()))
    body.addIfPresent(key: "sugars", value: bridgeUnitMass(val.sugars()))
    body.addIfPresent(key: "sugarsAdded", value: bridgeUnitMass(val.sugarsAdded()))
    body.addIfPresent(key: "transFat", value: bridgeUnitMass(val.transFat()))
    body.addIfPresent(key: "vitaminB12", value: bridgeUnitMass(val.vitaminB12()))
    body.addIfPresent(key: "vitaminB12Added",value:  bridgeUnitMass(val.vitaminB12Added()))
    body.addIfPresent(key: "vitaminB6",value:  bridgeUnitMass(val.vitaminB6()))
    body.addIfPresent(key: "vitaminC",value: bridgeUnitMass(val.vitaminC()))
    body.addIfPresent(key: "vitaminD", value: bridgeUnitMass(val.vitaminD()))
    body.addIfPresent(key: "vitaminE", value: bridgeUnitMass(val.vitaminE()))
    body.addIfPresent(key: "vitaminEAdded",value:  bridgeUnitMass(val.vitaminEAdded()))
    body.addIfPresent(key: "zinc",value:  bridgeUnitMass(val.zinc()))
    body.addIfPresent(key: "selenium",value:  bridgeUnitMass(val.selenium()))
    body.addIfPresent(key: "folicAcid",value:  bridgeUnitMass(val.folicAcid()))
    body.addIfPresent(key: "vitaminKPhylloquinone",value:  bridgeUnitMass(val.vitaminKPhylloquinone()))
    body.addIfPresent(key: "vitaminKMenaquinone4",value:  bridgeUnitMass(val.vitaminKMenaquinone4()))
    body.addIfPresent(key: "vitaminKDihydrophylloquinone",value:  bridgeUnitMass(val.vitaminKDihydrophylloquinone()))
    body.addIfPresent(key: "chromium",value:  bridgeUnitMass(val.chromium()))

    return body;
}



private func   bridgePassioSearchResult(_ val: PassioSearchResult) -> [String: Any?] {
    var body = [String: Any?]()
    
    body.addIfPresent(key:"brandName", value:  val.brandName)
    body.addIfPresent(key:"foodName", value:  val.foodName)
    body.addIfPresent(key:"iconID", value:   val.iconID)
    body.addIfPresent(key:"labelId", value:  val.labelId)
    body.addIfPresent(key:"nutritionPreview", value:  bridgePassioSearchNutritionPreview(val.nutritionPreview))
    body.addIfPresent(key:"resultId", value:  val.resultId)
    body.addIfPresent(key:"score", value:  val.score)
    body.addIfPresent(key:"scoredName", value:  val.scoredName)
    body.addIfPresent(key:"type", value:  val.type)
    
    //Not include in android
    // Not include in IOS
    //body.addIfPresent(key:"foodName", value:   val.foodName)
  return body
}


private func bridgePassioSearchNutritionPreview(_ preview: PassioSearchNutritionPreview?) -> [String: Any?]? {
    
    guard let preview else { return nil }

    var nutritionPreviewMap = [String: Any?]()
    nutritionPreviewMap["calories"] = preview.calories
    nutritionPreviewMap["carbs"] = preview.carbs
    nutritionPreviewMap["protein"] = preview.protein
    nutritionPreviewMap["name"] = preview.name
    nutritionPreviewMap["servingUnit"] = preview
    nutritionPreviewMap["servingQuantity"] = preview.servingQuantity
    nutritionPreviewMap["servingWeight"] = preview.servingWeight
    return nutritionPreviewMap
}

private func bridgeSearchResponse(_ val: SearchResponse) -> [String: Any?] {
    var body = [String: Any?]()
    
    body.addIfPresent(key: "results", value: val.results.map(bridgePassioSearchResult))
    body["alternatives"] = val.alternateNames.map(bridgeStringArray)
    return body
}

private func isOpenFood(_ foodItem: PassioFoodItem) -> Bool {
    for ingredient in foodItem.ingredients {
        if let foodOrigins = ingredient.metadata.foodOrigins,
           foodOrigins.contains(where: { $0.source == "openfood" }) {
            return true
        }
    }
    return false
}


private func preparePassioSearchResult(_ json: String) -> PassioSearchResult? {
    
   
    do{
        if let json = json.data(using: String.Encoding.utf8){
            if let jsonData = try JSONSerialization.jsonObject(with: json, options: .allowFragments) as? [String:AnyObject]{
               
               return PassioSearchResult(foodName: jsonData["foodName"] as! String, brandName: jsonData["brandName"] as! String, iconID: jsonData["iconID"] as! String, score: jsonData["score"] as! Double, scoredName: jsonData["scoredName"] as! String, labelId: jsonData["labelId"] as! String, type: jsonData["type"] as! String, resultId: jsonData["resultId"] as! String, nutritionPreview: nil)
                
            }else{
                return nil
            }
        }else{
            return nil
        }
    }catch {
       return nil

    }
    
   
}

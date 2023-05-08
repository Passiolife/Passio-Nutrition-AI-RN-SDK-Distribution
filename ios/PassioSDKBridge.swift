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
        
        if let attributes = sdk.lookupPassioIDAttributesFor(passioID: passioID) {
            let bridged = bridgePassioIDAttributes(attributes)
            resolve(bridged)
        } else {
            resolve(NSNull())
        }
    }
    

    @objc(fetchAttributesForBarcode:withResolver:withRejecter:)
    func fetchAttributesForBarcode(barcode: String,
                                   resolve: @escaping RCTPromiseResolveBlock,
                                   reject: @escaping RCTPromiseRejectBlock) {
        
        sdk.fetchPassioIDAttributesFor(barcode: barcode) { attributes in
            if let attributes = attributes {
                let bridged = bridgePassioIDAttributes(attributes)
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
        
        sdk.fetchPassioIDAttributesFor(packagedFoodCode: packagedFoodCode) { attributes in
            if let attributes = attributes {
                let bridged = bridgePassioIDAttributes(attributes)
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
        
        sdk.searchForFood(byText: searchQuery) { results in
            resolve(results.map(bridgeSearchResult))
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
        body["packagedFoodCandidates"] = packagedFoodCandidates
    }
    
    return body
}

private func bridgeDetectedCandidate(_ val: DetectedCandidate) -> [String: Any] {
    var body: [String: Any] = [:]
    
    body["passioID"] = val.passioID
    body["confidence"] = val.confidence
    body["boundingBox"] = val.boundingBox
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
    return body
}

private func bridgeServingUnit(_ val: PassioServingUnit) -> [String: Any] {
    [
        "unitName": val.unitName,
        "value": val.weight.value
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

private func bridgeMeasurement<UnitType: Unit>(_ val: Measurement<UnitType>) -> [String: Any] {
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
fileprivate extension Dictionary {
    
    mutating func addIfPresent(key: Key, value: Value?) {
        if let val = value {
            self[key] = val
        }
    }
}

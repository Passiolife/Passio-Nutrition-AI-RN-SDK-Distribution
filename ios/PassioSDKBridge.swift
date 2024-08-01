import Foundation
#if canImport(PassioSDK)
import PassioNutritionAI
#elseif canImport(PassioNutritionAISDK)
import PassioNutritionAISDK
#endif

@objc(PassioSDKBridge)
class PassioSDKBridge: RCTEventEmitter {
    
    private let sdk = PassioNutritionAI.shared
    private let nutritionAdvisorSDK = NutritionAdvisor.shared
    private var debugMode = false
    private let completedDownloadingFileEventName = "completedDownloadingFile"
    private let downloadingErrorEventName = "downloadingError"
    private let onPassioStatusChangedEventName = "onPassioStatusChanged"
    private let tokenBudgetUpdatedEVentName = "tokenBudgetUpdated"
    
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
    

    @objc(accountUsageUpdates)
    func accountUsageUpdates() {
        sdk.accountDelegate = self
    }
       

    @objc(enableFlashlight:level:)
     func enableFlashlight(enabled: Bool, level: Float) {
       // Replace 'sdk' with your actual SDK or implementation
       sdk.enableFlashlight(enabled: enabled, level: level)
     }

    @objc(setCameraVideoZoom:)
     func setCameraVideoZoom(toVideoZoomFactor: CGFloat) {
       // Replace 'sdk' with your actual SDK or implementation
       sdk.setCamera(toVideoZoomFactor: toVideoZoomFactor)
     }
    
    func mapFromMinMaxCameraZoomLevel(minMax: (minLevel: CGFloat?, maxLevel: CGFloat?)) -> [String: Any?] {
            var map = [String: Any?]()
            map["minZoomLevel"] = minMax.minLevel
            map["maxZoomLevel"] = minMax.maxLevel
            return map
        }
    
    
    @objc(getMinMaxCameraZoomLevel:withRejecter:)
       func getMinMaxCameraZoomLevel(resolve: @escaping RCTPromiseResolveBlock,
                                     reject: @escaping RCTPromiseRejectBlock) -> Void {
           let callback = sdk.getMinMaxCameraZoomLevel
           let body = mapFromMinMaxCameraZoomLevel(minMax: callback)
           resolve(body)
       }
    
    
    
    @objc(setTapToFocus:)
     func setTapToFocus(pointOfInterest: String) {
        if let preparedPoint = prepareCGPoint(pointOfInterest) {
             sdk.setTapToFocus(pointOfInterest: preparedPoint)
         }
     }
        
    @objc(startFoodDetection:detectPackagedFood:volumeDetectionMode:detectVisual:)
    func startFoodDetection(detectBarcodes: Bool, detectPackagedFood: Bool,volumeDetectionMode:String?,detectVisual:Bool = true) {
        
        var mode = PassioNutritionAISDK.VolumeDetectionMode.auto
        
        if let detectionMode = volumeDetectionMode {
            if(detectionMode == "auto"){
                mode = PassioNutritionAISDK.VolumeDetectionMode.auto
            }else  if(detectionMode == "dualWideCamera"){
                mode = PassioNutritionAISDK.VolumeDetectionMode.dualWideCamera
            }else  if(detectionMode == "none"){
                mode = PassioNutritionAISDK.VolumeDetectionMode.none
            }
        }
        
        let config = FoodDetectionConfiguration(
            detectVisual: detectVisual,
            volumeDetectionMode: mode,
            detectBarcodes: detectBarcodes,
            detectPackagedFood: detectPackagedFood
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
    
    @objc(startNutritionFactsDetection)
    func startNutritionFactsDetection() {
        
       
        if #available(iOS 13.0, *) {
            if debugMode {
                
                print("PassioSDK: Starting nutrition detection...")
            }
            
            sdk.startNutritionFactsDetection(nutritionfactsDelegate: self) { [weak self] (isReady) in
                
                
                if self?.debugMode == true {
                    
                    print("PassioSDK: nutrition detection ready = \(isReady)")
                }
            }
            
        } else {
            print("PassioSDK Error: nutrition detection only supported on iOS 13 and above")
        }
    }
    
    @objc(stopNutritionFactsDetection)
    func stopNutritionFactsDetection() {
        
        if debugMode {
            print("PassioSDK: Stopping nutrition detection...")
        }
        
        sdk.stopFoodDetection()
    }
    
    
    @objc(fetchFoodItemForPassioID:withResolver:withRejecter:)
    func fetchFoodItemForPassioID(passioID: String,
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
    
    

    
    @objc(fetchFoodItemLegacy:withResolver:withRejecter:)
    func fetchFoodItemLegacy(passioID: String,
                                  resolve: @escaping RCTPromiseResolveBlock,
                                  reject: @escaping RCTPromiseRejectBlock) {
        
        sdk.fetchFoodItemLegacy(from:passioID) {attributes in
            if let attributes = attributes {
                let bridged = bridgePassioFoodItem(attributes)
                resolve(bridged)
            } else {
                resolve(NSNull())
            }
        }
    }
    
    @objc(fetchFoodItemForRefCode:withResolver:withRejecter:)
    func fetchFoodItemForRefCode(refCode: String,
                                  resolve: @escaping RCTPromiseResolveBlock,
                                  reject: @escaping RCTPromiseRejectBlock) {
        
        sdk.fetchFoodItemFor(refCode: refCode) {attributes in
            if let attributes = attributes {
                let bridged = bridgePassioFoodItem(attributes)
                resolve(bridged)
            } else {
                resolve(NSNull())
            }
        }
    }
 
    
    @objc(fetchFoodItemForProductCode:withResolver:withRejecter:)
    func fetchFoodItemForProductCode(code: String,
                                   resolve: @escaping RCTPromiseResolveBlock,
                                   reject: @escaping RCTPromiseRejectBlock) {
                sdk.fetchFoodItemFor(productCode: code) { attributes in
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
    
    
    
    
    @objc(fetchFoodItemForDataInfo:weightGram:withResolver:withRejecter:)
    func fetchFoodItemForDataInfo(searchResult: String,
                                  weightGram: String,
                                  resolve: @escaping RCTPromiseResolveBlock,
                                  reject: @escaping RCTPromiseRejectBlock) {
        
        // Attempt to convert weightGram from String to Double
        let weightGramDouble: Double?
        if let weight = Double(weightGram), weight >= 0 {
            weightGramDouble = weight
        } else {
            weightGramDouble = nil
        }
        
        // Prepare the request body
        if let requestBody = preparePassioFoodDataInfo(searchResult) {
            // Fetch the food item
            sdk.fetchFoodItemFor(foodItem: requestBody, weightGrams: weightGramDouble) { data in
                if let data = data {
                    // Resolve with the data if available
                    resolve(bridgePassioFoodItem(data))
                } else {
                    // Resolve with NSNull if no data
                    resolve(NSNull())
                }
            }
        } else {
            // Resolve with NSNull if requestBody is nil
            resolve(NSNull())
        }
    }
    
    @objc(fetchSuggestions:withResolver:withRejecter:)
    func fetchSuggestions(searchQuery: String,
                       resolve: @escaping RCTPromiseResolveBlock,
                       reject: @escaping RCTPromiseRejectBlock) {
        
        let mealTime = PassioMealTime(rawValue: searchQuery) ?? PassioMealTime.breakfast
        
        sdk.fetchSuggestions(mealTime: mealTime) { (response: [Any]) in
            
            if let searchResult = response as? [PassioFoodDataInfo] {
                resolve(searchResult.map(bridgePassioFoodDataInfo))
            } else {
                resolve(NSNull())
            }
           
        }
    }    
    @objc(recognizeSpeechRemote:withResolver:withRejecter:)
    func recognizeSpeechRemote(text: String,
                       resolve: @escaping RCTPromiseResolveBlock,
                       reject: @escaping RCTPromiseRejectBlock) {
        
       
        sdk.recognizeSpeechRemote(from: text) { (response: [Any]) in
            
            if let result = response as? [PassioSpeechRecognitionModel] {
                resolve(result.map(bridgePassioSpeechRecognitionModel))
            } else {
                resolve(NSNull())
            }
           
        }
    }
    
    @objc(recognizeImageRemote:message:resolution:withResolver:withRejecter:)
    func recognizeImageRemote(imageUri: String,
                              message:String?,
                              resolution:String,
                                       resolve: @escaping RCTPromiseResolveBlock,
                                       reject: @escaping RCTPromiseRejectBlock) {
        let image = UIImage(contentsOfFile: imageUri)
        if image == nil {
            reject("PASSIO-SDK", "no image found", nil)
        } else {
       
            let resolutionType: PassioImageResolution

            if resolution == "RES_512" {
                resolutionType = PassioImageResolution.res_512
            } else if resolution == "RES_1080" {
                resolutionType = PassioImageResolution.res_1080
            } else {
                resolutionType = PassioImageResolution.full
            }
      

            sdk.recognizeImageRemote(image: image!,resolution: resolutionType,message: message) { (response: [Any]) in
                
                if let result = response as? [PassioAdvisorFoodInfo] {
                    resolve(result.map(bridgePassioAdvisorFoodInfo))
                } else {
                    resolve(NSNull())
                }
               }
         }
    }
    
    
    @objc
    override class func requiresMainQueueSetup() -> Bool {
      return true
    }
    
    override func supportedEvents() -> [String]! {
        
        return [foodDetectionEventName,nutritionFactsRecognitionEventName,onPassioStatusChangedEventName, completedDownloadingFileEventName, downloadingErrorEventName,tokenBudgetUpdatedEVentName]
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
            detectPackagedFood: true
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
    
   
    
    @objc(addToPersonalization:visualCadidate:)
    func addToPersonalization(visualCadidate: String, alternative: String) -> Bool {
        guard
            let visualCadidateData = visualCadidate.data(using: .utf8),
            let visualCadidateJSON = try? JSONSerialization.jsonObject(with: visualCadidateData) as? [String: Any],
            let alternativeData = alternative.data(using: .utf8),
            let alternativeJSON = try? JSONSerialization.jsonObject(with: alternativeData) as? [String: Any],
            let visualCadidateImp = DetectedCandidateImp(dict: visualCadidateJSON),
            let alternativeImp = DetectedCandidateImp(dict: alternativeJSON)
        else {
            return false
        }
        
        sdk.addToPersonalization(visualCadidate: visualCadidateImp, alternative: alternativeImp)
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
    
    @objc(fetchMealPlans:withRejecter:)
    func fetchMealPlans(
                       resolve: @escaping RCTPromiseResolveBlock,
                       reject: @escaping RCTPromiseRejectBlock) {
        
        sdk.fetchMealPlans() {  (results: [Any]) in
            if let mealPlans = results as? [PassioMealPlan]  {
                return resolve(mealPlans.map(bridgePassioMealPlan))
            } else {
                return resolve(NSNull())
            }
           
        }
    }
    
    @objc(fetchMealPlanForDay:day:withResolver:withRejecter:)
    func fetchMealPlanForDay(mealPlanLabel:String,
                             day:Int,
                             resolve: @escaping RCTPromiseResolveBlock,
                             reject: @escaping RCTPromiseRejectBlock) {
        
        sdk.fetchMealPlanForDay(mealPlanLabel: mealPlanLabel, day: day) {  (results: [Any]) in
            if let mealPlans = results as? [PassioMealPlanItem]  {
                return resolve(mealPlans.map(bridgePassioMealPlanItem))
            } else {
                return resolve(NSNull())
            }
           
        }
    }
    
    
    @objc(fetchHiddenIngredients:withResolver:withRejecter:)
    func fetchHiddenIngredients(
        foodName:String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock) {
            
         sdk.fetchHiddenIngredients(foodName:foodName) { status in
                resolve(bridgePassioFetchPassioAdvisorFoodInfos(status))
            }
        }
    
    
    @objc(fetchVisualAlternatives:withResolver:withRejecter:)
    func fetchVisualAlternatives(
        foodName:String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock) {
            
            sdk.fetchVisualAlternatives(foodName:foodName) { status in
                resolve(bridgePassioFetchPassioAdvisorFoodInfos(status))
            }
        }
    
     @objc(fetchPossibleIngredients:withResolver:withRejecter:)
    func fetchPossibleIngredients(
        foodName:String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock) {
            
            sdk.fetchPossibleIngredients(foodName:foodName) { status in
                resolve(bridgePassioFetchPassioAdvisorFoodInfos(status))
            }
        }
    

    // Nutiriton AI SDK (nutritionAdvisorSDK)
   
    
    @objc(initConversationAIAdvisor:withRejecter:)
    func initConversationAIAdvisor(
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock) {
            
            nutritionAdvisorSDK.initConversation() { status in
                switch status {
                case .success:
                    resolve([
                        "status": "Success"
                    ])
                case .failure(let error):
                    resolve([
                        "status": "Error",
                        "message": error.errorMessage
                    ])
                }
            }
        }
    
    @objc(sendMessageAIAdvisor:withResolver:withRejecter:)
    func sendMessageAIAdvisor(message:String,
                            resolve: @escaping RCTPromiseResolveBlock,
                            reject: @escaping RCTPromiseRejectBlock) {
        
        nutritionAdvisorSDK.sendMessage(message: message) { status in
            resolve(bridgePassioAdvisorResultResponse(status))
    
        }
    } 
    
    @objc(sendImageAIAdvisor:withResolver:withRejecter:)
    func sendImageAIAdvisor(imageUri: String,
                   resolve: @escaping RCTPromiseResolveBlock,
                   reject: @escaping RCTPromiseRejectBlock) {
        let image = UIImage(contentsOfFile: imageUri)
        if image == nil {
            reject("PASSIO-SDK", "no image found", nil)
        } else {
            nutritionAdvisorSDK.sendImage(image: image!) { status in
                resolve(bridgePassioAdvisorResultResponse(status))
                
            }
        }
    }
    
    @objc(fetchIngredientsAIAdvisor:withResolver:withRejecter:)
    func fetchIngredientsAIAdvisor(response:String,
                            resolve: @escaping RCTPromiseResolveBlock,
                            reject: @escaping RCTPromiseRejectBlock) {
        
        nutritionAdvisorSDK.fetchIngridients(from:preparePassioAdvisorResponse(response)!) { status in
            resolve(bridgePassioAdvisorResultResponse(status))
    
        }
    }
    

    
    
    
    override var methodQueue: DispatchQueue! {
        .main
    }
}

private let foodDetectionEventName = "onFoodDetection"
private let nutritionFactsRecognitionEventName = "NutritionFactsRecognitionListener"

extension PassioSDKBridge: FoodRecognitionDelegate {
    
    func recognitionResults(candidates: FoodCandidates?, image: UIImage?) {
        
        var body: [String: Any] = [:]
        
        if let candidates = candidates {
            body["candidates"] = bridgeFoodCandidate(candidates)
        }
        
        if let image = image {
            body["image"] = bridgeUIImage(image)
        }
        
        sendEvent(withName: foodDetectionEventName, body: body)
    }
}
extension PassioSDKBridge: NutritionFactsDelegate {
    
    func recognitionResults(nutritionFacts: PassioNutritionFacts?, text: String?) {
       
        var body: [String: Any] = [:]
        
        if let nutritionFact = nutritionFacts {
            body["nutritionFacts"] = bridgeNutritionFacts(nutritionFact)
        }
        
        if let textResult = text {
            body["text"] = textResult
        }
        
        sendEvent(withName: nutritionFactsRecognitionEventName, body: body)
    }
}
extension PassioSDKBridge: PassioAccountDelegate {

    func tokenBudgetUpdated(tokenBudget: PassioNutritionAISDK.PassioTokenBudget) {
        
        tokenBudget.debugPrint()
        sendEvent(withName: tokenBudgetUpdatedEVentName, body: bridgePassioTokenBudget(tokenBudget))
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
    var body: [String: Any] = [:]
    
    body.addIfPresent(key: "servingSizeQuantity", value: val.servingSizeQuantity)
    body.addIfPresent(key: "servingSizeUnit", value: val.servingSizeUnit)
    
    body.addIfPresent(key: "servingSizeUnitName", value: val.servingSizeUnitName)
    body.addIfPresent(key: "calories", value: val.calories)
    body.addIfPresent(key: "fat", value: val.fat)
    body.addIfPresent(key: "carbs", value: val.carbs)
    body.addIfPresent(key: "protein", value: val.protein)
    body.addIfPresent(key: "saturatedFat", value: val.saturatedFat)
    body.addIfPresent(key: "transFat", value: val.transFat)
    body.addIfPresent(key: "cholesterol", value: val.cholesterol)
    body.addIfPresent(key: "sugarAlcohol", value: val.sugarAlcohol)
    
    
    body.addIfPresent(key: "servingSizeGram", value: val.servingSizeGram)
    body.addIfPresent(key: "sodium", value: val.sodium)
    body.addIfPresent(key: "dietaryFiber", value: val.dietaryFiber)
    body.addIfPresent(key: "sugars", value: val.sugars)
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

private func bridgePassioMealPlan(_ val: PassioMealPlan) -> [String: Any] {
    var body: [String: Any] = [:]
    body.addIfPresent(key: "carbsTarget", value: val.carbsTarget)
    body.addIfPresent(key: "fatTarget", value: val.fatTarget)
    body.addIfPresent(key: "mealPlanLabel", value: val.mealPlanLabel)
    body.addIfPresent(key: "mealPlanTitle", value: val.mealPlanTitle)
    body.addIfPresent(key: "proteinTarget", value: val.proteinTarget)
    return body
}

private func bridgePassioMealPlanItem(_ val: PassioMealPlanItem) -> [String: Any] {
    var body: [String: Any] = [:]
    
    body.addIfPresent(key: "dayNumber", value: val.dayNumber)
    body.addIfPresent(key: "dayTitle", value: val.dayTitle)
    body.addIfPresent(key: "mealTime", value: val.mealTime?.rawValue)
     if let mealSearchResult = val.meal {
        body.addIfPresent(key: "meal", value:bridgePassioFoodDataInfo(mealSearchResult))
    }
   
    
    return body
}

private func bridgePassioAdvisorResponse(_ val: PassioAdvisorResponse) -> [String: Any] {
    var body: [String: Any] = [:]
    body.addIfPresent(key: "messageId", value: val.messageId)
    body.addIfPresent(key: "rawContent", value: val.rawContent)
    body.addIfPresent(key: "markupContent", value: val.markupContent)
    
    if let tools = val.tools, tools.count > 0 {
        body["tools"] = tools.map(bridgeStringArray)
    }
    
    if let extractedIngredients = val.extractedIngredients, extractedIngredients.count > 0 {
        body["extractedIngredients"] = extractedIngredients.map(bridgePassioAdvisorFoodInfo)
    }
    
    return body
}

private func bridgePassioAdvisorResultResponse(_ status: Result<PassioAdvisorResponse, NetworkError>) -> [String: Any] {
    var body: [String: Any] = [:]
    switch status {
    case .success:
        do {
            body.addIfPresent(key: "status", value: "Success")
            body.addIfPresent(key: "response", value: try bridgePassioAdvisorResponse(status.get()))
        } catch {
            body.addIfPresent(key: "status", value: "Error")
            body.addIfPresent(key: "message", value: error.localizedDescription)
        }
        
    case .failure(let error):
        body.addIfPresent(key: "status", value: "Error")
        body.addIfPresent(key: "message", value: error.errorMessage)
    }
    return body
}

private func bridgePassioFetchPassioAdvisorFoodInfos(_ status: Result<[PassioAdvisorFoodInfo], NetworkError>) -> [String: Any] {
    
    var body: [String: Any] = [:]
    switch status {
    case .success:
        do {
            body.addIfPresent(key: "status", value: "Success")
            
            
            body.addIfPresent(key: "response", value: try status.get().map(bridgePassioAdvisorFoodInfo))
        } catch {
            body.addIfPresent(key: "status", value: "Error")
            body.addIfPresent(key: "message", value: error.localizedDescription)
        }
        
    case .failure(let error):
        body.addIfPresent(key: "status", value: "Error")
        body.addIfPresent(key: "message", value: error.errorMessage)
    }
    return body
}

private func bridgePassioTokenBudget(_ val: PassioTokenBudget) -> [String: Any] {
    var body: [String: Any] = [:]
    body.addIfPresent(key: "budgetCap", value: val.budgetCap)
    body.addIfPresent(key: "periodUsage", value: val.periodUsage)
    body.addIfPresent(key: "requestUsage", value: val.requestUsage)
    body.addIfPresent(key: "usedPercent", value: val.usedPercent)
    return body
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
    body["ingredientWeight"] = bridgeUnitMass(val.ingredientWeight())
    // Not include in android
    body["licenseCopy"] = val.licenseCopy
    body["scannedId"] = val.scannedId
    body["refCode"] = val.refCode
    body["isOpenFood"] = isOpenFood(val)
    body["openFoodLicense"] = openFoodLicense(val)

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
    body["refCode"] = val.refCode
    body["weight"] = bridgeUnitMass(val.weight())
    body["referenceNutrients"] = bridgePassioNutrients(val.referenceNutrients)
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



private func   bridgePassioFoodDataInfo(_ val: PassioFoodDataInfo) -> [String: Any?] {
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
    body.addIfPresent(key:"isShortName", value:  val.isShortName)
    
    //Not include in android
    // Not include in IOS
    //body.addIfPresent(key:"foodName", value:   val.foodName)
  return body
}


private func   bridgePassioSpeechRecognitionModel(_ val: PassioSpeechRecognitionModel) -> [String: Any?] {
    var body = [String: Any?]()
    
    body.addIfPresent(key:"date", value:  val.date)
    
    if let mealTime = val.meal?.rawValue{
       body.addIfPresent(key:"mealTime", value:  mealTime.lowercased())
    }
    
    if let action = val.action?.rawValue{
       body.addIfPresent(key:"action", value:  action.lowercased())
    }
    
    body.addIfPresent(key:"advisorInfo", value:  bridgePassioAdvisorFoodInfo(val.advisorFoodInfo))
  return body
}

private func   bridgePassioAdvisorFoodInfo(_ val: PassioAdvisorFoodInfo) -> [String: Any?] {
    var body = [String: Any?]()
    
    body.addIfPresent(key:"portionSize", value:  val.portionSize)
    body.addIfPresent(key:"weightGrams", value:  val.weightGrams)
    body.addIfPresent(key:"recognisedName", value:  val.recognisedName)
    body.addIfPresent(key:"foodDataInfo", value:  bridgePassioFoodDataInfo(val.foodDataInfo))
 
  return body
}


private func bridgePassioSearchNutritionPreview(_ preview: PassioSearchNutritionPreview?) -> [String: Any?]? {
    
    guard let preview else { return nil }

    var nutritionPreviewMap = [String: Any?]()
    nutritionPreviewMap["calories"] = preview.calories
    nutritionPreviewMap["carbs"] = preview.carbs
    nutritionPreviewMap["protein"] = preview.protein
    nutritionPreviewMap["fat"] = preview.fat
    nutritionPreviewMap["servingQuantity"] = preview.servingQuantity
    nutritionPreviewMap["servingUnit"] = preview.servingUnit
    nutritionPreviewMap["weightUnit"] = preview.weightUnit
    nutritionPreviewMap["weightQuantity"] = preview.weightQuantity
    return nutritionPreviewMap
}

private func bridgeSearchResponse(_ val: SearchResponse) -> [String: Any?] {
    var body = [String: Any?]()
    
    body.addIfPresent(key: "results", value: val.results.map(bridgePassioFoodDataInfo))
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

private func openFoodLicense(_ foodItem: PassioFoodItem) -> String {
    return foodItem.licenseCopy
}




private func preparePassioSearchNutritionPreview(_ json: String) -> PassioSearchNutritionPreview? {
    
   
    do{
        if let json = json.data(using: String.Encoding.utf8){
            if let jsonData = try JSONSerialization.jsonObject(with: json, options: .allowFragments) as? [String:AnyObject]{
               
                return PassioSearchNutritionPreview(calories: jsonData["calories"] as! Int, carbs: jsonData["carbs"] as! Double, fat: jsonData["fat"] as! Double, protein: jsonData["protein"] as! Double, servingUnit: jsonData["servingUnit"] as! String, servingQuantity: jsonData["servingQuantity"] as! Double, weightUnit: jsonData["weightUnit"] as! String, weightQuantity: jsonData["weightQuantity"] as! Double)
                
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

private func prepareCGPoint(_ json: String) -> CGPoint? {
    
   
    do{
        if let json = json.data(using: String.Encoding.utf8){
            if let jsonData = try JSONSerialization.jsonObject(with: json, options: .allowFragments) as? [String:AnyObject]{
              
                return CGPoint(x: jsonData["x"] as! Double, y: jsonData["y"] as! Double)
                
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

private func preparePassioFoodDataInfo(_ json: String) -> PassioFoodDataInfo? {
    
   
    do{
        if let json = json.data(using: String.Encoding.utf8){
            if let jsonData = try JSONSerialization.jsonObject(with: json, options: .allowFragments) as? [String:AnyObject]{
              
                return PassioFoodDataInfo(foodName: jsonData["foodName"] as! String, brandName: jsonData["brandName"] as! String, iconID: jsonData["iconID"] as! String, score: jsonData["score"] as! Double, scoredName: jsonData["scoredName"] as! String, labelId: jsonData["labelId"] as! String, type: jsonData["type"] as! String, resultId: jsonData["resultId"] as! String, nutritionPreview: nil, isShortName:(jsonData["isShortName"] as? Bool) ?? true)
                
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

private func preparePassioAdvisorResponse(_ json: String) -> PassioAdvisorResponse? {
    
    
    if let jsonData = json.data(using: .utf8) {
        do {
            // Decode the JSON data into PassioAdvisorResponse
            let response = try JSONDecoder().decode(PassioAdvisorResponse.self, from: jsonData)
            return response
        } catch {
            return nil
        }
    } else {
        return nil
    }
    
}


// ------------------------------------------------------------- Equatable ------------------------------------------------------------


struct DetectedCandidateImp: DetectedCandidate, Equatable {
    

    static func == (lhs: DetectedCandidateImp,
                    rhs: DetectedCandidateImp) -> Bool {
        lhs.passioID == rhs.passioID &&
        lhs.boundingBox == rhs.boundingBox &&
        lhs.confidence == rhs.confidence &&
        lhs.croppedImage == rhs.croppedImage
    }
    public var name: String
    public var passioID: PassioID
    public var confidence: Double
    public var boundingBox: CGRect
    public var croppedImage: UIImage?
    public var amountEstimate: AmountEstimate?
    public var alternatives: [DetectedCandidate]
    public var mappingID: PassioID

 
    init?(dict: [String: Any]?) {
        guard let dict = dict else { return nil }
        self.name = (dict["name"] as? String) ?? ""
        self.passioID = (dict["passioID"] as? String) ?? ""
        self.confidence = (dict["confidence"] as? Double) ?? 0
        self.mappingID = (dict["mappingID"] as? String) ?? ""
        
        if let _alternatives = dict["alternatives"] as? [[String:Any]]{
            self.alternatives = _alternatives.map({DetectedCandidateImp(dict: $0)!})
        }else {
            self.alternatives = []
        }
        self.boundingBox = CGRect.zero
        self.amountEstimate = nil
        self.croppedImage = nil
    }

}


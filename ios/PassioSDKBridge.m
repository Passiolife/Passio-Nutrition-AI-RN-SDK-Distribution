#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(PassioSDKBridge, RCTEventEmitter)

RCT_EXTERN_METHOD(configure:(NSString *)key
                  debugMode:(NSInteger)debugMode
                  autoUpdate:(BOOL)autoUpdate
                  remoteOnly:(BOOL)remoteOnly
                  localModelURLs:(NSArray *)modelURLs
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(accountUsageUpdates)

RCT_EXTERN_METHOD(requestCameraAuthorization:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(startFoodDetection:(BOOL)detectBarcodes
                  detectPackagedFood:(BOOL)detectPackagedFood
                  volumeDetectionMode:(NSString *)volumeDetectionMode
                  detectVisual:(BOOL)detectVisual)


RCT_EXTERN_METHOD(stopFoodDetection)

RCT_EXTERN_METHOD(stopNutritionFactsDetection)

RCT_EXTERN_METHOD(startNutritionFactsDetection)

RCT_EXTERN_METHOD(fetchFoodItemForPassioID:(NSString *)passioID
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(fetchFoodItemLegacy:(NSString *)passioID
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(fetchFoodItemForRefCode:(NSString *)refCode
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(fetchFoodItemForProductCode:(NSString *)code
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)


RCT_EXTERN_METHOD(searchForFood:(NSString *)searchQuery
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)


RCT_EXTERN_METHOD(searchForFoodSemantic:(NSString *)term
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)


RCT_EXTERN_METHOD(detectFoodFromImageURI: (NSString *)imageUri
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)


RCT_EXTERN_METHOD(recognizeImageRemote: (NSString *)imageUri
                  message: (NSString *)message
                  resolution: (NSString *)resolution
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)



RCT_EXTERN_METHOD(recognizeNutritionFactsRemote: (NSString *)imageUri
                  resolution: (NSString *)resolution
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(addToPersonalization: (NSString *)visualCadidate
                  (NSString *)alternative)

RCT_EXTERN_METHOD(fetchTagsFor: (NSString *)refCode
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(updateLanguage: (NSString *)languageCode
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(fetchNutrientsFor:(NSString *)refCode
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(fetchFoodItemForDataInfo:(NSString *)searchResult
                  servingQuantity:(NSString *)servingQuantity
                  servingUnit:(NSString *)servingUnit
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(fetchSuggestions:(NSString *)searchQuery
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(recognizeSpeechRemote:(NSString *)text
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)


RCT_EXTERN_METHOD(fetchMealPlans:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(fetchMealPlanForDay:(NSString *)mealPlanLabel
                  day:(NSInteger *)day
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)


RCT_EXTERN_METHOD(sendMessageAIAdvisor: (NSString *)message
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(sendImageAIAdvisor: (NSString *)imageUri
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)


RCT_EXTERN_METHOD(initConversationAIAdvisor:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(fetchIngredientsAIAdvisor:(NSString *)response
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)


RCT_EXTERN_METHOD(fetchHiddenIngredients:(NSString *)foodName
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(fetchVisualAlternatives:(NSString *)foodName
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(fetchPossibleIngredients:(NSString *)foodName
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(enableFlashlight:(BOOL)enabled level:(float)level)

RCT_EXTERN_METHOD(setCameraVideoZoom:(CGFloat)toVideoZoomFactor)

RCT_EXTERN_METHOD(setTapToFocus:(NSString *)pointOfInterest)

RCT_EXTERN_METHOD(getMinMaxCameraZoomLevel:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(reportFoodItem:(NSString *)refCode
                  productCode:(NSString *)productCode
                  notes:(NSString *)notes
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)


RCT_EXTERN_METHOD(submitUserCreatedFood:(NSString *)passioFoodItem
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)
                  
                  
RCT_EXTERN_METHOD(predictNextIngredients:(NSString *)ingredientsJson
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

@end

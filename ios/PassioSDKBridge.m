#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(PassioSDKBridge, RCTEventEmitter)

RCT_EXTERN_METHOD(configure:(NSString *)key
                  debugMode:(NSInteger)debugMode
                  autoUpdate:(BOOL)autoUpdate
                  localModelURLs:(NSArray *)modelURLs
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(requestCameraAuthorization:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(startFoodDetection:(BOOL)detectBarcodes
                  detectPackagedFood:(BOOL)detectPackagedFood
                  detectNutritionFacts:(BOOL)detectNutritionFacts)

RCT_EXTERN_METHOD(stopFoodDetection)

RCT_EXTERN_METHOD(fetchFoodItemForPassioID:(NSString *)passioID
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


RCT_EXTERN_METHOD(detectFoodFromImageURI: (NSString *)imageUri
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(addToPersonalization: (NSString *)visualCadidate
                  (NSString *)alternative)

RCT_EXTERN_METHOD(fetchTagsFor: (NSString *)passioID
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(fetchNutrientsFor:(NSString *)passioID
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(fetchFoodItemForDataInfo:(NSString *)searchResult
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(fetchSuggestions:(NSString *)searchQuery
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)


RCT_EXTERN_METHOD(fetchMealPlans:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(fetchMealPlanForDay:(NSString *)mealPlanLabel
                  day:(NSInteger *)day
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)


@end

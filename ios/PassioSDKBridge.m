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

RCT_EXTERN_METHOD(getAttributesForPassioID:(NSString *)passioID
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(fetchAttributesForBarcode:(NSString *)barcode
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(fetchPassioIDAttributesForPackagedFood:(NSString *)packagedFoodCode
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(searchForFood:(NSString *)searchQuery
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(convertUPCProductToAttributes: (NSString *)upcJSON
                  entityType: (NSString *)entityType
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(detectFoodFromImageURI: (NSString *)imageUri
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(addToPersonalization: (NSString *)personalizedAlternativeJSON)

@end

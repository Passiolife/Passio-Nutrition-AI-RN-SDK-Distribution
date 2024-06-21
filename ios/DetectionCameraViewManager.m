//
//  DetectionCameraViewManager.m
//  LogoDetector
//
//  Created by Patrick Goley on 2/2/21.
//

#import <Foundation/Foundation.h>

#if __has_include("ReactNativePassioSDK-Swift.h")
#import "ReactNativePassioSDK-Swift.h"
#else
#import <ReactNativePassioSDK/ReactNativePassioSDK-Swift.h>
#endif

#import <React/RCTViewManager.h>

@interface DetectionCameraViewManager: RCTViewManager
@end

@implementation DetectionCameraViewManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(config,  NSDictionary*)

- (UIView *) view {
  DetectionCameraView *view = [[DetectionCameraView alloc] initWithFrame:CGRectZero];
  return view;
}

@end

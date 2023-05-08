//
//  PassioIconViewManager.m
//  ReactNativePassioSDK
//
//  Created by Patrick Goley on 6/14/21.
//

#import <Foundation/Foundation.h>

#if __has_include("ReactNativePassioSDK-Swift.h")
#import "ReactNativePassioSDK-Swift.h"
#else
#import <ReactNativePassioSDK/ReactNativePassioSDK-Swift.h>
#endif

#import <React/RCTViewManager.h>

@interface PassioIconViewManager: RCTViewManager
@end

@implementation PassioIconViewManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(config,  NSDictionary*)

- (UIView *) view {
  PassioIconView *view = [[PassioIconView alloc] initWithFrame:CGRectZero];
  return view;
}

@end

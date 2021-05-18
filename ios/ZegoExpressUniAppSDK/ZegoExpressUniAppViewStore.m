//
//  ZegoExpressUniAppViewStore.m
//  ZegoExpressUniAppSDK
//
//  Created by zego on 2020/12/2.
//

#import "ZegoExpressUniAppViewStore.h"
#import <UIKit/UIKit.h>

static ZegoExpressUniAppViewStore *sharedInstance = nil;

@interface ZegoExpressUniAppViewStore ()

@end

@implementation ZegoExpressUniAppViewStore

+ (instancetype)sharedInstance {
    static dispatch_once_t onceToken;
    
    dispatch_once(&onceToken, ^{
        sharedInstance = [[ZegoExpressUniAppViewStore alloc] init];
        sharedInstance.playViewDict = [NSMutableDictionary dictionary];
        sharedInstance.previewViewDict = [NSMutableDictionary dictionary];
    });
    return sharedInstance;
}

@end

//
//  ZegoExpressUniAppViewStore.h
//  ZegoExpressUniAppSDK
//
//  Created by zego on 2020/12/2.
//

#import <Foundation/Foundation.h>
#import <ZegoExpressEngine/ZegoExpressEngine.h>

NS_ASSUME_NONNULL_BEGIN

@interface ZegoExpressUniAppViewStore : NSObject

@property (nonatomic, strong, readwrite) NSMutableDictionary<NSString*, ZegoCanvas*> *playViewDict;
@property (nonatomic, strong, readwrite) NSMutableDictionary<NSString*, ZegoCanvas*> *previewViewDict;

+ (instancetype)sharedInstance;

@end

NS_ASSUME_NONNULL_END

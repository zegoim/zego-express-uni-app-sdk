//
//  ZegoExpressUniAppViewStore.h
//  ZegoExpressUniAppSDK
//
//  Created by zego on 2020/12/2.
//

#import <Foundation/Foundation.h>
#import <ZegoExpressEngine/ZegoExpressEngine.h>

NS_ASSUME_NONNULL_BEGIN

@interface ZegoPlayStreamStore : NSObject

@property (nonatomic, strong) ZegoCanvas *canvas;
@property (nonatomic, strong) ZegoPlayerConfig *config;
@property (nonatomic, assign) BOOL isPlaying;

@end


@interface ZegoExpressUniAppViewStore : NSObject

@property (nonatomic, strong, readwrite) NSMutableDictionary<NSString*, ZegoPlayStreamStore*> *playViewDict;
@property (nonatomic, strong, readwrite) NSMutableDictionary<NSString*, ZegoCanvas*> *previewViewDict;
@property (nonatomic, strong, readwrite) NSMutableDictionary<NSString*, ZegoCanvas*> *mediaPlayerViewDict;

+ (instancetype)sharedInstance;

@end

NS_ASSUME_NONNULL_END

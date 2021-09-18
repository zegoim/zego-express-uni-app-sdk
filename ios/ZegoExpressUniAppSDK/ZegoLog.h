//
//  ZegoLog.h
//  ZegoExpressUniAppSDK
//
//  Created by zego on 2021/9/16.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface ZegoLog : NSObject

#define ZGLog(format, ...) [ZegoLog logInfo:(format), ## __VA_ARGS__]

#define ZGError(format, ...) [ZegoLog logError:(format), ## __VA_ARGS__]

+ (void)logInfo:(NSString *)format, ... NS_FORMAT_FUNCTION(1,2);

+ (void)logError:(NSString *)format, ... NS_FORMAT_FUNCTION(1,2);

@end

NS_ASSUME_NONNULL_END

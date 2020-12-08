//
//  ZegoExpressUniAppEngine.h
//  ZegoExpressUniAppSDK
//
//  Created by zego on 2020/11/10.
//

#pragma mark - Defines

#define ZGLogError(frmt, ...)   ZGLOG_MACRO(kZegoLogFlagError,   __PRETTY_FUNCTION__, (frmt), ##__VA_ARGS__)
#define ZGLogWarn(frmt, ...)    ZGLOG_MACRO(kZegoLogFlagWarning, __PRETTY_FUNCTION__, (frmt), ##__VA_ARGS__)
#define ZGLogInfo(frmt, ...)    ZGLOG_MACRO(kZegoLogFlagInfo,    __PRETTY_FUNCTION__, (frmt), ##__VA_ARGS__)
#define ZGLogDebug(frmt, ...)   ZGLOG_MACRO(kZegoLogFlagDebug,   __PRETTY_FUNCTION__, (frmt), ##__VA_ARGS__)
#define ZGLogVerbose(frmt, ...) ZGLOG_MACRO(kZegoLogFlagVerbose, __PRETTY_FUNCTION__, (frmt), ##__VA_ARGS__)

#define ZGLOG_MACRO(flg, func, frmt, ...) \
[ZegoLog logWithFlag:flg \
file:__FILE__ \
function:func \
line:__LINE__ \
format:(frmt), ## __VA_ARGS__]

#import <Foundation/Foundation.h>
#import "WeexSDK.h"

static const NSString *kZegoExpressUniAppEngineEventEngineStateUpdate = @"engineStateUpdate";

static const NSString *kZegoExpressUniAppEngineEventRoomStateUpdate = @"roomStateUpdate";

static const NSString *kZegoExpressUniAppEngineEventRoomUserUpdate = @"roomUserUpdate";

static const NSString *kZegoExpressUniAppEngineEventRoomOnlineUserCountUpdate = @"roomOnlineUserCountUpdate";

static const NSString *kZegoExpressUniAppEngineEventRoomStreamUpdate = @"roomStreamUpdate";

static const NSString *kZegoExpressUniAppEngineEventRoomExtraInfoUpdate = @"roomExtraInfoUpdate";

static const NSString *kZegoExpressUniAppEngineEventPublisherStateUpdate = @"publisherStateUpdate";

static const NSString *kZegoExpressUniAppEngineEventPlayerStateUpdate = @"playerStateUpdate";

static const NSString *kZegoExpressUniAppEngineEventIMRecvCustomCommand = @"IMRecvCustomCommand";


NS_ASSUME_NONNULL_BEGIN

@interface ZegoExpressUniAppEngine : NSObject<WXModuleProtocol>

@end

NS_ASSUME_NONNULL_END

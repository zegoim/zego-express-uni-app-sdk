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
#import "DCUniModule.h"

static const NSString *kZegoExpressUniAppApiCalledResult = @"apiCalledResult";

static const NSString *kZegoExpressUniAppEngineEventEngineStateUpdate = @"engineStateUpdate";
static const NSString *kZegoExpressUniAppEngineEventRoomStateUpdate = @"roomStateUpdate";
static const NSString *kZegoExpressUniAppEngineEventRoomUserUpdate = @"roomUserUpdate";
static const NSString *kZegoExpressUniAppEngineEventRoomOnlineUserCountUpdate = @"roomOnlineUserCountUpdate";
static const NSString *kZegoExpressUniAppEngineEventRoomExtraInfoUpdate = @"roomExtraInfoUpdate";
static const NSString *kZegoExpressUniAppEngineEventRoomStreamUpdate = @"roomStreamUpdate";
static const NSString *kZegoExpressUniAppEngineEventRoomStreamExtraInfoUpdate = @"roomStreamExtraInfoUpdate";
static const NSString *kZegoExpressUniAppEngineEventPublisherStateUpdate = @"publisherStateUpdate";
static const NSString *kZegoExpressUniAppEngineEventPublisherQualityUpdate = @"publisherQualityUpdate";
static const NSString *kZegoExpressUniAppEngineEventPublisherCapturedAudioFirstFrame = @"publisherCapturedAudioFirstFrame";
static const NSString *kZegoExpressUniAppEngineEventPublisherCapturedVideoFirstFrame = @"publisherCapturedVideoFirstFrame";
static const NSString *kZegoExpressUniAppEngineEventPublisherVideoSizeChanged = @"publisherVideoSizeChanged";
static const NSString *kZegoExpressUniAppEngineEventPlayerStateUpdate = @"playerStateUpdate";
static const NSString *kZegoExpressUniAppEngineEventPlayerQualityUpdate = @"playerQualityUpdate";
static const NSString *kZegoExpressUniAppEngineEventPlayerMediaEvent = @"playerMediaEvent";
static const NSString *kZegoExpressUniAppEngineEventPlayerRecvAudioFirstFrame = @"playerRecvAudioFirstFrame";
static const NSString *kZegoExpressUniAppEngineEventPlayerRecvVideoFirstFrame = @"playerRecvVideoFirstFrame";
static const NSString *kZegoExpressUniAppEngineEventPlayerRenderVideoFirstFrame = @"playerRenderVideoFirstFrame";
static const NSString *kZegoExpressUniAppEngineEventPlayerVideoSizeChanged = @"playerVideoSizeChanged";
static const NSString *kZegoExpressUniAppEngineEventCapturedSoundLevelUpdate = @"capturedSoundLevelUpdate";
static const NSString *kZegoExpressUniAppEngineEventRemoteSoundLevelUpdate = @"remoteSoundLevelUpdate";
static const NSString *kZegoExpressUniAppEngineEventDeviceError = @"deviceError";
static const NSString *kZegoExpressUniAppEngineEventRemoteCameraStateUpdate = @"remoteCameraStateUpdate";
static const NSString *kZegoExpressUniAppEngineEventRemoteMicStateUpdate = @"remoteMicStateUpdate";


static const NSString *kZegoExpressUniAppEngineEventIMRecvBroadcastMessage = @"IMRecvBroadcastMessage";
static const NSString *kZegoExpressUniAppEngineEventIMRecvBarrageMessage = @"IMRecvBarrageMessage";
static const NSString *kZegoExpressUniAppEngineEventIMRecvCustomCommand = @"IMRecvCustomCommand";

static const NSString *kZegoExpressUniAppMediaEventMediaPlayerStateUpdate = @"mediaPlayerStateUpdate";
static const NSString *kZegoExpressUniAppMediaEventMediaPlayerNetworkEvent = @"mediaPlayerNetworkEvent";
static const NSString *kZegoExpressUniAppMediaEventMediaPlayerPlayingProgress = @"mediaPlayerPlayingProgress";
static const NSString *kZegoExpressUniAppMediaEventMediaPlayerRecvSEI = @"mediaPlayerRecvSEI";


NS_ASSUME_NONNULL_BEGIN

@interface ZegoExpressUniAppEngine : DCUniModule

@end

NS_ASSUME_NONNULL_END

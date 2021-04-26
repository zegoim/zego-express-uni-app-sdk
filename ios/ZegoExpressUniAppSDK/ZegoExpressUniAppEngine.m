//
//  ZegoExpressUniAppEngine.m
//  ZegoExpressUniAppSDK
//
//  Created by zego on 2020/11/10.
//

#import "ZegoExpressUniAppEngine.h"
#import <ZegoExpressEngine/ZegoExpressEngine.h>
#import "ZegoExpressUniAppViewStore.h"

@interface ZegoExpressUniAppEngine ()<ZegoEventHandler>

@property (strong, nonatomic) NSMutableDictionary *callBackEventDict;
@property (strong, nonatomic) NSMutableDictionary *audioEffectPlayerDict;
@property (strong, nonatomic) NSMutableDictionary *mediaPlayerDict;

@end

@implementation ZegoExpressUniAppEngine

static const NSString *kZegoExpressUniAppEngineEventKey = @"eventKey";

static const NSString *kZegoExpressUniAppEngineResultKey = @"resultKey";


WX_EXPORT_METHOD(@selector(on:callback:))
- (void)on:(NSString *)event callback:(WXModuleKeepAliveCallback)callback {
    [self.callBackEventDict setValue:callback forKey:event];
}

WX_EXPORT_METHOD_SYNC(@selector(createEngine:appSign:isTestEnv:scenario:))

- (void)createEngine:(NSUInteger)appID
                   appSign:(NSString *)appSign
                   isTestEnv:(BOOL)isTestEnv
                   scenario:(int)scenario {
    [ZegoExpressEngine createEngineWithAppID:(unsigned int)appID appSign:appSign isTestEnv:isTestEnv scenario:scenario eventHandler:self];
    [[ZegoExpressEngine sharedEngine] setEventHandler:self];
}

WX_EXPORT_METHOD_SYNC(@selector(destroyEngine:))

- (void)destroyEngine:(WXModuleKeepAliveCallback)callback{
    [ZegoExpressEngine destroyEngine:^{
        if (callback) {
            callback(@(YES), NO);
        }
    }];
}

WX_EXPORT_METHOD_SYNC(@selector(startPreview:))

- (void)startPreview:(NSUInteger)channel {
    ZegoCanvas *canvas = [[ZegoExpressUniAppViewStore sharedInstance].previewViewDict objectForKey:@(channel).stringValue];
    if (!canvas) {
        WXLogWarning(@"没有设置相应的view用来预览");
    }
    [[ZegoExpressEngine sharedEngine] startPreview:canvas channel:channel];
}

WX_EXPORT_METHOD_SYNC(@selector(startPlayingStream:config:))
- (void)startPlayingStream:(NSString *)streamID config:(NSDictionary *)config {
    ZegoCanvas *canvas = [[ZegoExpressUniAppViewStore sharedInstance].playViewDict objectForKey:streamID];
    
    if (config != nil && [config isKindOfClass:[NSDictionary class]]) {
        ZegoPlayerConfig *configP = [[ZegoPlayerConfig alloc] init];
        ZegoCDNConfig *cdnConfig = [[ZegoCDNConfig alloc] init];
        if (config[@"cdnConfig"]) {
            cdnConfig.authParam = config[@"cdnConfig"][@"authParam"];
            cdnConfig.url = config[@"cdnConfig"][@"url"];
            configP.cdnConfig = cdnConfig;
        }
        if (config[@"videoLayer"]) {
            configP.videoLayer = (ZegoPlayerVideoLayer)[config[@"videoLayer"] intValue];
        }
        [[ZegoExpressEngine sharedEngine] startPlayingStream:streamID canvas:canvas config:configP];
    } else {
        [[ZegoExpressEngine sharedEngine] startPlayingStream:streamID canvas:canvas];
    }
    
}

WX_EXPORT_METHOD_SYNC(@selector(setEngineConfig:))

- (void)setEngineConfig:(NSDictionary *)config{
    ZegoEngineConfig *configEngine = [[ZegoEngineConfig alloc] init];
    if (config[@"advancedConfig"]) {
        configEngine.advancedConfig = config[@"advancedConfig"];
    }
    ZegoLogConfig *logConfig = [[ZegoLogConfig alloc] init];
    if (config[@"logPath"]) {
        logConfig.logPath = config[@"logPath"];
    }
    if (config[@"logSize"]) {
        logConfig.logSize = [config[@"logSize"] unsignedLongLongValue];
    }
    configEngine.logConfig = logConfig;
    [ZegoExpressEngine setEngineConfig:configEngine];
}

WX_EXPORT_METHOD_SYNC(@selector(setDebugVerbose:language:))
- (void)setDebugVerbose:(BOOL)enable language:(NSInteger)language {
    [[ZegoExpressEngine sharedEngine] setDebugVerbose:enable language:(ZegoLanguage)language];
}

WX_EXPORT_METHOD_SYNC(@selector(uploadLog))
- (void)uploadLog {
    [[ZegoExpressEngine sharedEngine] uploadLog];
}

WX_EXPORT_METHOD_SYNC(@selector(setAppOrientation:channel:))
- (void)setAppOrientation:(NSInteger)orientation channel:(NSInteger)channel  {
    [[ZegoExpressEngine sharedEngine] setAppOrientation:orientation channel:channel];
}

WX_EXPORT_METHOD_SYNC(@selector(getVersion))
- (NSString *)getVersion {
    return [ZegoExpressEngine getVersion];
}

#pragma mark - 房间

WX_EXPORT_METHOD_SYNC(@selector(loginRoom:user:config:))
- (void)loginRoom:(NSString *)roomID user:(NSDictionary *)user config:(NSDictionary *)config {
    ZegoRoomConfig *defaultConfig = [ZegoRoomConfig defaultConfig];
    defaultConfig.isUserStatusNotify = YES;
    if (config && [config isKindOfClass:[NSDictionary class]]) {
        if (config[@"userUpdate"]) {
            defaultConfig.isUserStatusNotify = [config[@"userUpdate"] boolValue];
        }
        if (config[@"maxMemberCount"]) {
            defaultConfig.maxMemberCount = [config[@"maxMemberCount"] intValue];
        }
        if (config[@"token"]) {
            defaultConfig.token = config[@"token"];
        }
    }
    
    [[ZegoExpressEngine sharedEngine] loginRoom:roomID user:[ZegoUser userWithUserID:user[@"userID"] userName:user[@"userName"]] config:defaultConfig];
}

WX_EXPORT_METHOD_SYNC(@selector(logoutRoom:))
- (void)logoutRoom:(NSString *)roomID {
    [[ZegoExpressEngine sharedEngine] logoutRoom:roomID];
}

#pragma mark - 推流相关

WX_EXPORT_METHOD_SYNC(@selector(startPublishingStream:channel:))
- (void)startPublishingStream:(NSString *)streamID channel:(NSInteger)channel {
    [[ZegoExpressEngine sharedEngine] startPublishingStream:streamID channel:channel];
}

WX_EXPORT_METHOD_SYNC(@selector(stopPublishingStream:channel:))
- (void)stopPublishingStream:(NSString *)streamID channel:(NSInteger)channel {
    [[ZegoExpressEngine sharedEngine] stopPublishingStream:channel];
}

WX_EXPORT_METHOD(@selector(setStreamExtraInfo:channel:callback:))
- (void)setStreamExtraInfo:(NSString *)extraInfo channel:(NSInteger)channel callback:(WXModuleKeepAliveCallback)callback {
    [[ZegoExpressEngine sharedEngine] setStreamExtraInfo:extraInfo channel:channel callback:^(int errorCode) {
        if (callback) {
            callback(@(errorCode), NO);
        }
    }];
}

WX_EXPORT_METHOD(@selector(takePublishStreamSnapshot:channel:))
- (void)takePublishStreamSnapshot:(WXModuleKeepAliveCallback)callback channel:(NSInteger)channel {
    [[ZegoExpressEngine sharedEngine] takePublishStreamSnapshot:^(int errorCode, ZGImage * _Nullable image) {
        if (callback) {
            callback(@{@"errorCode":@(errorCode),
                       @"image":image},
                     NO);
        }
    } channel:(ZegoPublishChannel)channel];
}

#pragma mark - 拉流相关
WX_EXPORT_METHOD_SYNC(@selector(setVideoConfig:channel:))
- (void)setVideoConfig:(NSDictionary *)config channel:(NSInteger)channel {
    ZegoVideoConfig *vConfig = [ZegoVideoConfig defaultConfig];
    if (config[@"bitrate"]) {
        vConfig.bitrate = [config[@"bitrate"] intValue];
    }
    if (config[@"fps"]) {
        vConfig.fps = [config[@"fps"] intValue];
    }
    if (config[@"codecID"]) {
        NSInteger codecNumber = [config[@"codecID"] intValue];
        vConfig.codecID = codecNumber;
    }
    if (config[@"captureResolution"]) {
        vConfig.captureResolution = CGSizeMake([config[@"captureResolution"][@"width"] intValue], [config[@"captureResolution"][@"height"] intValue]);
    }
    if (config[@"encodeResolution"]) {
        vConfig.encodeResolution = CGSizeMake([config[@"encodeResolution"][@"width"] intValue], [config[@"encodeResolution"][@"height"] intValue]);
    }
    [[ZegoExpressEngine sharedEngine] setVideoConfig:vConfig channel:channel];
}

WX_EXPORT_METHOD_SYNC(@selector(getVideoConfig:))
- (NSDictionary *)getVideoConfig:(ZegoPublishChannel)channel {
    ZegoVideoConfig *config = [[ZegoExpressEngine sharedEngine] getVideoConfig:channel];

    return @{
        @"bitrate": @(config.bitrate),
        @"fps": @(config.fps),
        @"codecID": @(config.codecID),
        @"captureResolution": @{
                @"width": @((int)config.captureResolution.width),
                @"height": @((int)config.captureResolution.height)
        },
        @"encodeResolution": @{
                @"width": @((int)config.encodeResolution.width),
                @"height": @((int)config.encodeResolution.height)
        }
    };
}

WX_EXPORT_METHOD_SYNC(@selector(setAudioConfig:))
- (void)setAudioConfig:(NSDictionary *)config  {
    ZegoAudioConfig *vConfig = [ZegoAudioConfig defaultConfig];
    if (config[@"bitrate"]) {
        vConfig.bitrate = [config[@"bitrate"] intValue];
    }
    if (config[@"channel"]) {
        NSInteger channels = [config[@"channel"] intValue];
        vConfig.channel = (ZegoAudioChannel)channels;
    }
    if (config[@"codecID"]) {
        ZegoAudioCodecID codec = (ZegoAudioCodecID)[config[@"codecID"] intValue];
        vConfig.codecID = codec;
    }
    [[ZegoExpressEngine sharedEngine] setAudioConfig:vConfig];
}

WX_EXPORT_METHOD_SYNC(@selector(getAudioConfig))
- (NSDictionary *)getAudioConfig {
    ZegoAudioConfig *config = [[ZegoExpressEngine sharedEngine] getAudioConfig];
    return @{
        @"bitrate": @(config.bitrate),
        @"channel": @(config.channel),
        @"codecID": @(config.codecID),
    };
}

WX_EXPORT_METHOD_SYNC(@selector(enableTrafficControl:property:))
- (void)enableTrafficControl:(BOOL)enable property:(NSInteger)property {
    [[ZegoExpressEngine sharedEngine] enableTrafficControl:enable property:(ZegoTrafficControlProperty)property];
}

WX_EXPORT_METHOD_SYNC(@selector(mutePublishStreamAudio:channel:))
- (void)mutePublishStreamAudio:(BOOL)mute channel:(NSInteger)channel {
    [[ZegoExpressEngine sharedEngine] mutePublishStreamAudio:mute channel:channel];
}

WX_EXPORT_METHOD_SYNC(@selector(mutePublishStreamVideo:channel:))
- (void)mutePublishStreamVideo:(BOOL)mute channel:(NSInteger)channel {
    [[ZegoExpressEngine sharedEngine] mutePublishStreamVideo:mute channel:channel];
}

WX_EXPORT_METHOD_SYNC(@selector(mutePublishStreamVideo:))
- (void)setAudioCaptureStereoMode:(NSInteger)mode {
    [[ZegoExpressEngine sharedEngine] setAudioCaptureStereoMode:(ZegoAudioCaptureStereoMode)mode];
}

WX_EXPORT_METHOD_SYNC(@selector(setCaptureVolume:))
- (void)setCaptureVolume:(NSInteger)volume {
    [[ZegoExpressEngine sharedEngine] setCaptureVolume:(int)volume];
}

WX_EXPORT_METHOD_SYNC(@selector(setPlayVolume:))
- (void)setPlayVolume:(NSInteger)volume streamID:(NSString *)streamID {
    [[ZegoExpressEngine sharedEngine] setPlayVolume:(int)volume streamID:streamID];
}

WX_EXPORT_METHOD_SYNC(@selector(mutePlayStreamAudio:streamID:))
- (void)mutePlayStreamAudio:(BOOL)mute streamID:(NSString *)streamID {
    [[ZegoExpressEngine sharedEngine] mutePlayStreamAudio:mute streamID:streamID];
}

WX_EXPORT_METHOD_SYNC(@selector(mutePlayStreamVideo:streamID:))
- (void)mutePlayStreamVideo:(BOOL)mute streamID:(NSString *)streamID {
    [[ZegoExpressEngine sharedEngine] mutePlayStreamVideo:mute streamID:streamID];
}

WX_EXPORT_METHOD_SYNC(@selector(enableHardwareDecoder:))
- (void)enableHardwareDecoder:(BOOL)enable {
    [[ZegoExpressEngine sharedEngine] enableHardwareDecoder:enable];
}

WX_EXPORT_METHOD(@selector(sendCustomCommand:command:toUserList:callback:))
- (void)sendCustomCommand:(NSString *)roomID command:(NSString *)command toUserList:(nullable NSArray<NSDictionary *> *)toUserList  callback:(nullable WXModuleCallback)callback {
    
    NSMutableArray<ZegoUser *> *toUserListFinal = [NSMutableArray array];
    for (NSDictionary *userDict in toUserList) {
        if (userDict[@"userID"] == NULL) {
            WXLogError(@"用户ID不得为空");
            return;
        }
        NSString *userName = @"";
        if (userDict[@"userName"]) {
            userName = userDict[@"userName"];
        }
        ZegoUser *user = [ZegoUser userWithUserID:userDict[@"userID"] userName:userName];
        [toUserListFinal addObject:user];
    }
    
    [[ZegoExpressEngine sharedEngine] sendCustomCommand:command toUserList:toUserListFinal roomID:roomID callback:^(int errorCode) {
        if (callback) {
            callback(@(errorCode));
        }
    }];
}

#pragma mark - 设备控制相关

WX_EXPORT_METHOD_SYNC(@selector(muteMicrophone:))
- (void)muteMicrophone:(BOOL)mute {
    WXLogInfo(@"API:muteMic:%d", mute);
    [[ZegoExpressEngine sharedEngine] muteMicrophone:mute];
}

WX_EXPORT_METHOD_SYNC(@selector(muteSpeaker:))
- (void)muteSpeaker:(BOOL)mute {
    WXLogInfo(@"API:muteSpeaker:%d", mute);
    [[ZegoExpressEngine sharedEngine] muteSpeaker:mute];
}

WX_EXPORT_METHOD_SYNC(@selector(enableCamera:channel:))
- (void)enableCamera:(BOOL)enable channel:(NSInteger)channel {
    WXLogInfo(@"API:enableCamera:%d,channel:%d", enable, channel);
    [[ZegoExpressEngine sharedEngine] enableCamera:enable channel:channel];
}

WX_EXPORT_METHOD_SYNC(@selector(useFrontCamera:channel:))
- (void)useFrontCamera:(BOOL)enable channel:(int)channel {
    WXLogInfo(@"API:useFrontCamera:%d,channel:%d", enable, channel);
    [[ZegoExpressEngine sharedEngine] useFrontCamera:enable channel:channel];
}

#pragma mark - EventHandler

- (void)onEngineStateUpdate:(ZegoEngineState)state {
    WXModuleKeepAliveCallback eventCallback = (WXModuleKeepAliveCallback)self.callBackEventDict[kZegoExpressUniAppEngineEventEngineStateUpdate];
    if (eventCallback) {
        eventCallback(@{
            kZegoExpressUniAppEngineResultKey: @(state),
            kZegoExpressUniAppEngineEventKey: kZegoExpressUniAppEngineEventEngineStateUpdate
                      }, YES);
    }
}

- (void)onRoomStateUpdate:(ZegoRoomState)state errorCode:(int)errorCode extendedData:(NSDictionary *)extendedData roomID:(NSString *)roomID {
    WXModuleKeepAliveCallback eventCallback = (WXModuleKeepAliveCallback)self.callBackEventDict[kZegoExpressUniAppEngineEventRoomStateUpdate];
    if (eventCallback) {
        eventCallback(@{
            kZegoExpressUniAppEngineResultKey:@{
                    @"state": @(state),
                    @"errorCode": @(errorCode),
                    @"extendedData": extendedData,
                    @"roomID": roomID
            },
            kZegoExpressUniAppEngineEventKey:kZegoExpressUniAppEngineEventRoomStateUpdate
                      }, YES);
    }
}

- (void)onRoomUserUpdate:(ZegoUpdateType)updateType userList:(NSArray<ZegoUser *> *)userList roomID:(NSString *)roomID {
    WXModuleKeepAliveCallback eventCallback = (WXModuleKeepAliveCallback)self.callBackEventDict[kZegoExpressUniAppEngineEventRoomUserUpdate];
    NSMutableArray<NSDictionary *> *userArray = [NSMutableArray array];
    [userList enumerateObjectsUsingBlock:^(ZegoUser * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        [userArray addObject:@{@"userID": obj.userID, @"userName": obj.userName}];
    }];
    if (eventCallback) {
        eventCallback(@{
            kZegoExpressUniAppEngineResultKey: @{
                    @"updateType": @(updateType),
                    @"roomID": roomID,
                    @"userList": userArray
                              },
            kZegoExpressUniAppEngineEventKey : kZegoExpressUniAppEngineEventRoomUserUpdate
            
                      }, YES);
    }
}

- (void)onRoomOnlineUserCountUpdate:(int)count roomID:(NSString *)roomID {
    WXModuleKeepAliveCallback eventCallback = (WXModuleKeepAliveCallback)self.callBackEventDict[kZegoExpressUniAppEngineEventRoomOnlineUserCountUpdate];
    if (eventCallback) {
        eventCallback(@{
            kZegoExpressUniAppEngineResultKey: @{
                    @"count": @(count),
                    @"roomID": roomID,
            },
            kZegoExpressUniAppEngineEventKey: kZegoExpressUniAppEngineEventRoomOnlineUserCountUpdate
                      }, YES);
    }
}

- (void)onRoomStreamUpdate:(ZegoUpdateType)updateType streamList:(NSArray<ZegoStream *> *)streamList extendedData:(nullable NSDictionary *)extendedData roomID:(nonnull NSString *)roomID{
    WXModuleKeepAliveCallback eventCallback = (WXModuleKeepAliveCallback)self.callBackEventDict[kZegoExpressUniAppEngineEventRoomStreamUpdate];
    NSMutableArray<NSDictionary *> *streamArray = [NSMutableArray array];
    [streamList enumerateObjectsUsingBlock:^(ZegoStream * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        [streamArray addObject:@{
            @"streamID": obj.streamID,
            @"extraInfo": obj.extraInfo,
            @"user": @{@"userID": obj.user.userID, @"userName": obj.user.userName}
        }];
    }];
    if (eventCallback) {
        eventCallback(@{
            kZegoExpressUniAppEngineResultKey: @{
                    @"updateType": @(updateType),
                    @"roomID": roomID,
                    @"streamList": streamArray,
                    @"extendedData": extendedData
            },
            kZegoExpressUniAppEngineEventKey : kZegoExpressUniAppEngineEventRoomStreamUpdate
            
        }, YES);
    }
}

- (void)onRoomExtraInfoUpdate:(NSArray<ZegoRoomExtraInfo *> *)roomExtraInfoList roomID:(NSString *)roomID {
    WXModuleKeepAliveCallback eventCallback = (WXModuleKeepAliveCallback)self.callBackEventDict[kZegoExpressUniAppEngineEventRoomExtraInfoUpdate];
    NSMutableArray<NSDictionary *> *roomExtraInfoArray;
    [roomExtraInfoList enumerateObjectsUsingBlock:^(ZegoRoomExtraInfo * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        [roomExtraInfoArray addObject:@{
            @"key": obj.key,
            @"value": obj.value,
            @"updateTime": @(obj.updateTime),
            @"updateUser": @{@"userID": obj.updateUser.userID, @"userName": obj.updateUser.userName}
        }];
    }];
    if (eventCallback) {
        eventCallback(@{
            kZegoExpressUniAppEngineResultKey: @{
                    @"roomID": roomID,
                    @"roomExtraInfoList": roomExtraInfoArray
            },
            kZegoExpressUniAppEngineEventKey: kZegoExpressUniAppEngineEventRoomExtraInfoUpdate
            
        }, YES);
    }
}

- (void)onPublisherStateUpdate:(ZegoPublisherState)state errorCode:(int)errorCode extendedData:(NSDictionary *)extendedData streamID:(NSString *)streamID {
    WXModuleKeepAliveCallback eventCallback = (WXModuleKeepAliveCallback)self.callBackEventDict[kZegoExpressUniAppEngineEventPublisherStateUpdate];

    if (eventCallback) {
        eventCallback(@{
            kZegoExpressUniAppEngineResultKey:@{
                    @"state": @(state),
                    @"streamID": streamID,
                    @"errorCode": @(errorCode),
                    @"extendedData": extendedData,
            },
            kZegoExpressUniAppEngineEventKey:kZegoExpressUniAppEngineEventPublisherStateUpdate
                      }, YES);
    }
}

- (void)onPlayerStateUpdate:(ZegoPlayerState)state errorCode:(int)errorCode extendedData:(NSDictionary *)extendedData streamID:(NSString *)streamID {
    WXModuleKeepAliveCallback eventCallback = (WXModuleKeepAliveCallback)self.callBackEventDict[kZegoExpressUniAppEngineEventPlayerStateUpdate];
    if (eventCallback) {
        eventCallback(@{
            kZegoExpressUniAppEngineResultKey:@{
                    @"state": @(state),
                    @"streamID": streamID,
                    @"errorCode": @(errorCode),
                    @"extendedData": extendedData,
            },
            kZegoExpressUniAppEngineEventKey:kZegoExpressUniAppEngineEventPlayerStateUpdate
                      }, YES);
    }
}

- (void)onIMRecvCustomCommand:(NSString *)command fromUser:(ZegoUser *)fromUser roomID:(NSString *)roomID {
    WXModuleKeepAliveCallback eventCallback = (WXModuleKeepAliveCallback)self.callBackEventDict[kZegoExpressUniAppEngineEventIMRecvCustomCommand];
    if (eventCallback) {
        eventCallback(@{
            kZegoExpressUniAppEngineResultKey:@{
                    @"command": command,
                    @"fromUser": @{
                            @"userID":fromUser.userID,
                            @"userName":fromUser.userName,
                    },
                    @"roomID": roomID
            },
            kZegoExpressUniAppEngineEventKey:kZegoExpressUniAppEngineEventIMRecvCustomCommand
                      }, YES);
    }
}

#pragma mark - MediaPlayer

WX_EXPORT_METHOD_SYNC(@selector(createMediaPlayer))
- (NSDictionary *)createMediaPlayer {
    ZegoMediaPlayer *player = [[ZegoExpressEngine sharedEngine] createMediaPlayer];
    [self.mediaPlayerDict setValue:player forKey:player.index.stringValue];
    return @{
        @"playerID": player.index
    };
}

WX_EXPORT_METHOD_SYNC(@selector(destroyMediaPlayer:))
- (void)destroyMediaPlayer:(NSInteger)playerID {
    ZegoMediaPlayer *player = self.mediaPlayerDict[@(playerID).stringValue];
    if (player) {
        [[ZegoExpressEngine sharedEngine] destroyMediaPlayer:player];
    }
}

WX_EXPORT_METHOD_SYNC(@selector(startMediaPlayer:))
- (void)startMediaPlayer:(NSInteger)playerID {
    ZegoMediaPlayer *player = self.mediaPlayerDict[@(playerID).stringValue];
    if (player) {
        [player start];
    }
    
}

WX_EXPORT_METHOD_SYNC(@selector(enableMediaPlayerAux:enable:))
- (void)enableMediaPlayerAux:(NSInteger)playerID enable:(BOOL)enable {
    ZegoMediaPlayer *player = self.mediaPlayerDict[@(playerID).stringValue];
    if (player) {
        [player enableAux:enable];
    }
}



WX_EXPORT_METHOD(@selector(loadResource:resource:callback:))
- (void)loadResource:(NSInteger)playerID resource:(NSString *)resource callback:(WXModuleKeepAliveCallback)callback {
    ZegoMediaPlayer *player = self.mediaPlayerDict[@(playerID).stringValue];
    if (player) {
        [player loadResource:resource callback:^(int errorCode) {
            if (callback) {
                callback(@(errorCode), NO);
            }
        }];
    }
}

WX_EXPORT_METHOD_SYNC(@selector(stopMediaPlayer:))
- (void)stopMediaPlayer:(NSInteger)playerID {
    ZegoMediaPlayer *player = self.mediaPlayerDict[@(playerID).stringValue];
    if (player) {
        [player stop];
    }
}

WX_EXPORT_METHOD_SYNC(@selector(pauseMediaPlayer:))
- (void)pauseMediaPlayer:(NSInteger)playerID {
    ZegoMediaPlayer *player = self.mediaPlayerDict[@(playerID).stringValue];
    if (player) {
        [player pause];
    }
}

WX_EXPORT_METHOD_SYNC(@selector(resumeMediaPlayer:))
- (void)resumeMediaPlayer:(NSInteger)playerID {
    ZegoMediaPlayer *player = self.mediaPlayerDict[@(playerID).stringValue];
    if (player) {
        [player resume];
    }
}

#pragma mark - AudioEffectPlayer

WX_EXPORT_METHOD_SYNC(@selector(createAudioEffectPlayer))
- (NSDictionary *)createAudioEffectPlayer {
    ZegoAudioEffectPlayer *player = [[ZegoExpressEngine sharedEngine] createAudioEffectPlayer];
    [self.audioEffectPlayerDict setValue:player forKey:player.getIndex.stringValue];
    return @{
        @"playerID": player.getIndex
    };
}

WX_EXPORT_METHOD_SYNC(@selector(destroyAudioEffectPlayer:))
- (void)destroyAudioEffectPlayer:(NSInteger)playerID {
    ZegoAudioEffectPlayer *player = self.audioEffectPlayerDict[@(playerID).stringValue];
    if (player) {
        [[ZegoExpressEngine sharedEngine] destroyAudioEffectPlayer:player];
    }
}

WX_EXPORT_METHOD_SYNC(@selector(startAudioEffectPlayer:audioEffectID:path:config:))
- (void)startAudioEffectPlayer:(NSInteger)playerID audioEffectID:(NSInteger)audioEffectID path:(NSString *)path config:(NSDictionary *)config {
    ZegoAudioEffectPlayer *player = self.audioEffectPlayerDict[@(playerID).stringValue];
    ZegoAudioEffectPlayConfig *configT = [[ZegoAudioEffectPlayConfig alloc] init];
    if (config[@"isPublishOut"]) {
        configT.isPublishOut = [config[@"isPublishOut"] boolValue];
    }
    if (config[@"playCount"]) {
        configT.playCount = [config[@"playCount"] unsignedIntValue];
    }
    
    if (player) {
        [player start:(unsigned int)audioEffectID path:path config:configT];
    }
}

WX_EXPORT_METHOD_SYNC(@selector(stop:))
- (void)stopAudioEffectPlayer:(NSInteger)playerID audioEffectID:(NSInteger)audioEffectID{
    ZegoAudioEffectPlayer *player = self.audioEffectPlayerDict[@(playerID).stringValue];
    if (player) {
        [player stop:(unsigned int)audioEffectID];
    }
}

WX_EXPORT_METHOD_SYNC(@selector(pause:))
- (void)pauseAudioEffectPlayer:(NSInteger)playerID audioEffectID:(NSInteger)audioEffectID {
    ZegoAudioEffectPlayer *player = self.audioEffectPlayerDict[@(playerID).stringValue];
    if (player) {
        [player pause:(unsigned int)audioEffectID];
    }
}

WX_EXPORT_METHOD_SYNC(@selector(resume:))
- (void)resumeAudioEffectPlayer:(NSInteger)playerID audioEffectID:(NSInteger)audioEffectID {
    ZegoAudioEffectPlayer *player = self.audioEffectPlayerDict[@(playerID).stringValue];
    if (player) {
        [player resume:(unsigned int)audioEffectID];
    }
}

#pragma mark - Getter

- (NSMutableDictionary *)callBackEventDict {
    if (!_callBackEventDict) {
        _callBackEventDict = [NSMutableDictionary dictionary];
    }
    return _callBackEventDict;
}
- (NSMutableDictionary *)audioEffectPlayerDict {
    if (!_audioEffectPlayerDict) {
        _audioEffectPlayerDict = [NSMutableDictionary dictionary];
    }
    return _audioEffectPlayerDict;
}

- (NSMutableDictionary *)mediaPlayerDict {
    if (!_mediaPlayerDict) {
        _mediaPlayerDict = [NSMutableDictionary dictionary];
    }
    return _mediaPlayerDict;
}

@end

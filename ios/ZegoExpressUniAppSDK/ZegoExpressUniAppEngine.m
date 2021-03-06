//
//  ZegoExpressUniAppEngine.m
//  ZegoExpressUniAppSDK
//
//  Created by zego on 2020/11/10.
//

#import "ZegoExpressUniAppEngine.h"
#import <ZegoExpressEngine/ZegoExpressEngine.h>
#import "ZegoExpressUniAppViewStore.h"
#import "DCUniConvert.h"
#import "ZegoLog.h"

@interface ZegoExpressUniAppEngine ()<ZegoEventHandler, ZegoApiCalledEventHandler, ZegoMediaPlayerEventHandler>

@property (strong, nonatomic) NSMutableDictionary *audioEffectPlayerDict;
@property (strong, nonatomic) NSMutableDictionary *mediaPlayerDict;

@property (nonatomic, assign) BOOL mIsInited;

@end

@implementation ZegoExpressUniAppEngine

- (void)sendEvent:(const NSString *)event, ... NS_REQUIRES_NIL_TERMINATION {
    NSMutableArray *paramArray = @[].mutableCopy;
    
    va_list args;
    va_start(args, event);
    id nextArg;
    while((nextArg = va_arg(args, id))) {
        [paramArray addObject:nextArg];
        NSLog(@"%@", nextArg);
    }
    
    NSString *key = [NSString stringWithFormat:@"%@%@", self.prefix, event];
    [self.uniInstance fireGlobalEvent:key params:@{@"data": paramArray}];
}

- (void)sendMediaPlayerEvent:(const NSString *)event index:(NSNumber *)index, ... NS_REQUIRES_NIL_TERMINATION {
    NSMutableArray *paramArray = @[].mutableCopy;
    
    va_list args;
    va_start(args, index);
    id nextArg;
    while((nextArg = va_arg(args, id))) {
        [paramArray addObject:nextArg];
        NSLog(@"%@", nextArg);
    }
    
    NSString *key = [NSString stringWithFormat:@"%@%@", self.prefix, event];
    [self.uniInstance fireGlobalEvent:key params:@{@"data": paramArray, @"idx": index}];
}

- (void)callbackNotNull:(UniModuleKeepAliveCallback)callback data:(id)data {
    if (callback && self.uniInstance.isRendered) {
        callback(data, false);
    }
}

- (void)callbackNotNull:(UniModuleKeepAliveCallback)callback {
    [self callbackNotNull:callback data:nil];
}

UNI_EXPORT_METHOD_SYNC(@selector(prefix))
- (NSString *)prefix {
    return @"im.zego.express";
}

UNI_EXPORT_METHOD(@selector(callMethod:callback:))
- (void)callMethod:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    
    NSString *methodName = [DCUniConvert NSString:params[@"method"]];
    if (!methodName) { return; }
    
    NSDictionary *args = params[@"args"];
    if (args && [args isKindOfClass:NSDictionary.class]) {
        NSString *selName = [NSString stringWithFormat:@"%@:%@:", methodName, @"callback"];
        SEL sel = NSSelectorFromString(selName);
        IMP imp = [self methodForSelector:sel];
        void (*func)(id, SEL, NSDictionary *, UniModuleKeepAliveCallback) = (void *)imp;
        func(self, sel, args, callback);
    } else {
        NSString *selName = [NSString stringWithFormat:@"%@:", methodName];
        SEL sel = NSSelectorFromString(selName);
        IMP imp = [self methodForSelector:sel];
        void (*func)(id, SEL, UniModuleKeepAliveCallback) = (void *)imp;
        func(self, sel, callback);
    }
}

#pragma mark - Engine
- (void)createEngineWithProfile:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
	NSDictionary *profileMap = params[@"profile"];
    unsigned int appID = (unsigned int)[DCUniConvert NSUInteger:profileMap[@"appID"]];
    NSString *appSign = [DCUniConvert NSString:profileMap[@"appSign"]];
    ZegoScenario scenario = [DCUniConvert NSUInteger:profileMap[@"scenario"]];
    
    [ZegoExpressEngine setApiCalledCallback:self];
    
	ZegoEngineProfile *profile = [ZegoEngineProfile new];
	profile.appID = appID;
	profile.appSign = appSign;
	profile.scenario = scenario;
    [ZegoExpressEngine createEngineWithProfile:profile eventHandler:self];
	
    self.mIsInited = true;
    [self callbackNotNull:callback];
}

- (void)createEngine:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    unsigned int appID = (unsigned int)[DCUniConvert NSUInteger:params[@"appID"]];
    NSString *appSign = [DCUniConvert NSString:params[@"appSign"]];
    BOOL isTestEnv = [DCUniConvert BOOL:params[@"isTestEnv"]];
    ZegoScenario scenario = [DCUniConvert NSUInteger:params[@"scenario"]];
    
    [ZegoExpressEngine setApiCalledCallback:self];
    
    [ZegoExpressEngine createEngineWithAppID:appID appSign:appSign isTestEnv:isTestEnv scenario:scenario eventHandler:self];
    self.mIsInited = true;
    [self callbackNotNull:callback];
}

- (void)destroyEngine:(UniModuleKeepAliveCallback)callback{
    if (self.mIsInited) {
        [ZegoExpressEngine destroyEngine:^{
            [self callbackNotNull:callback];
        }];
    } else {
        [self callbackNotNull:callback];
    }
}

- (void)setEngineConfig:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSDictionary *config = params[@"config"];
    if (config && [config isKindOfClass:NSDictionary.class]) {
        ZegoEngineConfig *configEngine = [[ZegoEngineConfig alloc] init];
        if (config[@"advancedConfig"]) {
            configEngine.advancedConfig = config[@"advancedConfig"];
        }
        [ZegoExpressEngine setEngineConfig:configEngine];
    }

    [self callbackNotNull:callback];
}

- (void)setLogConfig:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSDictionary *config = params[@"config"];
    if (config && [config isKindOfClass:NSDictionary.class]) {
        ZegoLogConfig *logConfig = [[ZegoLogConfig alloc] init];
        if (config[@"logPath"]) {
            logConfig.logPath = [DCUniConvert NSString:config[@"logPath"]];
        }
        if (config[@"logSize"]) {
            logConfig.logSize = [DCUniConvert NSUInteger:config[@"logSize"]];
        }
        [ZegoExpressEngine setLogConfig:logConfig];
    }
    [self callbackNotNull:callback];
}

- (void)getVersion:(UniModuleKeepAliveCallback)callback {
    NSString *verison = [ZegoExpressEngine getVersion];
    [self callbackNotNull:callback data:verison];
}

- (void)uploadLog:(UniModuleKeepAliveCallback)callback {
    [[ZegoExpressEngine sharedEngine] uploadLog];
    [self callbackNotNull:callback];
}

- (void)callExperimentalAPI:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSString *apiParam = params[@"params"];
    NSString *result = [[ZegoExpressEngine sharedEngine] callExperimentalAPI:apiParam];
    [self callbackNotNull:callback data:result];
}

- (void)setDummyCaptureImagePath:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSString *filePath = params[@"filePath"];
    ZegoPublishChannel channel = [DCUniConvert NSInteger:params[@"channel"]];
    
    [[ZegoExpressEngine sharedEngine] setDummyCaptureImagePath:filePath channel:channel];
    [self callbackNotNull:callback];
}

#pragma mark - ??????
- (void)loginRoom:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSString *roomID = [DCUniConvert NSString:params[@"roomID"]];
    NSDictionary *user = params[@"user"];
    NSDictionary *config = params[@"config"];
    
    if (config && [config isKindOfClass:[NSDictionary class]]) {
        ZegoRoomConfig *roomConfig = [ZegoRoomConfig defaultConfig];
        if (config[@"userUpdate"]) {
            roomConfig.isUserStatusNotify = [DCUniConvert BOOL:config[@"userUpdate"]];
        }
        if (config[@"isUserStatusNotify"]) {
            roomConfig.isUserStatusNotify = [DCUniConvert BOOL:config[@"isUserStatusNotify"]];
        }
        if (config[@"maxMemberCount"]) {
            roomConfig.maxMemberCount = (unsigned int)[DCUniConvert NSUInteger:config[@"maxMemberCount"]];
        }
        if (config[@"token"]) {
            roomConfig.token = config[@"token"];
        }
        [[ZegoExpressEngine sharedEngine] loginRoom:[DCUniConvert NSString:roomID] user:[ZegoUser userWithUserID:[DCUniConvert NSString:user[@"userID"]] userName:[DCUniConvert NSString:user[@"userName"]]] config:roomConfig];
    } else {
        [[ZegoExpressEngine sharedEngine] loginRoom:[DCUniConvert NSString:roomID] user:[ZegoUser userWithUserID:[DCUniConvert NSString:user[@"userID"]] userName:[DCUniConvert NSString:user[@"userName"]]]];
    }
    [self callbackNotNull:callback];
}

- (void)logoutRoom:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSString *roomID = [DCUniConvert NSString:params[@"roomID"]];
    [[ZegoExpressEngine sharedEngine] logoutRoom:roomID];
    [self callbackNotNull:callback];
}

- (void)switchRoom:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSString *fromRoomID = [DCUniConvert NSString:params[@"fromRoomID"]];
    NSString *toRoomID = [DCUniConvert NSString:params[@"toRoomID"]];
    NSDictionary *config = params[@"config"];

    if (config && [config isKindOfClass:[NSDictionary class]]) {
        ZegoRoomConfig *roomConfig = [ZegoRoomConfig defaultConfig];
        if (config[@"userUpdate"]) {
            roomConfig.isUserStatusNotify = [DCUniConvert BOOL:config[@"userUpdate"]];
        }
        if (config[@"isUserStatusNotify"]) {
            roomConfig.isUserStatusNotify = [DCUniConvert BOOL:config[@"isUserStatusNotify"]];
        }
        if (config[@"maxMemberCount"]) {
            roomConfig.maxMemberCount = (unsigned int)[DCUniConvert NSUInteger:config[@"maxMemberCount"]];
        }
        if (config[@"token"]) {
            roomConfig.token = [DCUniConvert NSString:config[@"token"]];
        }
        [[ZegoExpressEngine sharedEngine] switchRoom:fromRoomID toRoomID:toRoomID config:roomConfig];
    } else {
        [[ZegoExpressEngine sharedEngine] switchRoom:fromRoomID toRoomID:toRoomID];
    }
    [self callbackNotNull:callback];
}

- (void)setRoomExtraInfo:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSString *value = [DCUniConvert NSString:params[@"value"]];
    NSString *key = [DCUniConvert NSString:params[@"key"]];
    NSString *roomID = [DCUniConvert NSString:params[@"roomID"]];
    
    [[ZegoExpressEngine sharedEngine] setRoomExtraInfo:value forKey:key roomID:roomID callback:^(int errorCode) {
        [self callbackNotNull:callback data:@(errorCode)];
    }];
}

#pragma mark - Publisher

- (void)startPublishingStream:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSString *streamID = [DCUniConvert NSString:params[@"streamID"]];
    ZegoPublishChannel channel = [DCUniConvert NSUInteger:params[@"channel"]];
    [[ZegoExpressEngine sharedEngine] startPublishingStream:streamID channel:channel];
    [self callbackNotNull:callback];
}

- (void)stopPublishingStream:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    ZegoPublishChannel channel = [DCUniConvert NSUInteger:params[@"channel"]];
    [[ZegoExpressEngine sharedEngine] stopPublishingStream:channel];
    [self callbackNotNull:callback];
}

- (void)setStreamExtraInfo:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSString *extraInfo = [DCUniConvert NSString:params[@"extraInfo"]];
    ZegoPublishChannel channel = [DCUniConvert NSUInteger:params[@"channel"]];
    [[ZegoExpressEngine sharedEngine] setStreamExtraInfo:extraInfo channel:channel callback:^(int errorCode) {
        [self callbackNotNull:callback data:@(errorCode)];
    }];
}

- (void)startPreview:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    ZegoPublishChannel channel = [DCUniConvert NSUInteger:params[@"channel"]];
    ZegoCanvas *canvas = [[ZegoExpressUniAppViewStore sharedInstance].previewViewDict objectForKey:@(channel).stringValue];

    [[ZegoExpressEngine sharedEngine] startPreview:canvas channel:channel];
    [self callbackNotNull:callback];
}

- (void)stopPreview:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    ZegoPublishChannel channel = [DCUniConvert NSUInteger:params[@"channel"]];
    [[ZegoExpressEngine sharedEngine] stopPreview:channel];
    [self callbackNotNull:callback];
}

- (void)setVideoConfig:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    id config = params[@"config"];
    ZegoPublishChannel channel = [DCUniConvert NSUInteger:params[@"channel"]];
    ZegoVideoConfig *vConfig = [ZegoVideoConfig defaultConfig];
    
    if ([config isKindOfClass:NSNumber.class]) {
        ZegoVideoConfigPreset preset = [config unsignedIntValue];
        vConfig = [ZegoVideoConfig configWithPreset:preset];
    } else if ([config isKindOfClass:NSDictionary.class]) {
        if (config[@"bitrate"]) {
            vConfig.bitrate = (int)[DCUniConvert NSInteger:config[@"bitrate"]];
        }
        if (config[@"fps"]) {
            vConfig.fps = (int)[DCUniConvert NSInteger:config[@"fps"]];
        }
        if (config[@"codecID"]) {
            NSInteger codecNumber = [DCUniConvert NSInteger:config[@"codecID"]];
            vConfig.codecID = codecNumber;
        }
        if (config[@"captureWidth"] && config[@"captureHeight"]) {
            vConfig.captureResolution = CGSizeMake([DCUniConvert NSInteger:config[@"captureWidth"]], [DCUniConvert NSInteger:config[@"captureHeight"]]);
        }
        if (config[@"encodeWidth"] && config[@"encodeHeight"]) {
            vConfig.encodeResolution = CGSizeMake([DCUniConvert NSInteger:config[@"encodeWidth"]], [DCUniConvert NSInteger:config[@"encodeHeight"]]);
        }
    }
    
    [[ZegoExpressEngine sharedEngine] setVideoConfig:vConfig channel:channel];
    [self callbackNotNull:callback];
}

- (void)getVideoConfig:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    ZegoPublishChannel channel = [DCUniConvert NSUInteger:params[@"channel"]];
    ZegoVideoConfig *config = [[ZegoExpressEngine sharedEngine] getVideoConfig:channel];

    NSDictionary *result = @{
        @"bitrate": @(config.bitrate),
        @"fps": @(config.fps),
        @"codecID": @(config.codecID),
        @"captureWidth": @((int)config.captureResolution.width),
        @"captureHeight": @((int)config.captureResolution.height),
        @"encodeWidth": @((int)config.encodeResolution.width),
        @"encodeHeight": @((int)config.encodeResolution.height)
    };
    [self callbackNotNull:callback data:result];
}

- (void)setVideoMirrorMode:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    ZegoVideoMirrorMode mirrorMode = [DCUniConvert NSUInteger:params[@"mode"]];
    ZegoPublishChannel channel = [DCUniConvert NSUInteger:params[@"channel"]];
    [[ZegoExpressEngine sharedEngine] setVideoMirrorMode:mirrorMode channel:channel];
    [self callbackNotNull:callback];
}

- (void)setAppOrientation:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger orientation = [DCUniConvert NSInteger:params[@"orientation"]];
    ZegoPublishChannel channel = [DCUniConvert NSUInteger:params[@"channel"]];
    UIInterfaceOrientation  uiOrientation = UIInterfaceOrientationUnknown;
    switch (orientation) {
        case 0:
            uiOrientation = UIInterfaceOrientationPortrait;
            break;
        case 1:
            uiOrientation = UIInterfaceOrientationLandscapeRight;
            break;
        case 2:
            uiOrientation = UIInterfaceOrientationPortraitUpsideDown;
            break;
        case 3:
            uiOrientation = UIInterfaceOrientationLandscapeLeft;
        default:
            break;
    }
    [[ZegoExpressEngine sharedEngine] setAppOrientation:uiOrientation channel:channel];
    [self callbackNotNull:callback];
}

- (void)setAudioConfig:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSDictionary *config = params[@"config"];
    ZegoAudioConfig *vConfig = [ZegoAudioConfig defaultConfig];
    if (config[@"bitrate"]) {
        vConfig.bitrate = (int)[DCUniConvert NSInteger:config[@"bitrate"]];
    }
    if (config[@"channel"]) {
        NSInteger channels = [DCUniConvert NSUInteger:config[@"channel"]];
        vConfig.channel = (ZegoAudioChannel)channels;
    }
    if (config[@"codecID"]) {
        ZegoAudioCodecID codec = (ZegoAudioCodecID)[DCUniConvert NSUInteger:config[@"codecID"]];
        vConfig.codecID = codec;
    }
    [[ZegoExpressEngine sharedEngine] setAudioConfig:vConfig];
    [self callbackNotNull:callback];
}

- (void)getAudioConfig:(UniModuleKeepAliveCallback)callback {
    ZegoAudioConfig *config = [[ZegoExpressEngine sharedEngine] getAudioConfig];
    NSDictionary *result = @{
        @"bitrate": @(config.bitrate),
        @"channel": @(config.channel),
        @"codecID": @(config.codecID),
    };
    [self callbackNotNull:callback data:result];
}

- (void)setPublishStreamEncryptionKey:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSString *key = [DCUniConvert NSString:params[@"key"]];
    ZegoPublishChannel channel = [params[@"channel"] integerValue];
    
    [[ZegoExpressEngine sharedEngine] setPublishStreamEncryptionKey:key channel:channel];
    [self callbackNotNull:callback];
}

- (void)takePublishStreamSnapshot:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    ZegoPublishChannel channel = [DCUniConvert NSUInteger:params[@"channel"]];
    [[ZegoExpressEngine sharedEngine] takePublishStreamSnapshot:^(int errorCode, ZGImage * _Nullable image) {
        NSString *imgBase64Str = nil;
        if (image) {
            NSData *imgData = UIImageJPEGRepresentation(image, 0.7);
            imgBase64Str = [imgData base64EncodedStringWithOptions:0];
        }
        [self callbackNotNull:callback data:@{@"errorCode": @(errorCode),
                                              @"imageBase64": imgBase64Str ?: NSNull.null}];
    } channel:channel];
}

- (void)mutePublishStreamAudio:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    BOOL mute = [DCUniConvert BOOL:params[@"mute"]];
    ZegoPublishChannel channel = [DCUniConvert NSUInteger:params[@"channel"]];
    [[ZegoExpressEngine sharedEngine] mutePublishStreamAudio:mute channel:channel];
    [self callbackNotNull:callback];
}

- (void)mutePublishStreamVideo:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    BOOL mute = [DCUniConvert BOOL:params[@"mute"]];
    ZegoPublishChannel channel = [DCUniConvert NSUInteger:params[@"channel"]];
    [[ZegoExpressEngine sharedEngine] mutePublishStreamVideo:mute channel:channel];
    [self callbackNotNull:callback];
}

- (void)enableTrafficControl:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    BOOL enable = [DCUniConvert BOOL:params[@"enable"]];
    ZegoTrafficControlProperty property = [DCUniConvert NSUInteger:params[@"property"]];
    ZegoPublishChannel channel = [DCUniConvert NSUInteger:params[@"channel"]];

    [[ZegoExpressEngine sharedEngine] enableTrafficControl:enable property:property channel:channel];
    [self callbackNotNull:callback];
}

- (void)setMinVideoBitrateForTrafficControl:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    int bitrate = (int)[DCUniConvert NSInteger:params[@"bitrate"]];
    ZegoTrafficControlMinVideoBitrateMode mode = [DCUniConvert NSUInteger:params[@"mode"]];
    ZegoPublishChannel channel = [DCUniConvert NSUInteger:params[@"channel"]];
    
    [[ZegoExpressEngine sharedEngine] setMinVideoBitrateForTrafficControl:bitrate mode:mode channel:channel];
    [self callbackNotNull:callback];
}

- (void)setTrafficControlFocusOn:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    ZegoTrafficControlFocusOnMode mode = [DCUniConvert NSUInteger:params[@"mode"]];
    ZegoPublishChannel channel = [DCUniConvert NSUInteger:params[@"channel"]];
    
    [[ZegoExpressEngine sharedEngine] setTrafficControlFocusOn:mode channel:channel];
    [self callbackNotNull:callback];
}

- (void)setCaptureVolume:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    int volume = (int)[DCUniConvert NSUInteger:params[@"volume"]];
    [[ZegoExpressEngine sharedEngine] setCaptureVolume:volume];
    [self callbackNotNull:callback];
}

- (void)setAudioCaptureStereoMode:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    ZegoAudioCaptureStereoMode mode = [params[@"mode"] unsignedIntValue];
    [[ZegoExpressEngine sharedEngine] setAudioCaptureStereoMode:mode];
    [self callbackNotNull:callback];
}

- (void)addPublishCdnUrl:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSString *targetURL = [DCUniConvert NSString:params[@"targetURL"]];
    NSString *streamID = [DCUniConvert NSString:params[@"streamID"]];
    
    [[ZegoExpressEngine sharedEngine] addPublishCdnUrl:targetURL streamID:streamID callback:^(int errorCode) {
        [self callbackNotNull:callback data:@(errorCode)];
    }];
}

- (void)removePublishCdnUrl:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSString *targetURL = [DCUniConvert NSString:params[@"targetURL"]];
    NSString *streamID = [DCUniConvert NSString:params[@"streamID"]];
    
    [[ZegoExpressEngine sharedEngine] removePublishCdnUrl:targetURL streamID:streamID callback:^(int errorCode) {
        [self callbackNotNull:callback data:@(errorCode)];
    }];
}

- (void)enablePublishDirectToCDN:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    BOOL enable = [params[@"enable"] boolValue];
    ZegoPublishChannel channel = [params[@"channel"] integerValue];
    NSDictionary *config = params[@"config"];
    ZegoCDNConfig *cdnConfig = [[ZegoCDNConfig alloc] init];
    if (config[@"url"]) {
        cdnConfig.url = [DCUniConvert NSString:config[@"url"]];
    }
    if (config[@"authParam"]) {
        cdnConfig.authParam = [DCUniConvert NSString:config[@"authParam"]];
    }
    
    [[ZegoExpressEngine sharedEngine] enablePublishDirectToCDN:enable config:cdnConfig channel:channel];
    [self callbackNotNull:callback];
}

- (void)setPublishWatermark:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    BOOL isPreviewVisible = [params[@"isPreviewVisible"] boolValue];
    ZegoPublishChannel channel = [params[@"channel"] integerValue];
    NSDictionary *mark = params[@"watermark"];
    NSString *imageURL = [DCUniConvert NSString:mark[@"imageURL"]];
    CGRect layout = CGRectMake([mark[@"layout"][@"x"] floatValue],
                               [mark[@"layout"][@"y"] floatValue],
                               [mark[@"layout"][@"width"] floatValue],
                               [mark[@"layout"][@"height"] floatValue]);
    ZegoWatermark *watermark = [[ZegoWatermark alloc] initWithImageURL:imageURL layout:layout];
    
    [[ZegoExpressEngine sharedEngine] setPublishWatermark:watermark isPreviewVisible:isPreviewVisible channel:channel];
    [self callbackNotNull:callback];
}

- (void)setSEIConfig:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSDictionary *config = params[@"config"];
    
    ZegoSEIConfig *seiConfig = [ZegoSEIConfig defaultConfig];
    if (config[@"type"]) {
        seiConfig.type = [config[@"type"] integerValue];
    }
    
    [ZegoExpressEngine.sharedEngine setSEIConfig:seiConfig];
    [self callbackNotNull:callback];
}

- (void)sendSEI:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSData *data = [params[@"data"] dataValue];
    ZegoPublishChannel channel = [params[@"channel"] integerValue];

    [ZegoExpressEngine.sharedEngine sendSEI:data channel:channel];
    [self callbackNotNull:callback];
}

- (void)enableHardwareEncoder:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    BOOL enable = [params[@"enable"] boolValue];
    
    [ZegoExpressEngine.sharedEngine enableHardwareEncoder:enable];
    [self callbackNotNull:callback];
}

- (void)setCapturePipelineScaleMode:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    ZegoCapturePipelineScaleMode mode = [params[@"mode"] unsignedIntValue];
    
    [ZegoExpressEngine.sharedEngine setCapturePipelineScaleMode:mode];
    [self callbackNotNull:callback];
}

#pragma mark - ????????????
- (void)startPlayingStream:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSString *streamID = [DCUniConvert NSString:params[@"streamID"]];
    NSDictionary *config = params[@"config"];
    ZegoPlayStreamStore *store = [[ZegoExpressUniAppViewStore sharedInstance].playViewDict objectForKey:streamID];
    if (!store) {
        store = [[ZegoPlayStreamStore alloc] init];
    }
    store.isPlaying = YES;
    
    if (config != nil && [config isKindOfClass:[NSDictionary class]]) {
        ZegoPlayerConfig *configP = [[ZegoPlayerConfig alloc] init];
        ZegoCDNConfig *cdnConfig = [[ZegoCDNConfig alloc] init];
        if (config[@"cdnConfig"]) {
            cdnConfig.authParam = [DCUniConvert NSString:config[@"cdnConfig"][@"authParam"]];
            cdnConfig.url = [DCUniConvert NSString:config[@"cdnConfig"][@"url"]];
            configP.cdnConfig = cdnConfig;
        }
        if (config[@"resourceMode"]) {
            configP.resourceMode = [config[@"resourceMode"] unsignedIntValue];
        }
        [[ZegoExpressEngine sharedEngine] startPlayingStream:streamID canvas:store.canvas config:configP];
        store.config = configP;
    } else {
        [[ZegoExpressEngine sharedEngine] startPlayingStream:streamID canvas:store.canvas];
    }
    [ZegoExpressUniAppViewStore.sharedInstance.playViewDict setObject:store forKey:streamID];
    
    [self callbackNotNull:callback];
}

- (void)stopPlayingStream:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSString *streamID = [DCUniConvert NSString:params[@"streamID"]];
    
    [ZegoExpressEngine.sharedEngine stopPlayingStream:streamID];
    [self callbackNotNull:callback];
}

- (void)setPlayStreamDecryptionKey:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSString *key = [DCUniConvert NSString:params[@"key"]];
    NSString *streamID = [DCUniConvert NSString:params[@"streamID"]];

    [ZegoExpressEngine.sharedEngine setPlayStreamDecryptionKey:key streamID:streamID];
    [self callbackNotNull:callback];
}

- (void)takePlayStreamSnapshot:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSString *streamID = params[@"streamID"];
    
    [ZegoExpressEngine.sharedEngine takePlayStreamSnapshot:streamID callback:^(int errorCode, ZGImage * _Nullable image) {
        NSString *imgBase64Str = nil;
        if (image) {
            NSData *imgData = UIImageJPEGRepresentation(image, 0.7);
            imgBase64Str = [imgData base64EncodedStringWithOptions:0];
        }
        [self callbackNotNull:callback data:@{@"errorCode": @(errorCode),
                                              @"imageBase64": imgBase64Str ?: NSNull.null}];
    }];
}

- (void)setPlayVolume:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSString *streamID = [DCUniConvert NSString:params[@"streamID"]];
    NSInteger volume = [params[@"volume"] integerValue];
    [[ZegoExpressEngine sharedEngine] setPlayVolume:(int)volume streamID:streamID];
    [self callbackNotNull:callback];
}

- (void)setAllPlayStreamVolume:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    int volume = [params[@"volume"] intValue];

    [ZegoExpressEngine.sharedEngine setAllPlayStreamVolume:volume];
    [self callbackNotNull:callback];
}

- (void)setPlayStreamVideoType:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    ZegoVideoStreamType streamType = [params[@"streamType"] intValue];
    NSString *streamID = [DCUniConvert NSString:params[@"streamID"]];

    [ZegoExpressEngine.sharedEngine setPlayStreamVideoType:streamType streamID:streamID];
    [self callbackNotNull:callback];
}

- (void)setPlayStreamBufferIntervalRange:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    
}

- (void)setPlayStreamFocusOn:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSString *streamID = [DCUniConvert NSString:params[@"streamID"]];

    [ZegoExpressEngine.sharedEngine setPlayStreamFocusOn:streamID];
    [self callbackNotNull:callback];
}

- (void)mutePlayStreamAudio:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    BOOL mute = [params[@"mute"] boolValue];
    NSString *streamID = [DCUniConvert NSString:params[@"streamID"]];
    [[ZegoExpressEngine sharedEngine] mutePlayStreamAudio:mute streamID:streamID];
    [self callbackNotNull:callback];
}

- (void)mutePlayStreamVideo:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    BOOL mute = [params[@"mute"] boolValue];
    NSString *streamID = [DCUniConvert NSString:params[@"streamID"]];
    [[ZegoExpressEngine sharedEngine] mutePlayStreamVideo:mute streamID:streamID];
    [self callbackNotNull:callback];
}

- (void)muteAllPlayStreamAudio:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    BOOL mute = [params[@"mute"] boolValue];
    
    [ZegoExpressEngine.sharedEngine muteAllPlayStreamAudio:mute];
    [self callbackNotNull:callback];
}

- (void)muteAllPlayStreamVideo:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    BOOL mute = [params[@"mute"] boolValue];
    
    [ZegoExpressEngine.sharedEngine muteAllPlayStreamVideo:mute];
    [self callbackNotNull:callback];
}

- (void)enableHardwareDecoder:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    BOOL enable = [params[@"enable"] boolValue];
    [[ZegoExpressEngine sharedEngine] enableHardwareDecoder:enable];
    [self callbackNotNull:callback];
}

- (void)enableCheckPoc:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    BOOL enable = [params[@"enable"] boolValue];
    [[ZegoExpressEngine sharedEngine] enableCheckPoc:enable];
    [self callbackNotNull:callback];
}

#pragma mark - Mixer
- (void)startMixerTask:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {

    NSDictionary *taskMap = params[@"task"];

    NSString *taskID = taskMap[@"taskID"];
    ZegoMixerTask *taskObject = [[ZegoMixerTask alloc] initWithTaskID:taskID];
    
    // MixerInput
    NSArray<NSDictionary *> *inputMapList = taskMap[@"inputList"];
    if (inputMapList && inputMapList.count > 0) {
        NSMutableArray<ZegoMixerInput *> *inputListObject = @[].mutableCopy;
        for (NSDictionary *inputMap in inputMapList) {
            NSString *streamID = inputMap[@"streamID"];
            NSInteger contentType = [DCUniConvert NSInteger:inputMap[@"contentType"]];
            CGRect rect = CGRectMake([DCUniConvert NSInteger:inputMap[@"layout"][@"x"]],
                                     [DCUniConvert NSInteger:inputMap[@"layout"][@"y"]],
                                     [DCUniConvert NSInteger:inputMap[@"layout"][@"width"]],
                                     [DCUniConvert NSInteger:inputMap[@"layout"][@"height"]]);
            unsigned int soundLevelID = (unsigned int)[DCUniConvert NSUInteger:inputMap[@"soundLevelID"]];
            ZegoMixerInput *inputObject = [[ZegoMixerInput alloc] initWithStreamID:streamID contentType:(ZegoMixerInputContentType)contentType layout:rect soundLevelID:soundLevelID];
            [inputListObject addObject:inputObject];
        }
        [taskObject setInputList:inputListObject];
    }
    
    // MixerOutput
    NSArray<NSDictionary *> *outputMapList = taskMap[@"outputList"];
    if (outputMapList && outputMapList.count > 0) {
        NSMutableArray<ZegoMixerOutput *> *outputListObject = @[].mutableCopy;
        for (NSDictionary *outputMap in outputMapList) {
            NSString *target = outputMap[@"target"];
            ZegoMixerOutput *outputObject = [[ZegoMixerOutput alloc] initWithTarget:target];
            [outputListObject addObject:outputObject];
        }
        [taskObject setOutputList:outputListObject];
    }
    
    // AudioConfig
    NSDictionary *audioConfigMap = taskMap[@"audioConfig"];
    if (audioConfigMap && audioConfigMap.count > 0) {
        NSInteger bitrate = [DCUniConvert NSInteger:audioConfigMap[@"bitrate"]];
        NSInteger channel = [DCUniConvert NSInteger:audioConfigMap[@"channel"]];
        NSInteger codecID = [DCUniConvert NSInteger:audioConfigMap[@"codecID"]];
        ZegoMixerAudioConfig *audioConfigObject = [[ZegoMixerAudioConfig alloc] init];
        audioConfigObject.bitrate = (int)bitrate;
        audioConfigObject.channel = (ZegoAudioChannel)channel;
        audioConfigObject.codecID = (ZegoAudioCodecID)codecID;
        
        [taskObject setAudioConfig:audioConfigObject];
    }
    
    // VideoConfig
    NSDictionary *videoConfigMap = taskMap[@"videoConfig"];
    if (videoConfigMap && videoConfigMap.count > 0) {
        NSInteger width = [DCUniConvert NSInteger:videoConfigMap[@"width"]];
        NSInteger height = [DCUniConvert NSInteger:videoConfigMap[@"height"]];
        NSInteger fps = [DCUniConvert NSInteger:videoConfigMap[@"fps"]];
        NSInteger bitrate = [DCUniConvert NSInteger:videoConfigMap[@"bitrate"]];
        ZegoMixerVideoConfig *videoConfigObject = [[ZegoMixerVideoConfig alloc] init];
        videoConfigObject.resolution = CGSizeMake((CGFloat)width, (CGFloat)height);
        videoConfigObject.bitrate = (int)bitrate;
        videoConfigObject.fps = (int)fps;

        [taskObject setVideoConfig:videoConfigObject];
    }
    
    // Watermark
    NSDictionary *watermarkMap = taskMap[@"watermark"];
    if (watermarkMap && watermarkMap.count > 0) {
        NSString *imageURL = watermarkMap[@"imageURL"];
        if (imageURL && [imageURL length] > 0) {
            CGRect rect = CGRectMake([DCUniConvert NSInteger:watermarkMap[@"layout"][@"x"]],
                                     [DCUniConvert NSInteger:watermarkMap[@"layout"][@"y"]],
                                     [DCUniConvert NSInteger:watermarkMap[@"layout"][@"width"]],
                                     [DCUniConvert NSInteger:watermarkMap[@"layout"][@"height"]]);
            ZegoWatermark *watermarkObject = [[ZegoWatermark alloc] initWithImageURL:imageURL layout:rect];

            [taskObject setWatermark:watermarkObject];
        }
    }
    
    // Background Image
    NSString *backgroundImageURL = taskMap[@"backgroundImageURL"];
    if (backgroundImageURL.length > 0) {
        [taskObject setBackgroundImageURL:backgroundImageURL];
    }
    
    // Enable SoundLevel
    BOOL enableSoundLevel = [DCUniConvert BOOL:taskMap[@"enableSoundLevel"]];
    [taskObject enableSoundLevel:enableSoundLevel];
    
    // Set AdvancedConfig
    NSDictionary<NSString *, NSString *> *advancedConfig = taskMap[@"advancedConfig"];
    [taskObject setAdvancedConfig:advancedConfig];
    
    [[ZegoExpressEngine sharedEngine] startMixerTask:taskObject callback:^(int errorCode, NSDictionary * _Nullable extendedData) {
        
        NSString *extendedDataJsonString = @"{}";
        if (extendedData) {
            NSError *error;
            NSData *jsonData = [NSJSONSerialization dataWithJSONObject:extendedData options:NSJSONWritingPrettyPrinted error:&error];
            if (jsonData) {
                extendedDataJsonString = [[NSString alloc]initWithData:jsonData encoding:NSUTF8StringEncoding];
            }
        }
        NSDictionary *result = @{
            @"errorCode": @(errorCode),
            @"extendedData": extendedDataJsonString
        };
        [self callbackNotNull:callback data:result];
    }];
}

- (void)stopMixerTask:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {

    NSDictionary *taskMap = params[@"task"];

    NSString *taskID = taskMap[@"taskID"];
    ZegoMixerTask *taskObject = [[ZegoMixerTask alloc] initWithTaskID:taskID];

    // MixerInput
    NSArray<NSDictionary *> *inputListMap = taskMap[@"inputList"];
    if (inputListMap && inputListMap.count > 0) {
        NSMutableArray<ZegoMixerInput *> *inputListObject = [[NSMutableArray alloc] init];
        for (NSDictionary *inputMap in inputListMap) {
            NSString *streamID = inputMap[@"streamID"];
            NSInteger contentType = [DCUniConvert NSInteger:inputMap[@"contentType"]];
            CGRect rect = CGRectMake([DCUniConvert NSInteger:inputMap[@"layout"][@"x"]],
                                     [DCUniConvert NSInteger:inputMap[@"layout"][@"y"]],
                                     [DCUniConvert NSInteger:inputMap[@"layout"][@"width"]],
                                     [DCUniConvert NSInteger:inputMap[@"layout"][@"height"]]);
            unsigned int soundLevelID = (unsigned int)[DCUniConvert NSInteger:inputMap[@"soundLevelID"]];
            ZegoMixerInput *inputObject = [[ZegoMixerInput alloc] initWithStreamID:streamID contentType:(ZegoMixerInputContentType)contentType layout:rect soundLevelID:soundLevelID];
            [inputListObject addObject:inputObject];
        }
        [taskObject setInputList:inputListObject];
    }

    // MixerOutput
    NSArray<NSDictionary *> *outputListMap = taskMap[@"outputList"];
    if (outputListMap && outputListMap.count > 0) {
        NSMutableArray<ZegoMixerOutput *> *outputListObject = [[NSMutableArray alloc] init];
        for (NSDictionary *outputMap in outputListMap) {
            NSString *target = outputMap[@"target"];
            ZegoMixerOutput *outputObject = [[ZegoMixerOutput alloc] initWithTarget:target];
            [outputListObject addObject:outputObject];
        }
        [taskObject setOutputList:outputListObject];
    }

    // no need to set audio config

    // no need to set video config

    // no need to set watermark

    // no need to set background image

    // no need to set enable sound level

    [[ZegoExpressEngine sharedEngine] stopMixerTask:taskObject callback:^(int errorCode) {
        [self callbackNotNull:callback data:@{@"errorCode": @(errorCode)}];
    }];
}

- (void)startAutoMixerTask:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    
    NSDictionary *taskMap = params[@"task"];

    NSString *taskID = taskMap[@"taskID"];
    NSString *roomID = taskMap[@"roomID"];

    ZegoAutoMixerTask *taskObject = [[ZegoAutoMixerTask alloc] init];
    taskObject.taskID = taskID;
    taskObject.roomID = roomID;

    // MixerOutput
    NSArray<NSDictionary *> *outputListMap = taskMap[@"outputList"];
    if (outputListMap && outputListMap.count > 0) {
        NSMutableArray<ZegoMixerOutput *> *outputListObject = [[NSMutableArray alloc] init];
        for (NSDictionary *outputMap in outputListMap) {
            NSString *target = outputMap[@"target"];
            ZegoMixerOutput *outputObject = [[ZegoMixerOutput alloc] initWithTarget:target];
            [outputListObject addObject:outputObject];
        }
        taskObject.outputList = outputListObject;
    }

    // AudioConfig
    NSDictionary *audioConfigMap = taskMap[@"audioConfig"];
    if (audioConfigMap && audioConfigMap.count > 0) {
        NSInteger bitrate = [DCUniConvert NSInteger:audioConfigMap[@"bitrate"]];
        NSInteger channel = [DCUniConvert NSInteger:audioConfigMap[@"channel"]];
        NSInteger codecID = [DCUniConvert NSInteger:audioConfigMap[@"codecID"]];
        ZegoMixerAudioConfig *audioConfigObject = [[ZegoMixerAudioConfig alloc] init];
        audioConfigObject.bitrate = (int)bitrate;
        audioConfigObject.channel = (ZegoAudioChannel)channel;
        audioConfigObject.codecID = (ZegoAudioCodecID)codecID;

        taskObject.audioConfig = audioConfigObject;
    }

    // Enable SoundLevel
    BOOL enableSoundLevel = [DCUniConvert NSInteger:taskMap[@"enableSoundLevel"]];
    taskObject.enableSoundLevel = enableSoundLevel;

    [[ZegoExpressEngine sharedEngine] startAutoMixerTask:taskObject callback:^(int errorCode, NSDictionary * _Nullable extendedData) {

        NSString *extendedDataJsonString = @"{}";
        if (extendedData) {
            NSError *error;
            NSData *jsonData = [NSJSONSerialization dataWithJSONObject:extendedData options:NSJSONWritingPrettyPrinted error:&error];
            if (jsonData) {
                extendedDataJsonString = [[NSString alloc]initWithData:jsonData encoding:NSUTF8StringEncoding];
            }
        }
        NSDictionary *result = @{
            @"errorCode": @(errorCode),
            @"extendedData": extendedDataJsonString
        };
        [self callbackNotNull:callback data:result];
    }];
}

- (void)stopAutoMixerTask:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {

    NSDictionary *taskMap = params[@"task"];

    NSString *taskID = taskMap[@"taskID"];
    NSString *roomID = taskMap[@"roomID"];

    ZegoAutoMixerTask *taskObject = [[ZegoAutoMixerTask alloc] init];
    taskObject.taskID = taskID;
    taskObject.roomID = roomID;

    // MixerOutput
    NSArray<NSDictionary *> *outputListMap = taskMap[@"outputList"];
    if (outputListMap && outputListMap.count > 0) {
        NSMutableArray<ZegoMixerOutput *> *outputListObject = [[NSMutableArray alloc] init];
        for (NSDictionary *outputMap in outputListMap) {
            NSString *target = outputMap[@"target"];
            ZegoMixerOutput *outputObject = [[ZegoMixerOutput alloc] initWithTarget:target];
            [outputListObject addObject:outputObject];
        }
        [taskObject setOutputList:outputListObject];
    }

    // no need to set audio config

    // no need to set video config

    // no need to set watermark

    // no need to set background image

    // no need to set enable sound level

    [[ZegoExpressEngine sharedEngine] stopAutoMixerTask:taskObject callback:^(int errorCode) {
        [self callbackNotNull:callback data:@{@"errorCode": @(errorCode)}];
    }];
}

#pragma mark - ??????????????????

- (void)muteMicrophone:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    BOOL mute = [params[@"mute"] boolValue];
    [[ZegoExpressEngine sharedEngine] muteMicrophone:mute];
    [self callbackNotNull:callback];
}

- (void)isMicrophoneMuted:(UniModuleKeepAliveCallback)callback {
    BOOL mute = [ZegoExpressEngine.sharedEngine isMicrophoneMuted];
    [self callbackNotNull:callback data:@(mute)];
}

- (void)muteSpeaker:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    BOOL mute = [params[@"mute"] boolValue];
    [[ZegoExpressEngine sharedEngine] muteSpeaker:mute];
    [self callbackNotNull:callback];
}

- (void)isSpeakerMuted:(UniModuleKeepAliveCallback)callback {
    BOOL mute = [ZegoExpressEngine.sharedEngine isSpeakerMuted];
    [self callbackNotNull:callback data:@(mute)];
}

- (void)enableAudioCaptureDevice:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    BOOL enable = [params[@"enable"] boolValue];
    
    [ZegoExpressEngine.sharedEngine enableAudioCaptureDevice:enable];
    [self callbackNotNull:callback];
}

- (void)getAudioRouteType:(UniModuleKeepAliveCallback)callback {
    ZegoAudioRoute route = [ZegoExpressEngine.sharedEngine getAudioRouteType];
    
    [self callbackNotNull:callback data:@(route)];
}

- (void)setAudioRouteToSpeaker:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    BOOL defaultToSpeaker = [params[@"defaultToSpeaker"] boolValue];

    [ZegoExpressEngine.sharedEngine setAudioRouteToSpeaker:defaultToSpeaker];
    [self callbackNotNull:callback];
}

- (void)enableCamera:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    BOOL enable = [params[@"enable"] boolValue];
    NSInteger channel = [params[@"channel"] integerValue];
    [[ZegoExpressEngine sharedEngine] enableCamera:enable channel:channel];
    [self callbackNotNull:callback];
}

- (void)useFrontCamera:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    BOOL enable = [params[@"enable"] boolValue];
    NSInteger channel = [params[@"channel"] integerValue];
    [[ZegoExpressEngine sharedEngine] useFrontCamera:enable channel:channel];
    [self callbackNotNull:callback];
}

- (void)setCameraZoomFactor:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    CGFloat factor = [params[@"factor"] floatValue];
    ZegoPublishChannel channel = [params[@"channel"] unsignedIntValue];
    [[ZegoExpressEngine sharedEngine] setCameraZoomFactor:factor channel:channel];
    [self callbackNotNull:callback];
}

- (void)getCameraMaxZoomFactor:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    ZegoPublishChannel channel = [params[@"channel"] unsignedIntValue];
    CGFloat factor = [[ZegoExpressEngine sharedEngine] getCameraMaxZoomFactor:channel];
    [self callbackNotNull:callback data:@(factor)];
}

- (void)startSoundLevelMonitor:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    unsigned int millisecond = [params[@"millisecond"] unsignedIntValue];
    
    [ZegoExpressEngine.sharedEngine startSoundLevelMonitor:millisecond];
    [self callbackNotNull:callback];
}

- (void)stopSoundLevelMonitor:(UniModuleKeepAliveCallback)callback {
    [ZegoExpressEngine.sharedEngine stopSoundLevelMonitor];
    [self callbackNotNull:callback];
}

- (void)startAudioSpectrumMonitor:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    unsigned int millisecond = [params[@"millisecond"] unsignedIntValue];
    
    [ZegoExpressEngine.sharedEngine startAudioSpectrumMonitor:millisecond];
    [self callbackNotNull:callback];
}

- (void)stopAudioSpectrumMonitor:(UniModuleKeepAliveCallback)callback {
    [ZegoExpressEngine.sharedEngine stopAudioSpectrumMonitor];
    [self callbackNotNull:callback];
}

- (void)enableHeadphoneMonitor:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    BOOL enable = [params[@"enable"] boolValue];

    [ZegoExpressEngine.sharedEngine enableHeadphoneMonitor:enable];
    [self callbackNotNull:callback];
}

- (void)setHeadphoneMonitorVolume:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    int volume = [params[@"volume"] intValue];

    [ZegoExpressEngine.sharedEngine setHeadphoneMonitorVolume:volume];
    [self callbackNotNull:callback];
}


#pragma mark - IM

- (void)sendBroadcastMessage:(NSDictionary *)params callback:(nullable UniModuleKeepAliveCallback)callback {
    NSString *roomID = [DCUniConvert NSString:params[@"roomID"]];
    NSString *message = [DCUniConvert NSString:params[@"message"]];
    
    
    [[ZegoExpressEngine sharedEngine] sendBroadcastMessage:message roomID:roomID callback:^(int errorCode, unsigned long long messageID) {
        [self callbackNotNull:callback data:@{@"errorCode": @(errorCode), @"messageID": @(messageID)}];
    }];
}

- (void)sendBarrageMessage:(NSDictionary *)params callback:(nullable UniModuleKeepAliveCallback)callback {
    NSString *roomID = [DCUniConvert NSString:params[@"roomID"]];
    NSString *message = [DCUniConvert NSString:params[@"message"]];
    
    [[ZegoExpressEngine sharedEngine] sendBarrageMessage:message roomID:roomID callback:^(int errorCode, NSString * _Nonnull messageID) {
        [self callbackNotNull:callback data:@{@"errorCode": @(errorCode), @"messageID": messageID}];
    }];
}

- (void)sendCustomCommand:(NSDictionary *)params callback:(nullable UniModuleKeepAliveCallback)callback {
    NSString *roomID = [DCUniConvert NSString:params[@"roomID"]];
    NSString *command = [DCUniConvert NSString:params[@"command"]];
    NSArray<NSDictionary *> *toUserList = params[@"toUserList"];
    
    NSMutableArray<ZegoUser *> *toUserListFinal = [NSMutableArray array];
    for (NSDictionary *userDict in toUserList) {
        if (userDict[@"userID"] == NULL) {
            return;
        }
        NSString *userName = @"";
        if (userDict[@"userName"]) {
            userName = [DCUniConvert NSString:userDict[@"userName"]];
        }
        ZegoUser *user = [ZegoUser userWithUserID:userDict[@"userID"] userName:userName];
        [toUserListFinal addObject:user];
    }
    
    [[ZegoExpressEngine sharedEngine] sendCustomCommand:command toUserList:toUserListFinal roomID:roomID callback:^(int errorCode) {
        [self callbackNotNull:callback data:@(errorCode)];
    }];
}

#pragma mark - EventHandler

- (void)onApiCalledResult:(int)errorCode funcName:(NSString *)funcName info:(NSString *)info {
    NSLog(@"[ZEGO][UniApp][%d][%@]:%@", errorCode, funcName, info);
    [self sendEvent:kZegoExpressUniAppApiCalledResult, @(errorCode), funcName, info, nil];
}

- (void)onDebugError:(int)errorCode funcName:(NSString *)funcName info:(NSString *)info {
    NSLog(@"[ZEGO][UniApp][%d][%@]:%@", errorCode, funcName, info);
}

- (void)onEngineStateUpdate:(ZegoEngineState)state {
    [self sendEvent:kZegoExpressUniAppEngineEventEngineStateUpdate, @(state), nil];
}

- (void)onRoomStateUpdate:(ZegoRoomState)state errorCode:(int)errorCode extendedData:(NSDictionary *)extendedData roomID:(NSString *)roomID {
    [self sendEvent:kZegoExpressUniAppEngineEventRoomStateUpdate, roomID, @(state), @(errorCode), extendedData, nil];
}

- (void)onRoomUserUpdate:(ZegoUpdateType)updateType userList:(NSArray<ZegoUser *> *)userList roomID:(NSString *)roomID {
    NSMutableArray<NSDictionary *> *userArray = @[].mutableCopy;
    [userList enumerateObjectsUsingBlock:^(ZegoUser * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        [userArray addObject:@{@"userID": obj.userID, @"userName": obj.userName}];
    }];
    [self sendEvent:kZegoExpressUniAppEngineEventRoomUserUpdate, roomID, @(updateType), userArray, nil];
}

- (void)onRoomOnlineUserCountUpdate:(int)count roomID:(NSString *)roomID {
    [self sendEvent:kZegoExpressUniAppEngineEventRoomOnlineUserCountUpdate, roomID, @(count), nil];
}

- (void)onRoomExtraInfoUpdate:(NSArray<ZegoRoomExtraInfo *> *)roomExtraInfoList roomID:(NSString *)roomID {
    NSMutableArray<NSDictionary *> *roomExtraInfoArray = @[].mutableCopy;
    [roomExtraInfoList enumerateObjectsUsingBlock:^(ZegoRoomExtraInfo * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        [roomExtraInfoArray addObject:@{
            @"key": obj.key,
            @"value": obj.value,
            @"updateTime": @(obj.updateTime),
            @"updateUser": @{@"userID": obj.updateUser.userID, @"userName": obj.updateUser.userName}
        }];
    }];
    [self sendEvent:kZegoExpressUniAppEngineEventRoomExtraInfoUpdate, roomID, roomExtraInfoList, nil];
}

- (void)onRoomStreamUpdate:(ZegoUpdateType)updateType streamList:(NSArray<ZegoStream *> *)streamList extendedData:(nullable NSDictionary *)extendedData roomID:(nonnull NSString *)roomID {
    NSMutableArray<NSDictionary *> *streamArray = @[].mutableCopy;
    [streamList enumerateObjectsUsingBlock:^(ZegoStream * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        [streamArray addObject:@{
            @"streamID": obj.streamID,
            @"extraInfo": obj.extraInfo,
            @"user": @{@"userID": obj.user.userID, @"userName": obj.user.userName}
        }];
    }];
    [self sendEvent:kZegoExpressUniAppEngineEventRoomStreamUpdate, roomID, @(updateType), streamArray, extendedData, nil];
}

- (void)onRoomStreamExtraInfoUpdate:(NSArray<ZegoStream *> *)streamList roomID:(NSString *)roomID {
    NSMutableArray<NSDictionary *> *streamArray = @[].mutableCopy;
    [streamList enumerateObjectsUsingBlock:^(ZegoStream * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        [streamArray addObject:@{
            @"streamID": obj.streamID,
            @"extraInfo": obj.extraInfo,
            @"user": @{@"userID": obj.user.userID, @"userName": obj.user.userName}
        }];
    }];
    [self sendEvent:kZegoExpressUniAppEngineEventRoomStreamExtraInfoUpdate, roomID, streamArray, nil];
}

- (void)onPublisherStateUpdate:(ZegoPublisherState)state errorCode:(int)errorCode extendedData:(NSDictionary *)extendedData streamID:(NSString *)streamID {

    [self sendEvent:kZegoExpressUniAppEngineEventPublisherStateUpdate, streamID, @(state), @(errorCode), extendedData, nil];
}

- (void)onPublisherQualityUpdate:(ZegoPublishStreamQuality *)quality streamID:(NSString *)streamID {
    NSDictionary *qualityDic = @{
        @"videoCaptureFPS": @(quality.videoCaptureFPS),
        @"videoEncodeFPS": @(quality.videoEncodeFPS),
        @"videoSendFPS": @(quality.videoSendFPS),
        @"videoKBPS": @(quality.videoKBPS),
        @"audioCaptureFPS": @(quality.audioCaptureFPS),
        @"audioSendFPS": @(quality.audioSendFPS),
        @"audioKBPS": @(quality.audioKBPS),
        @"rtt": @(quality.rtt),
        @"packetLostRate": @(quality.packetLostRate),
        @"level": @(quality.level),
        @"isHardwareEncode": @(quality.isHardwareEncode),
        @"videoCodecID": @(quality.videoCodecID ),
        @"totalSendBytes": @(quality.totalSendBytes),
        @"audioSendBytes": @(quality.audioSendBytes),
        @"videoSendBytes": @(quality.videoSendBytes)
    };
    [self sendEvent:kZegoExpressUniAppEngineEventPublisherQualityUpdate, streamID, qualityDic, nil];
}

- (void)onPublisherCapturedAudioFirstFrame {
    [self sendEvent:kZegoExpressUniAppEngineEventPublisherCapturedAudioFirstFrame, @{}, nil];
}

- (void)onPublisherCapturedVideoFirstFrame:(ZegoPublishChannel)channel {
    [self sendEvent:kZegoExpressUniAppEngineEventPublisherCapturedVideoFirstFrame, @(channel), nil];
}

- (void)onPublisherVideoSizeChanged:(CGSize)size channel:(ZegoPublishChannel)channel {
    [self sendEvent:kZegoExpressUniAppEngineEventPublisherVideoSizeChanged, @(size.width), @(size.height), @(channel), nil];
}

- (void)onPlayerStateUpdate:(ZegoPlayerState)state errorCode:(int)errorCode extendedData:(NSDictionary *)extendedData streamID:(NSString *)streamID {
    [self sendEvent:kZegoExpressUniAppEngineEventPlayerStateUpdate, streamID, @(state), @(errorCode), extendedData, nil];
}

- (void)onPlayerQualityUpdate:(ZegoPlayStreamQuality *)quality streamID:(NSString *)streamID {
    NSDictionary *qualityDic = @{
        @"videoRecvFPS": @(quality.videoRecvFPS),
        @"videoDejitterFPS": @(quality.videoDejitterFPS),
        @"videoDecodeFPS": @(quality.videoDecodeFPS),
        @"videoRenderFPS": @(quality.videoRenderFPS),
        @"videoKBPS": @(quality.videoKBPS),
        @"videoBreakRate": @(quality.videoBreakRate),
        @"audioRecvFPS": @(quality.audioRecvFPS),
        @"audioDejitterFPS": @(quality.audioDejitterFPS),
        @"audioDecodeFPS": @(quality.audioDecodeFPS),
        @"audioRenderFPS": @(quality.audioRenderFPS),
        @"audioKBPS": @(quality.audioKBPS),
        @"audioBreakRate": @(quality.audioBreakRate),
        @"rtt": @(quality.rtt),
        @"packetLostRate": @(quality.packetLostRate),
        @"peerToPeerPacketLostRate": @(quality.peerToPeerPacketLostRate),
        @"peerToPeerDelay": @(quality.peerToPeerDelay),
        @"level": @(quality.level),
        @"delay": @(quality.delay),
        @"avTimestampDiff": @(quality.avTimestampDiff),
        @"isHardwareDecode": @(quality.isHardwareDecode),
        @"videoCodecID": @(quality.videoCodecID),
        @"totalRecvBytes": @(quality.totalRecvBytes),
        @"audioRecvBytes": @(quality.audioRecvBytes),
        @"videoRecvBytes": @(quality.videoRecvBytes)
    };
    
    [self sendEvent:kZegoExpressUniAppEngineEventPlayerQualityUpdate, streamID, qualityDic, nil];
}

- (void)onPlayerMediaEvent:(ZegoPlayerMediaEvent)event streamID:(NSString *)streamID {
    [self sendEvent:kZegoExpressUniAppEngineEventPlayerMediaEvent, streamID, @(event), nil];
}

- (void)onPlayerRecvAudioFirstFrame:(NSString *)streamID {
    [self sendEvent:kZegoExpressUniAppEngineEventPlayerRecvAudioFirstFrame, streamID, nil];
}

- (void)onPlayerRecvVideoFirstFrame:(NSString *)streamID {
    [self sendEvent:kZegoExpressUniAppEngineEventPlayerRecvVideoFirstFrame, streamID, nil];
}

- (void)onPlayerRenderVideoFirstFrame:(NSString *)streamID {
    [self sendEvent:kZegoExpressUniAppEngineEventPlayerRenderVideoFirstFrame, streamID, nil];
}

- (void)onPlayerVideoSizeChanged:(CGSize)size streamID:(NSString *)streamID {
    [self sendEvent:kZegoExpressUniAppEngineEventPlayerVideoSizeChanged, streamID, @(size.width), @(size.height), nil];
}

- (void)onMixerRelayCDNStateUpdate:(NSArray<ZegoStreamRelayCDNInfo *> *)infoList taskID:(NSString *)taskID {
    NSMutableArray *infoArray = @[].mutableCopy;
    [infoList enumerateObjectsUsingBlock:^(ZegoStreamRelayCDNInfo * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        [infoArray addObject:@{
            @"url": obj.url,
            @"state": @(obj.state),
            @"stateTime": @(obj.stateTime),
            @"updateReason": @(obj.updateReason)
        }];
    }];
    [self sendEvent:kZegoExpressUniAppEngineEventMixerRelayCDNStateUpdate, taskID, infoArray, nil];
}

- (void)onMixerSoundLevelUpdate:(NSDictionary<NSNumber *,NSNumber *> *)soundLevels {
    /// uniapp ??????????????? js ??????key ?????? string ??????
    NSMutableDictionary *mutableDic = @{}.mutableCopy;
    [soundLevels enumerateKeysAndObjectsUsingBlock:^(NSNumber * _Nonnull key, NSNumber * _Nonnull obj, BOOL * _Nonnull stop) {
        mutableDic[key.stringValue] = obj;
    }];
    [self sendEvent:kZegoExpressUniAppEngineEventMixerSoundLevelUpdate, mutableDic, nil];
}

- (void)onCapturedSoundLevelUpdate:(NSNumber *)soundLevel {
    [self sendEvent:kZegoExpressUniAppEngineEventCapturedSoundLevelUpdate, soundLevel, nil];
}

- (void)onRemoteSoundLevelUpdate:(NSDictionary<NSString *,NSNumber *> *)soundLevels {
    [self sendEvent:kZegoExpressUniAppEngineEventRemoteSoundLevelUpdate, soundLevels, nil];
}

- (void)onDeviceError:(int)errorCode deviceName:(NSString *)deviceName {
    [self sendEvent:kZegoExpressUniAppEngineEventDeviceError, @(errorCode), deviceName, nil];
}

- (void)onRemoteCameraStateUpdate:(ZegoRemoteDeviceState)state streamID:(NSString *)streamID {
    [self sendEvent:kZegoExpressUniAppEngineEventRemoteCameraStateUpdate, streamID, @(state), nil];
}

- (void)onRemoteMicStateUpdate:(ZegoRemoteDeviceState)state streamID:(NSString *)streamID {
    [self sendEvent:kZegoExpressUniAppEngineEventRemoteMicStateUpdate, streamID, @(state), nil];
}

- (void)onIMRecvBroadcastMessage:(NSArray<ZegoBroadcastMessageInfo *> *)messageList roomID:(NSString *)roomID {
    NSMutableArray *messageArray = @[].mutableCopy;
    [messageList enumerateObjectsUsingBlock:^(ZegoBroadcastMessageInfo * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        [messageArray addObject:@{
            @"message": obj.message,
            @"messageID": @(obj.messageID),
            @"sendTime": @(obj.sendTime),
            @"fromUser": @{@"userID": obj.fromUser.userID,@"userName": obj.fromUser.userName}
        }];
    }];
    [self sendEvent:kZegoExpressUniAppEngineEventIMRecvBroadcastMessage, roomID, messageArray, nil];
}

- (void)onIMRecvBarrageMessage:(NSArray<ZegoBarrageMessageInfo *> *)messageList roomID:(NSString *)roomID {
    NSMutableArray *messageArray = @[].mutableCopy;
    [messageList enumerateObjectsUsingBlock:^(ZegoBarrageMessageInfo * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        [messageArray addObject:@{
            @"message": obj.message,
            @"messageID": obj.messageID,
            @"sendTime": @(obj.sendTime),
            @"fromUser": @{@"userID": obj.fromUser.userID,@"userName": obj.fromUser.userName}
        }];
    }];
    [self sendEvent:kZegoExpressUniAppEngineEventIMRecvBarrageMessage, roomID, messageArray, nil];
}

- (void)onIMRecvCustomCommand:(NSString *)command fromUser:(ZegoUser *)fromUser roomID:(NSString *)roomID {
    NSDictionary *userDic = @{
        @"userID":fromUser.userID,
        @"userName":fromUser.userName
    };
    [self sendEvent:kZegoExpressUniAppEngineEventIMRecvCustomCommand, roomID, userDic, command, nil];
}

- (void)mediaPlayer:(ZegoMediaPlayer *)mediaPlayer stateUpdate:(ZegoMediaPlayerState)state errorCode:(int)errorCode {
    [self sendMediaPlayerEvent:kZegoExpressUniAppMediaEventMediaPlayerStateUpdate index:mediaPlayer.index, @(state), @(errorCode), nil];
}

- (void)mediaPlayer:(ZegoMediaPlayer *)mediaPlayer networkEvent:(ZegoMediaPlayerNetworkEvent)networkEvent {
    [self sendMediaPlayerEvent:kZegoExpressUniAppMediaEventMediaPlayerNetworkEvent index:mediaPlayer.index, @(networkEvent), nil];
}

- (void)mediaPlayer:(ZegoMediaPlayer *)mediaPlayer playingProgress:(unsigned long long)millisecond {
    [self sendMediaPlayerEvent:kZegoExpressUniAppMediaEventMediaPlayerPlayingProgress index:mediaPlayer.index, @(millisecond), nil];
}

- (void)mediaPlayer:(ZegoMediaPlayer *)mediaPlayer recvSEI:(NSData *)data {
    [self sendMediaPlayerEvent:kZegoExpressUniAppMediaEventMediaPlayerRecvSEI index:mediaPlayer.index, data, nil];
}
#pragma mark - MediaPlayer

- (void)createMediaPlayer:(UniModuleKeepAliveCallback)callback {
    ZegoMediaPlayer *player = [[ZegoExpressEngine sharedEngine] createMediaPlayer];
    if (!player) {
        [self callbackNotNull:callback];
        return;
    }
    [player setEventHandler:self];
    [self.mediaPlayerDict setValue:player forKey:player.index.stringValue];
    NSDictionary *result = @{
        @"playerID": player.index
    };
    [self callbackNotNull:callback data:result];
}

- (void)destroyMediaPlayer:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    [self.mediaPlayerDict removeObjectForKey:@(playerID).stringValue];
    ZegoMediaPlayer *player = self.mediaPlayerDict[@(playerID).stringValue];
    if (player) {
        [[ZegoExpressEngine sharedEngine] destroyMediaPlayer:player];
    }
    [self callbackNotNull:callback];
}

- (void)mediaPlayerLoadResource:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    NSString *path = [DCUniConvert NSString:params[@"path"]];
    
    ZegoMediaPlayer *player = self.mediaPlayerDict[@(playerID).stringValue];
    if (player) {
        [player loadResource:path callback:^(int errorCode) {
            [self callbackNotNull:callback data:@(errorCode)];
        }];
    }
}

- (void)mediaPlayerSetPlayerView:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    ZegoMediaPlayer *player = self.mediaPlayerDict[@(playerID).stringValue];
    ZegoCanvas *canvas = ZegoExpressUniAppViewStore.sharedInstance.mediaPlayerViewDict[@(playerID).stringValue];
    [player setPlayerCanvas:canvas];
    [self callbackNotNull:callback];
}

- (void)mediaPlayerStart:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    ZegoMediaPlayer *player = self.mediaPlayerDict[@(playerID).stringValue];
    if (player) {
        [player start];
    }
    
    [self callbackNotNull:callback];
}

- (void)mediaPlayerStop:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    ZegoMediaPlayer *player = self.mediaPlayerDict[@(playerID).stringValue];
    if (player) {
        [player stop];
    }
    
    [self callbackNotNull:callback];
}

- (void)mediaPlayerPause:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    ZegoMediaPlayer *player = self.mediaPlayerDict[@(playerID).stringValue];
    if (player) {
        [player pause];
    }
    
    [self callbackNotNull:callback];
}

- (void)mediaPlayerResume:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    ZegoMediaPlayer *player = self.mediaPlayerDict[@(playerID).stringValue];
    if (player) {
        [player resume];
    }
    
    [self callbackNotNull:callback];
}

- (void)mediaPlayerSeekTo:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    ZegoMediaPlayer *player = self.mediaPlayerDict[@(playerID).stringValue];
    if (player) {
        unsigned long long millisecond = [params[@"millisecond"] unsignedLongLongValue];
        [player seekTo:millisecond callback:^(int errorCode) {
            [self callbackNotNull:callback data:@(errorCode)];
        }];
    } else {
        [self callbackNotNull:callback];
    }
}

- (void)mediaPlayerEnableRepeat:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    ZegoMediaPlayer *player = self.mediaPlayerDict[@(playerID).stringValue];
    if (player) {
        BOOL enable = [params[@"enable"] boolValue];
        [player enableRepeat:enable];
    }
    [self callbackNotNull:callback];
}

- (void)mediaPlayerEnableAux:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    ZegoMediaPlayer *player = self.mediaPlayerDict[@(playerID).stringValue];
    if (player) {
        BOOL enable = [params[@"enable"] boolValue];
        [player enableAux:enable];
    }
    [self callbackNotNull:callback];
}

- (void)mediaPlayerMuteLocal:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    ZegoMediaPlayer *player = self.mediaPlayerDict[@(playerID).stringValue];
    if (player) {
        BOOL mute = [params[@"mute"] boolValue];
        [player muteLocal:mute];
    }
    [self callbackNotNull:callback];
}

- (void)mediaPlayerSetVolume:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    ZegoMediaPlayer *player = self.mediaPlayerDict[@(playerID).stringValue];
    if (player) {
        int volume = [params[@"volume"] intValue];
        [player setVolume:volume];
    }
    [self callbackNotNull:callback];
}

- (void)mediaPlayerSetPlayVolume:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    ZegoMediaPlayer *player = self.mediaPlayerDict[@(playerID).stringValue];
    if (player) {
        int volume = [params[@"volume"] intValue];
        [player setVolume:volume];
    }
    [self callbackNotNull:callback];
}

- (void)mediaPlayerSetPublishVolume:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    ZegoMediaPlayer *player = self.mediaPlayerDict[@(playerID).stringValue];
    if (player) {
        int volume = [params[@"volume"] intValue];
        [player setVolume:volume];
    }
    [self callbackNotNull:callback];
}

- (void)mediaPlayerSetProgressInterval:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    ZegoMediaPlayer *player = self.mediaPlayerDict[@(playerID).stringValue];
    if (player) {
        unsigned long long millisecond = [params[@"millisecond"] unsignedLongLongValue];
        [player setProgressInterval:millisecond];
    }
    [self callbackNotNull:callback];
}

- (void)mediaPlayerSetAudioTrackIndex:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    ZegoMediaPlayer *player = self.mediaPlayerDict[@(playerID).stringValue];
    if (player) {
        unsigned int index = [params[@"index"] unsignedIntValue];
        [player setAudioTrackIndex:index];
    }
    [self callbackNotNull:callback];
}

- (void)mediaPlayerSetVoiceChangerParam:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    ZegoMediaPlayer *player = self.mediaPlayerDict[@(playerID).stringValue];
    if (player) {
        ZegoMediaPlayerAudioChannel channel = [params[@"audioChannel"] unsignedIntValue];
        ZegoVoiceChangerParam *changerParam = [[ZegoVoiceChangerParam alloc] init];
        NSDictionary *param = params[@"param"];
        if (param && [param isKindOfClass:NSDictionary.class]) {
            changerParam.pitch = [param[@"pitch"] floatValue];
        }
        [player setVoiceChangerParam:changerParam audioChannel:channel];
    }
    [self callbackNotNull:callback];
}

- (void)mediaPlayerTakeSnapshot:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    ZegoMediaPlayer *player = self.mediaPlayerDict[@(playerID).stringValue];
    if (player) {
        [player takeSnapshot:^(int errorCode, ZGImage * _Nullable image) {
            NSString *imgBase64Str = nil;
            if (image) {
                NSData *imgData = UIImageJPEGRepresentation(image, 0.7);
                imgBase64Str = [imgData base64EncodedStringWithOptions:0];
            }
            [self callbackNotNull:callback data:@{@"errorCode": @(errorCode),
                                                  @"imageBase64": imgBase64Str ?: NSNull.null}];
        }];
    } else {
        [self callbackNotNull:callback];
    }
}

- (void)mediaPlayerEnableAccurateSeek:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    ZegoMediaPlayer *player = self.mediaPlayerDict[@(playerID).stringValue];
    if (player) {
        BOOL enable = [params[@"enable"] boolValue];
        NSDictionary *config = params[@"config"];
        ZegoAccurateSeekConfig *seekConfig = [[ZegoAccurateSeekConfig alloc] init];
        if (config && [config isKindOfClass:NSDictionary.class]) {
            seekConfig.timeout = [config[@"timeout"] unsignedLongLongValue];
        }
        [player enableAccurateSeek:enable config:seekConfig];
    }
    [self callbackNotNull:callback];
}

- (void)mediaPlayerSetNetWorkResourceMaxCache:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    ZegoMediaPlayer *player = self.mediaPlayerDict[@(playerID).stringValue];
    if (player) {
        unsigned int time = [params[@"time"] unsignedIntValue];
        unsigned int size = [params[@"size"] unsignedIntValue];
        [player setNetWorkResourceMaxCache:time size:size];
    }
    [self callbackNotNull:callback];
}

- (void)mediaPlayerSetNetWorkBufferThreshold:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    ZegoMediaPlayer *player = self.mediaPlayerDict[@(playerID).stringValue];
    if (player) {
        unsigned int threshold = [params[@"threshold"] unsignedIntValue];
        [player setNetWorkBufferThreshold:threshold];
    }
    [self callbackNotNull:callback];
}

- (void)mediaPlayerGetTotalDuration:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    ZegoMediaPlayer *player = self.mediaPlayerDict[@(playerID).stringValue];
    if (player) {
        [self callbackNotNull:callback data:@(player.totalDuration)];
    } else {
        [self callbackNotNull:callback];
    }
}

- (void)mediaPlayerGetCurrentProgress:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    ZegoMediaPlayer *player = self.mediaPlayerDict[@(playerID).stringValue];
    if (player) {
        [self callbackNotNull:callback data:@(player.currentProgress)];
    } else {
        [self callbackNotNull:callback];
    }
}

- (void)mediaPlayerGetPlayVolume:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    ZegoMediaPlayer *player = self.mediaPlayerDict[@(playerID).stringValue];
    if (player) {
        [self callbackNotNull:callback data:@(player.playVolume)];
    } else {
        [self callbackNotNull:callback];
    }
}

- (void)mediaPlayerGetPublishVolume:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    ZegoMediaPlayer *player = self.mediaPlayerDict[@(playerID).stringValue];
    if (player) {
        [self callbackNotNull:callback data:@(player.publishVolume)];
    } else {
        [self callbackNotNull:callback];
    }
}

- (void)mediaPlayerGetAudioTrackCount:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    ZegoMediaPlayer *player = self.mediaPlayerDict[@(playerID).stringValue];
    if (player) {
        [self callbackNotNull:callback data:@(player.audioTrackCount)];
    } else {
        [self callbackNotNull:callback];
    }
}

- (void)mediaPlayerGetCurrentState:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    ZegoMediaPlayer *player = self.mediaPlayerDict[@(playerID).stringValue];
    if (player) {
        [self callbackNotNull:callback data:@(player.currentState)];
    } else {
        [self callbackNotNull:callback];
    }
}

- (void)mediaPlayerGetNetWorkResourceCache:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    ZegoMediaPlayer *player = self.mediaPlayerDict[@(playerID).stringValue];
    if (player) {
        ZegoNetWorkResourceCache *cache = player.getNetWorkResourceCache;
        [self callbackNotNull:callback data:@{@"time": @(cache.time), @"size": @(cache.size)}];
    } else {
        [self callbackNotNull:callback];
    }
}


#pragma mark - AudioEffectPlayer

- (void)createAudioEffectPlayer:(UniModuleKeepAliveCallback)callback {
    ZegoAudioEffectPlayer *player = [[ZegoExpressEngine sharedEngine] createAudioEffectPlayer];
    [self.audioEffectPlayerDict setValue:player forKey:player.getIndex.stringValue];
    NSDictionary *result = @{
        @"playerID": player.getIndex
    };
    [self callbackNotNull:callback data:result];
}

- (void)destroyAudioEffectPlayer:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    ZegoAudioEffectPlayer *player = self.audioEffectPlayerDict[@(playerID).stringValue];
    if (player) {
        [[ZegoExpressEngine sharedEngine] destroyAudioEffectPlayer:player];
    }
    [self callbackNotNull:callback];
}

- (void)audioEffectPlayerStart:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    unsigned int audioEffectID = [params[@"audioEffectID"] unsignedIntValue];
    NSString *path = [DCUniConvert NSString:params[@"path"]];
    NSDictionary *config = params[@"config"];
    
    ZegoAudioEffectPlayer *player = self.audioEffectPlayerDict[@(playerID).stringValue];
    ZegoAudioEffectPlayConfig *configT = [[ZegoAudioEffectPlayConfig alloc] init];
    if (config[@"isPublishOut"]) {
        configT.isPublishOut = [config[@"isPublishOut"] boolValue];
    }
    if (config[@"playCount"]) {
        configT.playCount = [config[@"playCount"] unsignedIntValue];
    }
    if (player) {
        [player start:audioEffectID path:path config:configT];
    }
    [self callbackNotNull:callback];
}

- (void)audioEffectPlayerStop:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    unsigned int audioEffectID = [params[@"audioEffectID"] unsignedIntValue];
    ZegoAudioEffectPlayer *player = self.audioEffectPlayerDict[@(playerID).stringValue];
    if (player) {
        [player stop:audioEffectID];
    }
    [self callbackNotNull:callback];
}


- (void)audioEffectPlayerPause:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    unsigned int audioEffectID = [params[@"audioEffectID"] unsignedIntValue];
    ZegoAudioEffectPlayer *player = self.audioEffectPlayerDict[@(playerID).stringValue];
    if (player) {
        [player pause:audioEffectID];
    }
    [self callbackNotNull:callback];
}


- (void)audioEffectPlayerResume:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    unsigned int audioEffectID = [params[@"audioEffectID"] unsignedIntValue];
    ZegoAudioEffectPlayer *player = self.audioEffectPlayerDict[@(playerID).stringValue];
    if (player) {
        [player resume:audioEffectID];
    }
    [self callbackNotNull:callback];
}

- (void)audioEffectPlayerStopAll:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    ZegoAudioEffectPlayer *player = self.audioEffectPlayerDict[@(playerID).stringValue];
    if (player) {
        [player stopAll];
    }
    [self callbackNotNull:callback];
}

- (void)audioEffectPlayerPauseAll:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    ZegoAudioEffectPlayer *player = self.audioEffectPlayerDict[@(playerID).stringValue];
    if (player) {
        [player pauseAll];
    }
    [self callbackNotNull:callback];
}

- (void)audioEffectPlayerResumeAll:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    ZegoAudioEffectPlayer *player = self.audioEffectPlayerDict[@(playerID).stringValue];
    if (player) {
        [player resumeAll];
    }
    [self callbackNotNull:callback];
}

- (void)audioEffectPlayerSeekTo:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    ZegoAudioEffectPlayer *player = self.audioEffectPlayerDict[@(playerID).stringValue];
    if (player) {
        unsigned int audioEffectID = [params[@"audioEffectID"] unsignedIntValue];
        unsigned long long millisecond = [params[@"millisecond"] unsignedLongLongValue];
        [player seekTo:millisecond audioEffectID:audioEffectID callback:^(int errorCode) {
            [self callbackNotNull:callback data:@(errorCode)];
        }];
    } else {
        [self callbackNotNull:callback];
    }
}

- (void)audioEffectPlayerSetVolume:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    ZegoAudioEffectPlayer *player = self.audioEffectPlayerDict[@(playerID).stringValue];
    if (player) {
        int volume = [params[@"volume"] intValue];
        unsigned int audioEffectID = [params[@"audioEffectID"] unsignedIntValue];
        [player setVolume:volume audioEffectID:audioEffectID];
    }
    [self callbackNotNull:callback];
}

- (void)audioEffectPlayerSetVolumeAll:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    ZegoAudioEffectPlayer *player = self.audioEffectPlayerDict[@(playerID).stringValue];
    if (player) {
        int volume = [params[@"volume"] intValue];
        [player setVolumeAll:volume];
    }
    [self callbackNotNull:callback];
}

- (void)audioEffectPlayerGetTotalDuration:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    ZegoAudioEffectPlayer *player = self.audioEffectPlayerDict[@(playerID).stringValue];
    if (player) {
        unsigned int audioEffectID = [params[@"audioEffectID"] unsignedIntValue];
        unsigned long long duration = [player getTotalDuration:audioEffectID];
        [self callbackNotNull:callback data:@(duration)];
    } else {
        [self callbackNotNull:callback];
    }
}

- (void)audioEffectPlayerGetCurrentProgress:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    ZegoAudioEffectPlayer *player = self.audioEffectPlayerDict[@(playerID).stringValue];
    if (player) {
        unsigned int audioEffectID = [params[@"audioEffectID"] unsignedIntValue];
        unsigned long long progress = [player getCurrentProgress:audioEffectID];
        [self callbackNotNull:callback data:@(progress)];
    } else {
        [self callbackNotNull:callback];
    }
}

- (void)audioEffectPlayerLoadResource:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    ZegoAudioEffectPlayer *player = self.audioEffectPlayerDict[@(playerID).stringValue];
    if (player) {
        unsigned int audioEffectID = [params[@"audioEffectID"] unsignedIntValue];
        NSString *path = params[@"path"];
        [player loadResource:path audioEffectID:audioEffectID callback:^(int errorCode) {
            [self callbackNotNull:callback data:@(errorCode)];
        }];
    } else {
        [self callbackNotNull:callback];
    }
}

- (void)audioEffectPlayerUnloadResource:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSInteger playerID = [params[@"playerID"] integerValue];
    ZegoAudioEffectPlayer *player = self.audioEffectPlayerDict[@(playerID).stringValue];
    if (player) {
        unsigned int audioEffectID = [params[@"audioEffectID"] unsignedIntValue];
        [player unloadResource:audioEffectID];
    }
    [self callbackNotNull:callback];
}

#pragma mark - Preprocess

- (void)enableAEC:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    BOOL enable = [params[@"enable"] boolValue];
    
    [ZegoExpressEngine.sharedEngine enableAEC:enable];
    [self callbackNotNull:callback];
}

- (void)enableHeadphoneAEC:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    BOOL enable = [params[@"enable"] boolValue];
    
    [ZegoExpressEngine.sharedEngine enableHeadphoneAEC:enable];
    [self callbackNotNull:callback];
}

- (void)setAECMode:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    ZegoAECMode mode = [params[@"mode"] unsignedIntValue];
    
    [ZegoExpressEngine.sharedEngine setAECMode:mode];
    [self callbackNotNull:callback];
}

- (void)enableAGC:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    BOOL enable = [params[@"enable"] boolValue];
    
    [ZegoExpressEngine.sharedEngine enableAGC:enable];
    [self callbackNotNull:callback];
}

- (void)enableANS:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    BOOL enable = [params[@"enable"] boolValue];
    
    [ZegoExpressEngine.sharedEngine enableANS:enable];
    [self callbackNotNull:callback];
}

- (void)enableTransientANS:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    BOOL enable = [params[@"enable"] boolValue];
    
    [ZegoExpressEngine.sharedEngine enableTransientANS:enable];
    [self callbackNotNull:callback];
}

- (void)setANSMode:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    ZegoANSMode mode = [params[@"mode"] unsignedIntValue];
    
    [ZegoExpressEngine.sharedEngine setANSMode:mode];
    [self callbackNotNull:callback];
}

- (void)enableBeautify:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    ZegoBeautifyFeature feature = [params[@"feature"] unsignedIntValue];
    ZegoPublishChannel channel = [params[@"channel"] unsignedIntValue];
    
    [ZegoExpressEngine.sharedEngine enableBeautify:feature channel:channel];
    [self callbackNotNull:callback];
}

- (void)setBeautifyOption:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSDictionary *option = params[@"option"];
    ZegoPublishChannel channel = [params[@"channel"] unsignedIntValue];
    ZegoBeautifyOption *beautifyOption = [ZegoBeautifyOption defaultConfig];
    if (option && [option isKindOfClass:NSDictionary.class]) {
        beautifyOption.polishStep = [option[@"polishStep"] doubleValue];
        beautifyOption.sharpenFactor = [option[@"sharpenFactor"] doubleValue];
        beautifyOption.whitenFactor = [option[@"whitenFactor"] doubleValue];
    }
    
    [ZegoExpressEngine.sharedEngine setBeautifyOption:beautifyOption channel:channel];
    [self callbackNotNull:callback];
}

- (void)setAudioEqualizerGain:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    CGFloat bandGain = [params[@"bandGain"] floatValue];
    int bandIndex = [params[@"bandIndex"] intValue];
    
    [ZegoExpressEngine.sharedEngine setAudioEqualizerGain:bandIndex bandGain:bandGain];
    [self callbackNotNull:callback];
}

- (void)setVoiceChangerPreset:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    ZegoVoiceChangerPreset preset = [params[@"preset"] unsignedIntValue];
    
    [ZegoExpressEngine.sharedEngine setVoiceChangerPreset:preset];
    [self callbackNotNull:callback];
}

- (void)setVoiceChangerParam:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSDictionary *param = params[@"param"];
    ZegoVoiceChangerParam *changerParam = [[ZegoVoiceChangerParam alloc] init];
    if (param && [param isKindOfClass:NSDictionary.class]) {
        changerParam.pitch = [param[@"pitch"] floatValue];
    }
    
    [ZegoExpressEngine.sharedEngine setVoiceChangerParam:changerParam];
    [self callbackNotNull:callback];
}

- (void)setReverbPreset:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    ZegoReverbPreset preset = [params[@"preset"] unsignedIntValue];
    
    [ZegoExpressEngine.sharedEngine setReverbPreset:preset];
    [self callbackNotNull:callback];
}

- (void)setReverbAdvancedParam:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSDictionary *param = params[@"param"];
    ZegoReverbAdvancedParam *advancedParam = [[ZegoReverbAdvancedParam alloc] init];
    if (param && [param isKindOfClass:NSDictionary.class]) {
        advancedParam.damping = [param[@"damping"] floatValue];
        advancedParam.dryGain = [param[@"dryGain"] floatValue];
        advancedParam.preDelay = [param[@"preDelay"] floatValue];
        advancedParam.reverberance = [param[@"reverberance"] floatValue];
        advancedParam.roomSize = [param[@"roomSize"] floatValue];
        advancedParam.stereoWidth = [param[@"stereoWidth"] floatValue];
        advancedParam.toneHigh = [param[@"toneHigh"] floatValue];
        advancedParam.toneLow = [param[@"toneLow"] floatValue];
        advancedParam.wetGain = [param[@"wetGain"] floatValue];
        advancedParam.wetOnly = [param[@"wetOnly"] boolValue];
    }
    
    [ZegoExpressEngine.sharedEngine setReverbAdvancedParam:advancedParam];
    [self callbackNotNull:callback];
}

- (void)setReverbEchoParam:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSDictionary *param = params[@"param"];
    ZegoReverbEchoParam *echoParam = [[ZegoReverbEchoParam alloc] init];
    if (param && [param isKindOfClass:NSDictionary.class]) {
        echoParam.inGain = [param[@"inGain"] floatValue];
        echoParam.outGain = [param[@"outGain"] floatValue];
        echoParam.numDelays = [param[@"numDelays"] intValue];
        echoParam.delay = param[@"delay"];
        echoParam.decay = param[@"decay"];
    }
    
    [ZegoExpressEngine.sharedEngine setReverbEchoParam:echoParam];
    [self callbackNotNull:callback];
}


- (void)enableVirtualStereo:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    BOOL enable = [params[@"enable"] boolValue];
    int angle = [params[@"angle"] intValue];

    [ZegoExpressEngine.sharedEngine enableVirtualStereo:enable angle:angle];
    [self callbackNotNull:callback];
}

#pragma mark - Private
- (void)setPluginVersion:(NSDictionary *)params callback:(UniModuleKeepAliveCallback)callback {
    NSString *version = params[@"version"];
    ZGLog(@"*** Plugin Version: %@", version);
    [self callbackNotNull:callback];
}

#pragma mark - Getter

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

import { pluginVersion } from "../index";
import { 
    ZegoAccurateSeekConfig,
    ZegoAECMode,
    ZegoANSMode,
    ZegoAudioCaptureStereoMode,
    ZegoAudioConfig,
    ZegoAudioRoute,
    ZegoBeautifyFeature,
    ZegoBeautifyOption,
    ZegoCapturePipelineScaleMode,
    ZegoCDNConfig,
    ZegoEngineConfig, 
    ZegoEngineProfile,
    ZegoIMSendBarrageMessageResult, 
    ZegoIMSendBroadcastMessageResult, 
    ZegoIMSendCustomCommandResult, 
    ZegoLogConfig, 
    ZegoMediaPlayer, 
    ZegoMediaPlayerAudioChannel, 
    ZegoMediaPlayerLoadResourceResult, 
    ZegoMediaPlayerSeekToResult, 
    ZegoMediaPlayerState, 
    ZegoMediaPlayerTakeSnapshotResult, 
    ZegoNetWorkResourceCache, 
    ZegoOrientation, 
    ZegoPlayerConfig, 
    ZegoPlayerTakeSnapshotResult, 
    ZegoPublishChannel, 
    ZegoPublisherSetStreamExtraInfoResult, 
    ZegoPublisherTakeSnapshotResult, 
    ZegoPublisherUpdateCdnUrlResult, 
    ZegoReverbAdvancedParam, 
    ZegoReverbEchoParam, 
    ZegoReverbPreset, 
    ZegoRoomConfig, 
    ZegoRoomSetRoomExtraInfoResult, 
    ZegoScenario, 
    ZegoSEIConfig, 
    ZegoTrafficControlFocusOnMode, 
    ZegoTrafficControlMinVideoBitrateMode, 
    ZegoTrafficControlProperty, 
    ZegoUser,
    ZegoVideoConfig, 
	ZegoVideoConfigPreset,
    ZegoVideoMirrorMode,
    ZegoVideoStreamType,
    ZegoVoiceChangerParam,
    ZegoVoiceChangerPreset,
    ZegoWatermark,
    ZegoAutoMixerTask,
    ZegoMixerStartResult,
    ZegoMixerStopResult,
    ZegoMixerTask
} from "../ZegoExpressDefines";

import { ZegoEventListener, ZegoAnyCallback, ZegoMediaPlayerListener } from "../ZegoExpressEventHandler";

// @ts-ignore
const ZegoEvent: {
    addEventListener: (event: string, callback: Function) => void;
    removeEventListener: (event: string, callback?: Function) => void;
} = uni.requireNativePlugin('globalEvent');

// @ts-ignore
const ZegoExpressNativeEngineMoudle: {
    prefix: () => string;
    callMethod: (params: {}, callback: (res: any) => void) => void;
} = uni.requireNativePlugin('zego-ZegoExpressUniAppSDK_ZegoExpressUniAppEngine');

const Prefix = ZegoExpressNativeEngineMoudle.prefix();

let engine: ZegoExpressEngineImpl | undefined;

export class ZegoExpressEngineImpl {

    static _listeners = new Map<string, Map<ZegoAnyCallback, ZegoAnyCallback>>();
    static _mediaPlayerMap = new Map<number, ZegoMediaPlayer>();

    private static _callMethod<T>(method: string, args?: {}): Promise<T> {
        return new Promise((resolve, _) => {
            ZegoExpressNativeEngineMoudle.callMethod({ method: method, args: args }, (res) => {
                resolve(res);
            })
        });
    }

    static getInstance(): ZegoExpressEngineImpl {
        if (engine) {
            return engine as ZegoExpressEngineImpl;
        }
        throw new Error('Get instance failed, Please create engine first');
    }

	static async createEngineWithProfile(profile: ZegoEngineProfile): Promise<ZegoExpressEngineImpl> {
		if (engine) {
			return engine as ZegoExpressEngineImpl;
		}
		await ZegoExpressEngineImpl._callMethod("createEngineWithProfile", { profile });
		engine = new ZegoExpressEngineImpl();
		await ZegoExpressEngineImpl._callMethod("setPluginVersion", { version: pluginVersion });
		
		return engine; 
	}

    static async createEngine(appID: number, appSign: string, isTestEnv: boolean, scenario: ZegoScenario): Promise<ZegoExpressEngineImpl> {
        if (engine) {
            return engine as ZegoExpressEngineImpl;
        }
        await ZegoExpressEngineImpl._callMethod("createEngine", { appID, appSign, isTestEnv, scenario } );
        engine = new ZegoExpressEngineImpl();
        await ZegoExpressEngineImpl._callMethod("setPluginVersion", { version: pluginVersion });

        return engine;
    }

    static async destroyEngine(): Promise<void> {
        engine = undefined;
        ZegoExpressEngineImpl._mediaPlayerMap.forEach((_, key) => {
            ZegoExpressEngineImpl._callMethod("destroyMediaPlayer", { key });
        });
        await ZegoExpressEngineImpl._callMethod("destroyEngine");
        ZegoExpressEngineImpl._listeners.forEach((_, key) =>{
            ZegoEvent.removeEventListener(Prefix + key);
        });
        ZegoExpressEngineImpl._listeners.clear();
        ZegoExpressEngineImpl._mediaPlayerMap.clear();
    }

    static setEngineConfig(config: ZegoEngineConfig): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("setEngineConfig", { config });
    }

    on<EventType extends keyof ZegoEventListener>(event: EventType, callback: ZegoEventListener[EventType]): void {
        const native_listener = (res: any) => {
            const { data } = res;
            // @ts-ignore
            callback(...data)
        };
        let map = ZegoExpressEngineImpl._listeners.get(event);
        if (map === undefined) {
            map = new Map<ZegoAnyCallback, ZegoAnyCallback>();
            ZegoExpressEngineImpl._listeners.set(event, map)
        }
        map.set(callback, native_listener);
        ZegoEvent.addEventListener(Prefix + event, native_listener);
    }

    off<EventType extends keyof ZegoEventListener>(event: EventType, callback?: ZegoEventListener[EventType]): void {
        if (callback === undefined) {
            ZegoEvent.removeEventListener(Prefix + event);
            ZegoExpressEngineImpl._listeners.delete(event);
        } else {
            const map = ZegoExpressEngineImpl._listeners.get(event);
            if (map === undefined) return;
            ZegoEvent.removeEventListener(Prefix + event, map.get(callback) as ZegoAnyCallback);
            map.delete(callback)
        }
    }

    setLogConfig(config: ZegoLogConfig): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("setLogConfig", { config } );
    }

    getVersion(): Promise<string> {
        return ZegoExpressEngineImpl._callMethod("getVersion");
    }

    uploadLog(): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("uploadLog");
    }

    callExperimentalAPI(params: string): Promise<string> {
        return ZegoExpressEngineImpl._callMethod("callExperimentalAPI", { params });
    }

    setDummyCaptureImagePath(filePath: string, channel = ZegoPublishChannel.Main): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("setDummyCaptureImagePath", { filePath, channel } )
    }

    loginRoom(roomID: string, user: ZegoUser, config?: ZegoRoomConfig): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("loginRoom", { roomID, user, config });
    }

    logoutRoom(roomID: string): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("logoutRoom", { roomID });
    }

    loginMultiRoom(roomID: string, config: ZegoRoomConfig): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("loginMultiRoom", { roomID, config })
    }

    switchRoom(fromRoomID: string, toRoomID: string, config?: ZegoRoomConfig): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("switchRoom",  { fromRoomID, toRoomID, config })
    }

    setRoomExtraInfo(value: string, key: string, roomID: string): Promise<ZegoRoomSetRoomExtraInfoResult> {
        return ZegoExpressEngineImpl._callMethod("setRoomExtraInfo", { value, key, roomID })
    }

    startPublishingStream(streamID: string, channel = ZegoPublishChannel.Main): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("startPublishingStream", { streamID, channel });
    }

    stopPublishingStream(channel = ZegoPublishChannel.Main): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("stopPublishingStream", { channel });
    }

    setStreamExtraInfo(extraInfo: string, channel = ZegoPublishChannel.Main): Promise<ZegoPublisherSetStreamExtraInfoResult> {
        return ZegoExpressEngineImpl._callMethod("setStreamExtraInfo", { extraInfo, channel });
    }

    startPreview(channel = ZegoPublishChannel.Main): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("startPreview", { channel });
    }

    stopPreview(channel = ZegoPublishChannel.Main): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("stopPreview", { channel });
    }

    setVideoConfig(config: ZegoVideoConfigPreset|ZegoVideoConfig, channel = ZegoPublishChannel.Main): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("setVideoConfig", { config, channel });
    }

    getVideoConfig(channel = ZegoPublishChannel.Main): Promise<ZegoVideoConfig> {
        return ZegoExpressEngineImpl._callMethod("getVideoConfig", { channel });
    }

    setVideoMirrorMode(mode: ZegoVideoMirrorMode, channel = ZegoPublishChannel.Main): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("setVideoMirrorMode", { mode, channel });
    }

    setAppOrientation(orientation: ZegoOrientation, channel = ZegoPublishChannel.Main): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("setAppOrientation", { orientation, channel });
    }

    setAudioConfig(config: ZegoAudioConfig): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("setAudioConfig", { config });
    }

    getAudioConfig(): Promise<ZegoAudioConfig> {
        return ZegoExpressEngineImpl._callMethod("getAudioConfig");
    }

    setPublishStreamEncryptionKey(key: string, channel = ZegoPublishChannel.Main): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("setPublishStreamEncryptionKey", { key, channel });
    }

    takePublishStreamSnapshot(channel = ZegoPublishChannel.Main): Promise<ZegoPublisherTakeSnapshotResult> {
        return ZegoExpressEngineImpl._callMethod("takePublishStreamSnapshot", { channel });
    }

    mutePublishStreamAudio(mute: boolean, channel = ZegoPublishChannel.Main): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("mutePublishStreamAudio", { mute, channel });
    }

    mutePublishStreamVideo(mute: boolean, channel = ZegoPublishChannel.Main): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("mutePublishStreamVideo", { mute, channel });
    }

    enableTrafficControl(enable: boolean, property: ZegoTrafficControlProperty, channel = ZegoPublishChannel.Main): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("enableTrafficControl", { enable, property, channel });
    }

    setMinVideoBitrateForTrafficControl(bitrate: number, mode: ZegoTrafficControlMinVideoBitrateMode, channel = ZegoPublishChannel.Main): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("setMinVideoBitrateForTrafficControl", { bitrate, mode, channel });
    }

    setTrafficControlFocusOn(mode: ZegoTrafficControlFocusOnMode, channel = ZegoPublishChannel.Main): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("setTrafficControlFocusOn", { mode, channel });
    }

    setCaptureVolume(volume: number): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("setCaptureVolume", { volume });
    }

    setAudioCaptureStereoMode(mode: ZegoAudioCaptureStereoMode): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("setAudioCaptureStereoMode", { mode });
    }

    addPublishCdnUrl(targetURL: string, streamID: string): Promise<ZegoPublisherUpdateCdnUrlResult> {
        return ZegoExpressEngineImpl._callMethod("addPublishCdnUrl", { targetURL, streamID });
    }

    removePublishCdnUrl(targetURL: string, streamID: string): Promise<ZegoPublisherUpdateCdnUrlResult> {
        return ZegoExpressEngineImpl._callMethod("removePublishCdnUrl", { targetURL, streamID });
    }

    enablePublishDirectToCDN(enable: boolean, config: ZegoCDNConfig, channel = ZegoPublishChannel.Main): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("enablePublishDirectToCDN", { enable, config, channel });
    }

    setPublishWatermark(watermark: ZegoWatermark, isPreviewVisible: boolean, channel = ZegoPublishChannel.Main): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("setPublishWatermark", { watermark, isPreviewVisible, channel });
    }

    setSEIConfig(config: ZegoSEIConfig): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("setSEIConfig", { config });
    }

    sendSEI(data: ArrayBuffer, channel = ZegoPublishChannel.Main): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("sendSEI", { data, channel });
    }

    enableHardwareEncoder(enable: boolean): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("enableHardwareEncoder", { enable });
    }

    setCapturePipelineScaleMode(mode: ZegoCapturePipelineScaleMode): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("setCapturePipelineScaleMode", { mode });
    }

    startPlayingStream(streamID: string, config?: ZegoPlayerConfig): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("startPlayingStream", { streamID, config });
    }

    stopPlayingStream(streamID: string): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("stopPlayingStream", { streamID });
    }

    setPlayStreamDecryptionKey(key: string, streamID: string): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("setPlayStreamDecryptionKey", { key, streamID });
    }

    takePlayStreamSnapshot(streamID: string): Promise<ZegoPlayerTakeSnapshotResult> {
        return ZegoExpressEngineImpl._callMethod("takePlayStreamSnapshot", { streamID });
    }

    setPlayVolume(volume: number): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("setPlayVolume", { volume });
    }

    setAllPlayStreamVolume(volume: number): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("setAllPlayStreamVolume", { volume });
    }

    setPlayStreamVideoType(streamID: string, streamType: ZegoVideoStreamType): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("setPlayStreamVideoType", { streamID, streamType });
    }    

    setPlayStreamFocusOn(streamID: string): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("setPlayStreamFocusOn", { streamID });
    }

    mutePlayStreamAudio(streamID: string, mute: boolean): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("mutePlayStreamAudio", { streamID, mute });
    }

    mutePlayStreamVideo(streamID: string, mute: boolean): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("mutePlayStreamVideo", { streamID, mute });
    }

    muteAllPlayStreamVideo(mute: boolean): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("muteAllPlayStreamVideo", { mute });
    }

    enableHardwareDecoder(enable: boolean): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("enableHardwareDecoder", { enable });
    }

    enableCheckPoc(enable: boolean): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("enableCheckPoc", { enable });
    }

    startMixerTask(task: ZegoMixerTask): Promise<ZegoMixerStartResult> {
        return ZegoExpressEngineImpl._callMethod("startMixerTask", { task });
    }

    stopMixerTask(task: ZegoMixerTask): Promise<ZegoMixerStopResult> {
        return ZegoExpressEngineImpl._callMethod("stopMixerTask", { task });
    }

    muteMicrophone(mute: boolean): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("muteMicrophone", { mute });
    }

    isMicrophoneMuted(): Promise<boolean> {
        return ZegoExpressEngineImpl._callMethod("isMicrophoneMuted");
    }

    muteSpeaker(mute: boolean): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("muteSpeaker", { mute });
    }

    isSpeakerMuted(): Promise<boolean> {
        return ZegoExpressEngineImpl._callMethod("isSpeakerMuted");
    }

    enableAudioCaptureDevice(enable: boolean): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("enableAudioCaptureDevice", { enable });
    }

    getAudioRouteType(): Promise<ZegoAudioRoute> {
        return ZegoExpressEngineImpl._callMethod("getAudioRouteType");
    }

    setAudioRouteToSpeaker(defaultToSpeaker: boolean): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("setAudioRouteToSpeaker", { defaultToSpeaker })
    }

    enableCamera(enable: boolean, channel = ZegoPublishChannel.Main): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("enableCamera", { enable, channel });
    }

    useFrontCamera(enable: boolean, channel = ZegoPublishChannel.Main): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("useFrontCamera", { enable, channel });
    }

    setCameraZoomFactor(factor: number, channel = ZegoPublishChannel.Main): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("setCameraZoomFactor", { factor, channel });
    }

    getCameraMaxZoomFactor(channel = ZegoPublishChannel.Main): Promise<number> {
        return ZegoExpressEngineImpl._callMethod("getCameraMaxZoomFactor", { channel });
    }

    startSoundLevelMonitor(millisecond?: number): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("startSoundLevelMonitor", { millisecond });
    }

    stopSoundLevelMonitor(): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("stopSoundLevelMonitor");
    }

    startAudioSpectrumMonitor(millisecond: number): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("startAudioSpectrumMonitor", { millisecond });
    }

    stopAudioSpectrumMonitor(): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("stopAudioSpectrumMonitor");
    }

    enableHeadphoneMonitor(enable: boolean): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("enableHeadphoneMonitor", { enable });
    }

    setHeadphoneMonitorVolume(volume: number): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("setHeadphoneMonitorVolume", { volume });
    }

    enableAEC(enable: boolean): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("enableAEC", { enable });
    }

    enableHeadphoneAEC(enable: boolean): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("enableHeadphoneAEC", { enable });
    }

    setAECMode(mode: ZegoAECMode): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("setAECMode", { mode });
    }

    enableAGC(enable: boolean): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("enableAGC", { enable });
    }

    enableANS(enable: boolean): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("enableANS", { enable });
    }

    enableTransientANS(enable: boolean): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("enableTransientANS", { enable });
    }

    setANSMode(mode: ZegoANSMode): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("setANSMode", { mode });
    }

    enableBeautify(feature: ZegoBeautifyFeature, channel = ZegoPublishChannel.Main): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("enableBeautify", { feature, channel });
    }

    setBeautifyOption(option: ZegoBeautifyOption, channel = ZegoPublishChannel.Main): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("setBeautifyOption", { option, channel });
    }

    setAudioEqualizerGain(bandGain: number, bandIndex: number): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("setAudioEqualizerGain", { bandGain, bandIndex });
    }
    
    setVoiceChangerPreset(preset: ZegoVoiceChangerPreset): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("setVoiceChangerPreset", { preset });
    }

    setVoiceChangerParam(param: ZegoVoiceChangerParam, audioChannel: ZegoMediaPlayerAudioChannel): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("setVoiceChangerParam", { param, audioChannel });
    }

    setReverbPreset(preset: ZegoReverbPreset): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("setReverbPreset", { preset });
    }

    setReverbAdvancedParam(param: ZegoReverbAdvancedParam): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("setReverbAdvancedParam", { param });
    }

    setReverbEchoParam(param: ZegoReverbEchoParam): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("setReverbEchoParam", { param });
    }

    enableVirtualStereo(enable: boolean, angle: number): Promise<void> {
        return ZegoExpressEngineImpl._callMethod("enableVirtualStereo", { enable, angle });
    }

    sendBroadcastMessage(roomID: string, message: string): Promise<ZegoIMSendBroadcastMessageResult> {
        return ZegoExpressEngineImpl._callMethod("sendBroadcastMessage", { roomID, message });
    }

    sendBarrageMessage(roomID: string, message: string): Promise<ZegoIMSendBarrageMessageResult> {
        return ZegoExpressEngineImpl._callMethod("sendBarrageMessage", { roomID, message });
    }

    sendCustomCommand(roomID: string, command: string, toUserList?: ZegoUser[]): Promise<ZegoIMSendCustomCommandResult> {
        return ZegoExpressEngineImpl._callMethod("sendCustomCommand", { roomID, command, toUserList });
    }

    async createMediaPlayer(): Promise<ZegoMediaPlayer | undefined> {
        const { playerID } = await ZegoExpressEngineImpl._callMethod("createMediaPlayer");
        if (playerID >= 0) {
            const mediaPlayer = new ZegoMediaPlayerImpl(playerID);
            ZegoExpressEngineImpl._mediaPlayerMap.set(playerID, mediaPlayer);
            return mediaPlayer;
        }
        return undefined;
    }

    async destroyMediaPlayer(mediaPlayer: ZegoMediaPlayer): Promise<void> {
        const index = mediaPlayer.getIndex();
        if (index >= 0) {
            await ZegoExpressEngineImpl._callMethod("destroyMediaPlayer", { index });
            ZegoExpressEngineImpl._mediaPlayerMap.delete(index);
			mediaPlayer.off("mediaPlayerStateUpdate");
			mediaPlayer.off("mediaPlayerNetworkEvent");
			mediaPlayer.off("mediaPlayerPlayingProgress");
        }
        return
    }
}


export class ZegoMediaPlayerImpl implements ZegoMediaPlayer {

    private _index: number;

    constructor(index: number) {
        this._index = index;
    }

    private _callMethod<T>(method: string, args?: {}): Promise<T> {
        return new Promise((resolve, _) => {
            ZegoExpressNativeEngineMoudle.callMethod({ method: method, args: { playerID: this._index, ...args } }, (res) => {
                resolve(res);
            })
        });
    }

    on<MediaPlayerEventType extends keyof ZegoMediaPlayerListener>(event: MediaPlayerEventType, callback: ZegoMediaPlayerListener[MediaPlayerEventType]): void {
        const native_listener = (res: any) => {
            const { data, idx } = res;
            if (idx >= 0) {
                const mediaPlayer = ZegoExpressEngineImpl._mediaPlayerMap.get(idx);
                // @ts-ignore
                callback(mediaPlayer, ...data);
            }
        };
        let map = ZegoExpressEngineImpl._listeners.get(event);
        if (map === undefined) {
            map = new Map<ZegoAnyCallback, ZegoAnyCallback>();
            ZegoExpressEngineImpl._listeners.set(event, map);
        }
        map.set(callback, native_listener);
        ZegoEvent.addEventListener(Prefix + event, native_listener);
        ZegoExpressEngineImpl._listeners.set(event, map);
    }

    off<MediaPlayerEventType extends keyof ZegoMediaPlayerListener>(event: MediaPlayerEventType, callback?: ZegoMediaPlayerListener[MediaPlayerEventType]): void {
        if (callback === undefined) {
            ZegoEvent.removeEventListener(Prefix + event);
            ZegoExpressEngineImpl._listeners.delete(event);
        } else {
            const map = ZegoExpressEngineImpl._listeners.get(event);
            if (map === undefined) {
                return;
            }
            ZegoEvent.removeEventListener(Prefix + event, map.get(callback) as ZegoAnyCallback);
            map.delete(callback);
        }
    }

    loadResource(path: string): Promise<ZegoMediaPlayerLoadResourceResult> {
        return this._callMethod("mediaPlayerLoadResource", { path });
    }

    start(): Promise<void> {
        return this._callMethod("mediaPlayerStart");
    }

    stop(): Promise<void> {
        return this._callMethod("mediaPlayerStop");
    }

    pause(): Promise<void> {
        return this._callMethod("mediaPlayerPause");
    }

    resume(): Promise<void> {
        return this._callMethod("mediaPlayerResume");
    }
	
	setPlayerView(playerID: number): Promise<void> {
		return this._callMethod("mediaPlayerSetPlayerView", { playerID });
	}

    seekTo(millisecond: number): Promise<ZegoMediaPlayerSeekToResult> {
        return this._callMethod("mediaPlayerSeekTo", { millisecond });
    }

    enableRepeat(enable: boolean): Promise<void> {
        return this._callMethod("mediaPlayerEnableRepeat", { enable });
    }

    enableAux(enable: boolean): Promise<void> {
        return this._callMethod("mediaPlayerEnableAux", { enable });
    }

    muteLocal(mute: boolean): Promise<void> {
        return this._callMethod("mediaPlayerMuteLocal", { mute });
    }

    setVolume(volume: number): Promise<void> {
        return this._callMethod("mediaPlayerSetVolume", { volume });
    }

    setPlayVolume(volume: number): Promise<void> {
        return this._callMethod("mediaPlayerSetPlayVolume", { volume });
    }

    setPublishVolume(volume: number): Promise<void> {
        return this._callMethod("mediaPlayerSetPublishVolume", { volume });
    }

    setProgressInterval(millisecond: number): Promise<void> {
        return this._callMethod("mediaPlayerSetProgressInterval", { millisecond });
    }

    setAudioTrackIndex(index: number): Promise<void> {
        return this._callMethod("mediaPlayerSetAudioTrackIndex", { index });
    }

    setVoiceChangerParam(param: ZegoVoiceChangerParam, audioChannel: ZegoMediaPlayerAudioChannel): Promise<void> {
        return this._callMethod("mediaPlayerSetVoiceChangerParam", { param, audioChannel });
    }

    takeSnapshot(): Promise<ZegoMediaPlayerTakeSnapshotResult> {
        return this._callMethod("mediaPlayerTakeSnapshot");
    }

    setNetworkResourceMaxCache(time: number, size: number): Promise<void> {
        return this._callMethod("mediaPlayerSetNetworkResourceMaxCache", { time, size });
    }

    setNetworkBufferThreshold(threshold: number): Promise<void> {
        return this._callMethod("mediaPlayerSetNetworkBufferThreshold", { threshold });
    }

    enableAccurateSeek(enable: boolean, config: ZegoAccurateSeekConfig): Promise<void> {
        return this._callMethod("mediaPlayerEnableAccurateSeek", { enable, config });
    }

    getNetworkResourceCache(): Promise<ZegoNetWorkResourceCache> {
        return this._callMethod("mediaPlayerGetNetworkResourceCache");
    }
    
    getPlayVolume(): Promise<number> {
        return this._callMethod("mediaPlayerGetPlayVolume");
    }

    getPublishVolume(): Promise<number> {
        return this._callMethod("mediaPlayerGetPublishVolume");
    }

    getTotalDuration(): Promise<number> {
        return this._callMethod("mediaPlayerGetTotalDuration");
    }

    getCurrentProgress(): Promise<number> {
        return this._callMethod("mediaPlayerGetCurrentProgress");
    }

    getAudioTrackCount(): Promise<number> {
        return this._callMethod("mediaPlayerGetAudioTrackCount");
    }

    getCurrentState(): Promise<ZegoMediaPlayerState> {
        return this._callMethod("mediaPlayerGetCurrentState");
    }

    getIndex(): number {
        return this._index;
    }
    
}
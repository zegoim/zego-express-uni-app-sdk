var nativeEngine = uni.requireNativePlugin('zego-ZegoExpressUniAppSDK_ZegoExpressUniAppEngine');
import ZegoMediaPlayer from './ZegoMediaPlayer'
import {
	ZegoScenario,
	ZegoLanguage,
	ZegoEngineState,
	ZegoRoomState,
	ZegoPublishChannel,
	ZegoViewMode,
	ZegoVideoMirrorMode,
	ZegoPublisherState,
	ZegoVoiceChangerPreset,
	ZegoReverbPreset,
	ZegoVideoConfigPreset,
	ZegoStreamQualityLevel,
	ZegoAudioChannel,
	ZegoAudioCaptureStereoMode,
	ZegoAudioCodecID,
	ZegoVideoCodecID,
	ZegoPlayerVideoLayer,
	ZegoAECMode,
	ZegoANSMode,
	ZegoTrafficControlProperty,
	ZegoTrafficControlMinVideoBitrateMode,
	ZegoPlayerState,
	ZegoPlayerMediaEvent,
	ZegoUpdateType,
	ZegoStreamRelayCDNState,
	ZegoStreamRelayCDNUpdateReason,
	ZegoRemoteDeviceState,
	ZegoAudioDeviceType,
	ZegoMixerInputContentType,
	ZegoCapturePipelineScaleMode,
	ZegoVideoFrameFormat,
	ZegoVideoBufferType,
	ZegoVideoFrameFormatSeries,
	ZegoVideoFlipMode,
	ZegoAudioConfigPreset,
	ZegoMediaPlayerState,
	ZegoMediaPlayerNetworkEvent,
	ZegoMediaPlayerAudioChannel,
	ZegoAudioEffectPlayState,
	ZegoDataRecordType,
	ZegoDataRecordState
} from './ZegoExpressDefines'


/**
 * @typedef {Object} ZegoExpressEngineImpl
 * @property {Map} _mediaPlayerMap 
 */

export default class ZegoExpressEngineImpl {

	/**
	 * @return {ZegoExpressEngineImpl}
	 * The Singleton ZegoExpressEngineImpl
	 */
	static getInstance() {
		if (ZegoExpressEngineImpl.instance != null) {
			return ZegoExpressEngineImpl.instance;
		} else {
			throw new Error('Get instance failed. Please create engine first')
		}
	}
	/**
	 * @param  {String} event
	 * @param  {(result: any) => Void} listener
	 */
	on(event, listener) {
		nativeEngine.on(event, result => {
			let keyFromNative = result['eventKey'];
			if (keyFromNative != null) {
				let resultFromNative = result['resultKey'];
				if (listener != null) {
					listener(resultFromNative)
				}
			}

		});
	}

	static createEngine(appID, appSign, isTestEnv, scenario) {
		if (ZegoExpressEngineImpl.instance == null) {
			ZegoExpressEngineImpl.instance = new ZegoExpressEngineImpl()
			nativeEngine.createEngine(appID, appSign, isTestEnv, scenario);
		}
		return ZegoExpressEngineImpl.instance;
	}

	static destroyEngine(callback) {
		nativeEngine.destroyEngine((boolResult) => {
			if (callback != null) {
				callback(boolResult);
			}
			console.log("Engine being destroyed");
		});
		ZegoExpressEngineImpl.instance = null;
	}

	startPreview(channel = ZegoPublishChannel.Main) {
		nativeEngine.startPreview(channel);
	}

	startPlayingStream(streamID, config = null) {
		var a = '';
		nativeEngine.startPlayingStream(streamID, config);
	}

	static setEngineConfig(config) {
		nativeEngine.setEngineConfig(config);
	}

	setDebugVerbose(enable, language) {
		nativeEngine.setDebugVerbose(enable, language);
	}

	setAppOrientation(orientation, channel) {
		nativeEngine.setAppOrientation(orientation, channel);
	}

	uploadLog() {
		nativeEngine.uploadLog();
	}

	getVersion() {
		return nativeEngine.getVersion();
	}

	loginRoom(roomID, user, config) {
		console.log(config);
		nativeEngine.loginRoom(roomID, user, config);
	}

	logoutRoom(roomID) {
		nativeEngine.logoutRoom(roomID);
	}

	startPublishingStream(streamID, channel = ZegoPublishChannel.Main) {
		nativeEngine.startPublishingStream(streamID, channel);
	}

	stopPublishingStream(channel = ZegoPublishChannel.Main) {
		nativeEngine.stopPublishingStream(channel);
	}

	setStreamExtraInfo(extraInfo, channel = ZegoPublishChannel.Main) {
		nativeEngine.setStreamExtraInfo(extraInfo, channel);
	}

	setVideoConfig(config, channel = ZegoPublishChannel.Main) {
		nativeEngine.setVideoConfig(config, channel);
	}

	getVideoConfig(channel = ZegoPublishChannel.Main) {
		return nativeEngine.getVideoConfig(channel);
	}

	setAudioConfig(config) {
		nativeEngine.setAudioConfig(config);
	}

	getAudioConfig() {
		return nativeEngine.getAudioConfig();
	}

	enableTrafficControl(enable, property) {
		nativeEngine.enableTrafficControl(enable, property);
	}

	mutePublishStreamAudio(mute, channel = ZegoPublishChannel.Main) {
		nativeEngine.mutePublishStreamAudio(mute, channel);
	}

	mutePublishStreamVideo(mute, channel = ZegoPublishChannel.Main) {
		nativeEngine.mutePublishStreamVideo(mute, channel);
	}

	setAudioCaptureStereoMode(mode) {
		nativeEngine.setAudioCaptureStereoMode(mode);
	}

	setCaptureVolume(volume) {
		nativeEngine.setCaptureVolume(volume);
	}

	setPlayVolume(streamID, volume) {
		nativeEngine.setPlayVolume(streamID, volume);
	}

	mutePlayStreamAudio(streamID, mute) {
		nativeEngine.mutePlayStreamAudio(streamID, mute);
	}

	mutePlayStreamVideo(streamID, mute) {
		nativeEngine.mutePlayStreamVideo(streamID, mute);
	}

	enableHardwareDecoder(enable) {
		nativeEngine.enableHardwareDecoder(enable);
	}

	enableCamera(enable, channel = ZegoPublishChannel) {
		nativeEngine.enableCamera(enable, channel);
	}

	useFrontCamera(enable, channel = ZegoPublishChannel) {
		nativeEngine.useFrontCamera(enable, channel);
	}

	createMediaPlayer() {
		console.log('createMediaPlayer engineIMP.js');
		var playerMap = nativeEngine.createMediaPlayer();
		var player = new ZegoMediaPlayer(playerMap);
		return player;
	}

	sendCustomCommand(roomID, command, toUserList, callback) {
		nativeEngine.sendCustomCommand(roomID, command, toUserList, callback);
	}
	
	muteMicrophone(mute){
		nativeEngine.muteMicrophone(mute);
	}
	
	muteSpeaker(mute){
		nativeEngine.muteSpeaker(mute);
	}
	
	takePublishStreamSnapshot(callback,channel = ZegoPublishChannel.Main){
		nativeEngine.takePublishStreamSnapshot(callback,channel);
	}

}

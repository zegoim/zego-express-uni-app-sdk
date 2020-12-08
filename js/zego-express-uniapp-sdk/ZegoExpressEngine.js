import ZegoExpressEngineImpl from './impl/ZegoExpressEngineImpl';
import {
    ZegoScenario,
	ZegoLanguage,
	ZegoPublishChannel,
	ZegoPlayerConfig,
	ZegoVideoConfigPreset,
    ZegoAudioCaptureStereoMode,
    ZegoTrafficControlProperty,
    ZegoEngineState,
    ZegoRoomState,
    ZegoPublisherState,
    ZegoPlayerState,
	ZegoUpdateType,
	ZegoStream,
	ZegoUser,
    ZegoMediaPlayerState,
} from './impl/ZegoExpressDefines'

/**
 * @typedef {Object} ZegoExpressEngine
 * @property @param {Map} _mediaPlayerMap 
 */

export default class ZegoExpressEngine {

	/**
	 * @param  {Number} appID
	 * @param  {String} appSign
	 * @param  {Boolean} isTestEnv
	 * @param  {ZegoScenario} scenario
	 * @return {ZegoExpressEngine}
	 */
	static createEngine(appID, appSign, isTestEnv, scenario) {
		return ZegoExpressEngineImpl.createEngine(appID, appSign, isTestEnv, scenario);
	}

	/**
	 * @return {ZegoExpressEngine}
	 * The Singleton ZegoExpressEngine
	 */
	static getInstance() {
		return ZegoExpressEngineImpl.getInstance();
	}

	/**
     * @event ZegoExpressEngine#engineStateUpdate
     * @desc The callback triggered when the audio/video engine state changes.
     *
     * When the developer calls the function that enables audio and video related functions, such as calling [startPreview], [startPublishingStream], [startPlayingStream] and MediaPlayer related function, the audio/video engine will start; when all audio and video functions are stopped, the engine state will become stopped.
     * When the developer has been [loginRoom], once [logoutRoom] is called, the audio/video engine will stop (preview, publishing/playing stream, MediaPlayer and other audio and video related functions will also stop).
     * @property @param {ZegoEngineState} result.state - The audio/video engine state
     */

    /**
     * @event ZegoExpressEngine#roomStateUpdate
     * @desc The callback triggered when the room connection state changes.
     *
     * This callback is triggered when the connection status of the room changes, and the reason for the change is notified. Developers can use this callback to determine the status of the current user in the room. If the connection is being requested for a long time, the general probability is that the user's network is unstable.
     * @property @param {string} result.roomID - Room ID, a string of up to 128 bytes in length.
     * @property @param {ZegoRoomState} result.state - Changed room state
     * @property @param {number} result.errorCode - Error code, please refer to the Error Codes https://doc-en.zego.im/en/308.html for details
     * @property @param {string} result.extendedData - Extended Information with state updates. As the standby, only an empty json table is currently returned
     */

    /**
     * @event ZegoExpressEngine#roomUserUpdate
     * @desc The callback triggered when the number of other users in the room increases or decreases.
     *
     * Note that the callback is only triggered when the isUserStatusNotify parameter in the ZegoRoomConfig passed loginRoom function is true. Developers can use this callback to determine the situation of users in the room.
     * If developers need to use ZEGO room users notifications, please make sure that each login user sets isUserStatusNotify to true
     * When a user logs in to a room for the first time, other users already exist in this room, and a user list of the type of addition is received.
     * When the user is already in the room, other users in this room will trigger this callback to notify the changed users when they enter or exit the room.
     * @property @param {string} result.roomID - Room ID where the user is logged in, a string of up to 128 bytes in length.
     * @property @param {ZegoUpdateType} result.updateType - Update type (add/delete)
     * @property @param {ZegoUser[]} result.userList - List of users changed in the current room
     */

    /**
     * @event ZegoExpressEngine#roomOnlineUserCountUpdate
     * @desc The callback triggered every 30 seconds to report the current number of online users.
     *
     * This function is called back every 30 seconds.
     * Developers can use this callback to show the number of user online in the current room.
     * @property @param {string} result.roomID - Room ID where the user is logged in, a string of up to 128 bytes in length.
     * @property @param {number} result.count - Count of online users
     */

    /**
     * @event ZegoExpressEngine#roomStreamUpdate
     * @desc The callback triggered when the number of streams published by the other users in the same room increases or decreases.
     *
     * When a user logs in to a room for the first time, there are other users in the room who are publishing streams, and will receive a stream list of the added type.
     * When the user is already in the room, other users in this room will trigger this callback to notify the changed stream list when adding or deleting streams.
     * Developers can use this callback to determine if there are other users in the same room who have added or stopped streaming, in order to implement active play stream [startPlayingStream] or active stop playing stream [stopPlayingStream], and use simultaneous Changes to Streaming render UI widget;
     * @property @param {string} result.roomID - Room ID where the user is logged in, a string of up to 128 bytes in length.
     * @property @param {ZegoUpdateType} result.updateType - Update type (add/delete)
     * @property @param {ZegoStream[]} result.streamList - Updated stream list
     */

    /**
     * @event ZegoExpressEngine#roomStreamExtraInfoUpdate
     * @desc The callback triggered when there is an update on the extra information of the streams published by other users in the same room.
     *
     * When a user publishing the stream update the extra information of the stream in the same room, other users in the same room will receive the callback.
     * The stream extra information is an extra information identifier of the stream ID. Unlike the stream ID, which cannot be modified during the publishing process, the stream extra information can be modified midway through the stream corresponding to the stream ID.
     * Developers can synchronize variable content related to stream IDs based on stream additional information.
     * @property @param {string} result.roomID - Room ID where the user is logged in, a string of up to 128 bytes in length.
     * @property @param {ZegoStream[]} result.streamList - List of streams that the extra info was updated.
     */

    /**
     * @event ZegoExpressEngine#publisherStateUpdate
     * @desc The callback triggered when the state of stream publishing changes.
     *
     * After publishing the stream successfully, the notification of the publish stream state change can be obtained through the callback function.
     * You can roughly judge the user's uplink network status based on whether the state parameter is in [PUBLISH_REQUESTING].
     * ExtendedData is extended information with state updates. If you use ZEGO's CDN content distribution network, after the stream is successfully published, the keys of the content of this parameter are flv_url_list, rtmp_url_list, hls_url_list. These correspond to the publishing stream URLs of the flv, rtmp, and hls protocols.
     * @property @param {string} result.streamID - Stream ID
     * @property @param {ZegoPublisherState} result.state - Status of publishing stream
     * @property @param {number} result.errorCode - The error code corresponding to the status change of the publish stream. Please refer to the Error Codes https://doc-en.zego.im/en/308.html for details.
     * @property @param {string} result.extendedData - Extended information with state updates.
     */

    /**
     * @event ZegoExpressEngine#playerStateUpdate
     * @desc The callback triggered when the state of stream playing changes.
     *
     * After publishing the stream successfully, the notification of the publish stream state change can be obtained through the callback function.
     * You can roughly judge the user's downlink network status based on whether the state parameter is in [PLAY_REQUESTING].
     * @property @param {string} result.streamID - stream ID
     * @property @param {ZegoPlayerState} result.state - Current play state
     * @property @param {number} result.errorCode - The error code corresponding to the status change of the playing stream. Please refer to the Error Codes https://doc-en.zego.im/en/308.html for details.
     * @property @param {string} result.extendedData - Extended Information with state updates. As the standby, only an empty json table is currently returned
     */
	
	/**
	 * @event ZegoExpressEngine#IMRecvCustomCommand
	 * @desc The callback triggered when a Custom Command is received.
	 *
	 * This callback is used to receive custom signaling sent by other users, and barrage messages sent by users themselves will not be notified through this callback.
	 * @property {string} result.roomID - Room ID
	 * @property {ZegoUser} result.fromUser - Sender of the command
	 * @property {string} result.command - Command content received
	 */
		
		
	/**
	 * register callback, the event list was listed above
	 * @param  {String} event
	 * @param  {(result: any) => Void} callback
	 */
	on(event, callback) {
		ZegoExpressEngineImpl.getInstance().on(event, callback);
	}

	/**
     * Uninitializes the Engine.
     *
     * uninitialize engine to release the resources
     */
	static destroyEngine(callback) {
		ZegoExpressEngineImpl.destroyEngine(callback);
	}
	/**
	     * Starts/Updates the local video preview (for the specified channel).
	     *
	     * The user can see his own local image by calling this function. The preview function does not require you to log in to the room or publish the stream first. But after exiting the room, SDK internally actively stops previewing by default.
	     * Local view and preview modes can be updated by calling this function again.
	     * You can set the mirror mode of the preview by calling the [setVideoMirrorMode] function. The default preview setting is image mirrored.
	     * When this api is called, the audio and video engine module inside SDK will start really, and it will start to try to collect audio and video. In addition to calling this api normally to preview the local screen, developers can also pass [null] to the canvas parameter, in conjunction with ZegoExpressEngine's sound wave function, in order to achieve the purpose of detecting whether the audio equipment is working properly before logging in to the room.
	     * @param {ZegoPublishChannel} channel - Publish stream channel
	     */
	startPreview(channel = ZegoPublishChannel.Main) {
		ZegoExpressEngineImpl.getInstance().startPreview(channel);
	}

	/**
	 * Starts playing a stream from ZEGO's streaming cloud or from third-party CDN.
	 *
	 * This function allows users to play audio and video streams both from the ZEGO real-time audio and video cloud and from third-party cdn.
	 * Before starting to play the stream, you need to join the room first, you can get the new streamID in the room by listening to the [onRoomStreamUpdate] event callback.
	 * In the case of poor network quality, user play may be interrupted, the SDK will try to reconnect, and the current play status and error information can be obtained by listening to the [onPlayerStateUpdate] event.
	 * Playing the stream ID that does not exist, the SDK continues to try to play after calling this function. After the stream ID is successfully published, the audio and video stream can be actually played.
	 * The developer can update the player canvas by calling this function again (the streamID must be the same).
	 * @param {string} streamID - Stream ID, a string of up to 256 characters. You cannot include URL keywords, otherwise publishing stream and playing stream will fails. Only support numbers, English characters and '~', '!', '@', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '.', '<', '>', '/', '\'.
	 * @param {ZegoPlayerConfig} config - Advanced player configuration, optional
	 */
	startPlayingStream(streamID, config = null) {
		ZegoExpressEngineImpl.getInstance().startPlayingStream(streamID, config);
	}

	/**
	 * Set advanced engine configuration.
	 * Developers need to call this function to set advanced function configuration when they need advanced functions of the engine.
	 * @param  {ZegoEngineConfig} config Advanced engine configuration
	 */
	static setEngineConfig(config) {
		ZegoExpressEngineImpl.setEngineConfig(config);
	}

	/**
     * Turns on/off verbose debugging and sets up the log language.
     *
     * The debug switch is set to on and the language is English by default.
     * @param {boolean} enable - Detailed debugging information switch
     * @param {ZegoLanguage} language - Debugging information language
     */
    setDebugVerbose(enable, language){
        ZegoExpressEngineImpl.getInstance().setDebugVerbose(enable, language);
	}

	/** Sets the video orientation.
     *
     * This interface sets the orientation of the video. After rotation, it will be automatically adjusted to adapt the encoded image resolution.
     *
     * @param {ZegoOrientation} orientation Video orientation 
	 * 
     * @param {ZegoPublishChannel} channel Publish stream channel
     */
	setAppOrientation(orientation, channel = ZegoPublishChannel.Main) {
        ZegoExpressEngineImpl.getInstance().setAppOrientation(orientation, channel);
	}
	
	/**
     * Uploads logs to the ZEGO server.
     *
     * By default, SDK creates and prints log files in the app's default directory. Each log file defaults to a maximum of 5MB. Three log files are written over and over in a circular fashion. When calling this function, SDK will auto package and upload the log files to the ZEGO server.
     * Developers can provide a business “feedback” channel in the app. When users feedback problems, they can call this function to upload the local log information of SDK to help locate user problems.
     * The function is valid for the entire life cycle of the SDK.
     */
    uploadLog(){
        ZegoExpressEngineImpl.getInstance().uploadLog();
	}
	
	/**
     * Gets the SDK's version number.
     *
     * When the SDK is running, the developer finds that it does not match the expected situation and submits the problem and related logs to the ZEGO technical staff for locating. The ZEGO technical staff may need the information of the engine version to assist in locating the problem.
     * Developers can also collect this information as the version information of the engine used by the app, so that the SDK corresponding to each version of the app on the line.
     * @return {string} - SDK version
     */
    getVersion(){
        return ZegoExpressEngineImpl.getInstance().getVersion();
    }

	/**
     * Logs in to a room with advanced room configurations. You must log in to a room before publishing or playing streams.
     *
     * To prevent the app from being impersonated by a malicious user, you can add authentication before logging in to the room, that is, the [token] parameter in the ZegoRoomConfig object passed in by the [config] parameter.
     * Different users who log in to the same room can get room related notifications in the same room (eg [onRoomUserUpdate], [onRoomStreamUpdate], etc.), and users in one room cannot receive room signaling notifications in another room.
     * Messages sent in one room (eg apis [setStreamExtraInfo], [sendBroadcastMessage], [sendBarrageMessage], [sendCustomCommand], etc.) cannot be received callback ((eg [onRoomStreamExtraInfoUpdate], [onIMRecvBroadcastMessage], [onIMRecvBarrageMessage], [onIMRecvCustomCommand], etc) in other rooms. Currently, SDK does not provide the ability to send messages across rooms. Developers can integrate the SDK of third-party IM to achieve.
     * SDK supports startPlayingStream audio and video streams from different rooms under the same appID, that is, startPlayingStream audio and video streams across rooms. Since ZegoExpressEngine's room related callback notifications are based on the same room, when developers want to startPlayingStream streams across rooms, developers need to maintain related messages and signaling notifications by themselves.
     * If the network is temporarily interrupted due to network quality reasons, the SDK will automatically reconnect internally. You can get the current connection status of the local room by listening to the [onRoomStateUpdate] callback method, and other users in the same room will receive [onRoomUserUpdate] callback notification.
     * It is strongly recommended that userID corresponds to the user ID of the business APP, that is, a userID and a real user are fixed and unique, and should not be passed to the SDK in a random userID. Because the unique and fixed userID allows ZEGO technicians to quickly locate online problems.
     * @param {string} roomID - Room ID, a string of up to 128 bytes in length. Only support numbers, English characters and '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '.', '<', '>', '/', '\'
     * @param {ZegoUser} user - User object instance, configure userID, userName. Note that the userID needs to be globally unique with the same appID, otherwise the user who logs in later will kick out the user who logged in first.
     * @param {ZegoRoomConfig} config - Advanced room configuration
     */
    loginRoom(roomID, user, config = { maxMemberCount:0, userUpdate: true, token:'' }){
		ZegoExpressEngineImpl.getInstance().loginRoom(roomID, user, config);
	}

	
    /**
     * Logs out of a room.
     *
     * Exiting the room will stop all publishing and playing streams for user, and inner audio and video engine will stop, and then SDK will auto stop local preview UI. After calling this function, you will receive [onRoomStateUpdate] callback notification successfully exits the room, while other users in the same room will receive the [onRoomUserUpdate] callback notification(On the premise of enabling isUserStatusNotify configuration).
     * @param {string} roomID - Room ID, a string of up to 128 bytes in length. Only support numbers, English characters and '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '.', '<', '>', '/', '\'
     */
    logoutRoom(roomID){
		ZegoExpressEngineImpl.getInstance().logoutRoom(roomID);
	}
	
	/**
     * Starts publishing a stream (for the specified channel). You can call this function to publish a second stream.
     *
     * This function allows users to publish their local audio and video streams to the ZEGO real-time audio and video cloud. Other users in the same room can use the streamID to play the audio and video streams for intercommunication.
     * Before you start to publish the stream, you need to join the room first by calling [loginRoom]. Other users in the same room can get the streamID by monitoring the [onRoomStreamUpdate] event callback after the local user publishing stream successfully.
     * In the case of poor network quality, user publish may be interrupted, and the SDK will attempt to reconnect. You can learn about the current state and error information of the stream published by monitoring the [onPublisherStateUpdate] event.
     * @param {string} streamID - Stream ID, a string of up to 256 characters, needs to be globally unique within the entire AppID. If in the same AppID, different users publish each stream and the stream ID is the same, which will cause the user to publish the stream failure. You cannot include URL keywords, otherwise publishing stream and playing stream will fails. Only support numbers, English characters and '~', '!', '@', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '.', '<', '>', '/', '\'.
     */
    startPublishingStream(streamID, channel = ZegoPublishChannel.Main){
        ZegoExpressEngineImpl.getInstance().startPublishingStream(streamID, channel);
	}

	/**
     * Stops publishing a stream (for the specified channel).
     *
     * This function allows the user to stop sending local audio and video streams and end the call.
     * If the user has initiated publish flow, this function must be called to stop the publish of the current stream before publishing the new stream (new streamID), otherwise the new stream publish will return a failure.
     * After stopping streaming, the developer should stop the local preview based on whether the business situation requires it.
     * Use this function to stop publishing stream of aux channel.
     * @param {ZegoPublishChannel} channel - Publish stream channel
     */
    stopPublishingStream(channel = ZegoPublishChannel.Main){
        ZegoExpressEngineImpl.getInstance().stopPublishingStream(channel);
	}

	/**
     * Sets the extra information of the stream being published (for the specified channel).
     *
     * Use this function to set the extra info of the stream, the result will be notified via the [ZegoPublisherSetStreamExtraInfoCallback].
     * The stream extra information is an extra information identifier of the stream ID. Unlike the stream ID, which cannot be modified during the publishing process, the stream extra information can be modified midway through the stream corresponding to the stream ID.
     * Developers can synchronize variable content related to stream IDs based on stream additional information.
     * @param {string} extraInfo - Stream extra information, a string of up to 1024 characters.
     * @param {ZegoPublishChannel} channel - Publish stream channel
     * @return {Promise<number>} - Set stream extra information execution result notification
     */
    setStreamExtraInfo(extraInfo, channel = ZegoPublishChannel.Main){
    	ZegoExpressEngineImpl.getInstance().setStreamExtraInfo(extraInfo, channel);
	}

	/**
     * Sets up the video configurations (for the specified channel).
     *
     * This api can be used to set the video frame rate, bit rate, video capture resolution, and video encoding output resolution. If you do not call this api, the default resolution is 360p, the bit rate is 600 kbps, and the frame rate is 15 fps.
     * It is necessary to set the relevant video configuration before publishing the stream, and only support the modification of the encoding resolution and the bit rate after publishing the stream.
     * Developers should note that the wide and high resolution of the mobile end is opposite to the wide and high resolution of the PC. For example, in the case of 360p, the resolution of the mobile end is 360x640, and the resolution of the PC end is 640x360.
     * @param {(ZegoVideoConfigPreset|ZegoVideoConfig)} config - Video configuration, the SDK provides a common setting combination of resolution, frame rate and bit rate, they also can be customized.
     * @param {ZegoPublishChannel} channel - Publish stream channel
     */
    setVideoConfig(config, channel = ZegoPublishChannel.Main){
        ZegoExpressEngineImpl.getInstance().setVideoConfig(config, channel);
    }

	/**
     * Gets the current video configurations (for the specified channel).
     *
     * This api can be used to get the specified publish channel's current video frame rate, bit rate, video capture resolution, and video encoding output resolution.
     * @param {ZegoPublishChannel} channel - Publish stream channel
     * @return {ZegoVideoConfig} - Video configuration object
     */
    getVideoConfig(channel = ZegoPublishChannel.Main){
        return ZegoExpressEngineImpl.getInstance().getVideoConfig(channel);
    }

    /**
     * Sets up the audio configurations.
     *
     * You can set the combined value of the audio codec, bit rate, and audio channel through this function. If this function is not called, the default is standard quality mode. Should be used before publishing.
     * If the preset value cannot meet the developer's scenario, the developer can set the parameters according to the business requirements.
     * @param {(ZegoAudioConfigPreset|ZegoAudioConfig)} config - Audio config
     */
    setAudioConfig(config){
        ZegoExpressEngineImpl.getInstance().setAudioConfig(config);
    }
    /**
     * Gets the current audio configurations.
     *
     * You can get the current audio codec, bit rate, and audio channel through this function.
     * @return {ZegoAudioConfig} - Audio config
     */
    getAudioConfig(){
        return ZegoExpressEngineImpl.getInstance().getAudioConfig();
    }

    /**
     * Enables or disables traffic control.
     *
     * Traffic control enables SDK to dynamically adjust the bitrate of audio and video streaming according to its own and peer current network environment status.
     * Automatically adapt to the current network environment and fluctuations, so as to ensure the smooth publishing of stream.
     * @param {boolean} enable - Whether to enable traffic control. The default is ture.
     * @param {ZegoTrafficControlProperty} property - Adjustable property of traffic control, bitmask format. Should be one or the combinations of [ZegoTrafficControlProperty] enumeration. [AdaptiveFPS] as default.
     */
    enableTrafficControl(enable, property){
        ZegoExpressEngineImpl.getInstance().enableTrafficControl(enable, property);
    }

    /**
     * Stops or resumes sending the audio part of a stream (for the specified channel).
     *
     * This function can be called when publishing the stream to realize not publishing the audio data stream. The SDK still collects and processes the audio, but does not send the audio data to the network. It can be set before and after publishing.
     * If you stop sending audio streams, the remote user that play stream of local user publishing stream can receive `Mute` status change notification by monitoring [onRemoteMicStateUpdate] callbacks,
     * @param {boolean} mute - Whether to stop sending audio streams, true means not to send audio stream, and false means sending audio stream. The default is false.
     * @param {ZegoPublishChannel} channel - Publish stream channel
     */
    mutePublishStreamAudio(mute, channel = ZegoPublishChannel.Main){
        ZegoExpressEngineImpl.getInstance().mutePublishStreamAudio(mute, channel);
    }
    /**
     * Stops or resumes sending the video part of a stream (for the specified channel).
     *
     * This function can be called when publishing the stream to realize not publishing the video stream. The local camera can still work normally, can capture, preview and process video images normally, but does not send the video data to the network. It can be set before and after publishing.
     * If you stop sending video streams locally, the remote user that play stream of local user publishing stream can receive `Mute` status change notification by monitoring [onRemoteCameraStateUpdate] callbacks,
     * @param {boolean} mute - Whether to stop sending video streams, true means not to send video stream, and false means sending video stream. The default is false.
     * @param {ZegoPublishChannel} channel - Publish stream channel
     */
    mutePublishStreamVideo(mute, channel = ZegoPublishChannel.Main){
        ZegoExpressEngineImpl.getInstance().mutePublishStreamVideo(mute, channel);
    }

	/**
     * Set audio capture stereo mode.
     *
     * This function is used to set the audio stereo capture mode. The default is mono, that is, dual channel collection is not enabled.
     * It needs to be invoked before [startPublishingStream], [startPlayingStream], [startPreview], [createMediaPlayer] and [createAudioEffectPlayer] to take effect.
     * @param {ZegoAudioCaptureStereoMode} mode - Audio stereo capture mode
     */
    setAudioCaptureStereoMode(mode){
        ZegoExpressEngineImpl.getInstance().setAudioCaptureStereoMode(mode);
    }

    /**
     * Sets the audio recording volume for stream publishing.
     *
     * This function is used to set the audio collection volume. The local user can control the volume of the audio stream sent to the far end. It can be set before publishing.
     * @param {number} volume - Volume percentage. The range is 0 to 200. Default value is 100.
     */
    setCaptureVolume(volume){
        ZegoExpressEngineImpl.getInstance().setCaptureVolume(volume);
	}
	
    /**
     * Sets the stream playback volume.
     *
     * This function is used to set the playback volume of the stream. Need to be called after calling startPlayingStream.
     * You need to reset after [stopPlayingStream] and [startPlayingStream].
     * @param {string} streamID - Stream ID. Set volume for all streams playing by set streamID as null or empty.
     * @param {number} volume - Volume percentage. The value ranges from 0 to 200, and the default value is 100.
     */
    setPlayVolume(streamID, volume){
        ZegoExpressEngineImpl.getInstance().setPlayVolume(streamID, volume);
	}
	
    /**
     * Stops or resumes playing the audio part of a stream.
     *
     * This api can be used to stop playing/retrieving the audio data of the stream. It can be called before and after playing the stream.
     * @param {string} streamID - Stream ID
     * @param {boolean} mute - mute flag, true: mute play stream video, false: resume play stream video
     */
    mutePlayStreamAudio(streamID, mute){
        ZegoExpressEngineImpl.getInstance().mutePlayStreamAudio(streamID, mute);
    }
    /**
     * Stops or resumes playing the video part of a stream.
     *
     * This function can be used to stop playing/retrieving the video data of the stream. It can be called before and after playing the stream.
     * @param {string} streamID - Stream ID
     * @param {boolean} mute - mute flag, true: mute play stream video, false: resume play stream video
     */
    mutePlayStreamVideo(streamID, mute){
        ZegoExpressEngineImpl.getInstance().mutePlayStreamVideo(streamID, mute);
    }

    /**
     * Enables or disables hardware decoding.
     *
     * Turn on hardware decoding and use hardware to improve decoding efficiency. Need to be called before calling startPlayingStream.
     * Because hard-decoded support is not particularly good for a few models, SDK uses software decoding by default. If the developer finds that the device is hot when playing a high-resolution audio and video stream during testing of some models, you can consider calling this function to enable hard decoding.
     * @param {boolean} enable - Whether to turn on hardware decoding switch, true: enable hardware decoding, false: disable hardware decoding. The default is false
     */
    enableHardwareDecoder(enable){
        ZegoExpressEngineImpl.getInstance().enableHardwareDecoder(enable);
    }
	
	/**
	 * Turns on/off the camera (for the specified channel).
	 *
	 * This function is used to control whether to start the camera acquisition. After the camera is turned off, video capture will not be performed. At this time, the publish stream will also have no video data.
	 * In the case of using a custom video capture function, because the developer has taken over the video data capturing, the SDK is no longer responsible for the video data capturing, this api is no longer valid.
	 * @param {boolean} enable - Whether to turn on the camera, true: turn on camera, false: turn off camera
	 * @param {ZegoPublishChannel} channel - Publishing stream channel
	 */
	enableCamera(enable, channel = ZegoPublishChannel.Main) {
		ZegoExpressEngineImpl.getInstance().enableCamera(enable,channel);
	}

    /** 
     * Switches to the front or the rear camera.
     *
     * This interface is used to control the front or rear camera
     * In the case of using a custom video capture function, because the developer has taken over the video data capturing, the SDK is no longer responsible for the video data capturing, this api is no longer valid.
     *
     * @param {boolean}enable Whether to use the front camera, true: use the front camera, false: use the the rear camera. The default value is true
     * @param {ZegoPublishChannel}channel Publishing stream channel
     */
	useFrontCamera(enable, channel = ZegoPublishChannel.Main) {
        ZegoExpressEngineImpl.getInstance().useFrontCamera(enable, channel);
	} 

	/**
     * Creates a media player instance.
     *
     * Currently, a maximum of 4 instances can be created, after which it will return null. The more instances of a media player, the greater the performance overhead on the device.
     * @return {ZegoMediaPlayer} - Media player instance, null will be returned when the maximum number is exceeded.
     */
	createMediaPlayer() {
		var playerMap = ZegoExpressEngineImpl.getInstance().createMediaPlayer();
		var player = new ZegoMediaPlayer(playerMap);
		return player;
	}
	
	/**
	 * Sends a Custom Command to the specified users in the same room.
	 *
	 * The frequency of custom messages sent to a single user in the same room cannot be higher than 200 messages/s, and the frequency of custom messages sent to multiple users cannot be higher than 10 messages/s.
	 * The point-to-point signaling type in the same room is generally used for remote control signaling or for sending messages between users. The messages are reliable.
	 * @param {string} roomID - Room ID, a string of up to 128 bytes in length. Only support numbers, English characters and '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '.', '<', '>', '/', '\'
	 * @param {string} command - Custom command content, no longer than 1024 bytes
	 * @param {ZegoUser[]} toUserList - The users who will receive the command
	 */
	sendCustomCommand(roomID, command, toUserList, callback) {
		ZegoExpressEngineImpl.getInstance().sendCustomCommand(roomID, command, toUserList, callback);
	}
	
}



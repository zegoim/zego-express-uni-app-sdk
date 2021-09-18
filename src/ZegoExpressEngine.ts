import {
    ZegoScenario,
    ZegoPublishChannel,
    ZegoUser,
    ZegoRoomConfig,
    ZegoVideoConfig,
    ZegoPlayerConfig,
    ZegoMediaPlayer,
    ZegoEngineConfig,
    ZegoVideoMirrorMode,
    ZegoOrientation,
    ZegoIMSendBroadcastMessageResult,
    ZegoIMSendBarrageMessageResult,
    ZegoIMSendCustomCommandResult,
    ZegoTrafficControlProperty,
    ZegoTrafficControlMinVideoBitrateMode,
    ZegoVideoStreamType,
    ZegoPublisherUpdateCdnUrlResult,
    ZegoCDNConfig,
    ZegoAECMode,
    ZegoANSMode,
    ZegoAudioRoute,
    ZegoMixerTask
} from "./ZegoExpressDefines"
import { ZegoEventListener} from './ZegoExpressEventHandler';
import {ZegoExpressEngineImpl} from './impl/ZegoExpressEngineImpl';
import { ZegoAutoMixerTask, ZegoMixerStartResult, ZegoMixerStopResult } from "index";


export default class ZegoExpressEngine {
	/**
	 * Creates a singleton instance of ZegoExpressEngine.
	 */
    static instance(): ZegoExpressEngine {
        return ZegoExpressEngineImpl.getInstance();
    }

    /**
     * Initializes the Engine.
     *
     * The engine needs to be initialized before calling other APIs
     * @param {number} appID - Application ID issued by ZEGO for developers, please apply from the ZEGO Admin Console https://console-express.zego.im/. The value ranges from 0 to 4294967295.
     * @param {string} appSign - Application signature for each AppID, please apply from the ZEGO Admin Console. Application signature is a 64 character string. Each character has a range of '0' ~ '9', 'a' ~ 'z'.
     * @param {boolean} isTestEnv - Choose to use a test environment or a formal commercial environment, the formal environment needs to submit work order configuration in the ZEGO management console. The test environment is for test development, with a limit of 30 rooms and 230 users. Official environment App is officially launched. ZEGO will provide corresponding server resources according to the configuration records submitted by the developer in the management console. The test environment and the official environment are two sets of environments and cannot be interconnected.
     * @param {ZegoScenario} scenario - The application scenario. Developers can choose one of ZegoScenario based on the scenario of the app they are developing, and the engine will preset a more general setting for specific scenarios based on the set scenario. After setting specific scenarios, developers can still call specific api to set specific parameters if they have customized parameter settings.
     * @return {ZegoExpressEngine} singleton instance of ZegoExpressEngine
     */
    static createEngine(appID: number, appSign: string, isTestEnv: boolean, scenario: ZegoScenario): Promise<ZegoExpressEngine> {
        return ZegoExpressEngineImpl.createEngine(appID, appSign, isTestEnv, scenario);
    }

    /**
     * Uninitializes the Engine.
     *
     * uninitialize engine to release the resources
     */
    static destroyEngine(): Promise<void> {
        return ZegoExpressEngineImpl.destroyEngine();
    }

    /** Sets up the advanced engine configurations.
     *
     * Developers need to call this interface to set advanced function configuration when they need advanced functions of the engine.
     *
     * @param {ZegoEngineConfig} config Advanced engine configuration
     */
     static setEngineConfig(config: ZegoEngineConfig): Promise<void> {
        return ZegoExpressEngineImpl.setEngineConfig(config);
    }

    /**
     * Register event handler
     * 
     * @param event event type 
     * @param callback callback
     */
     on<EventType extends keyof ZegoEventListener>(event: EventType, callback: ZegoEventListener[EventType]): void {
        return ZegoExpressEngineImpl.getInstance().on(event, callback);
    }

    /**
     * Unregister event handler
     * 
     * @param event event type
     * @param callback callback
     */
    off<EventType extends keyof ZegoEventListener>(event: EventType, callback?: ZegoEventListener[EventType]): void {
        return ZegoExpressEngineImpl.getInstance().off(event, callback);
    }

    /**
     * Gets the SDK's version number.
     *
     * When the SDK is running, the developer finds that it does not match the expected situation and submits the problem and related logs to the ZEGO technical staff for locating. The ZEGO technical staff may need the information of the engine version to assist in locating the problem.
     * Developers can also collect this information as the version information of the engine used by the app, so that the SDK corresponding to each version of the app on the line.
     * @return {string} - SDK version
     */
    getVersion(): Promise<string> {
        return ZegoExpressEngineImpl.getInstance().getVersion();
    }

    /**
     * Uploads logs to the ZEGO server.
     *
     * By default, SDK creates and prints log files in the app's default directory. Each log file defaults to a maximum of 5MB. Three log files are written over and over in a circular fashion. When calling this interface, SDK will auto package and upload the log files to the ZEGO server.
     * Developers can provide a business “feedback” channel in the app. When users feedback problems, they can call this interface to upload the local log information of SDK to help locate user problems.
     * The API is valid for the entire life cycle of the SDK.
     */
    uploadLog(): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().uploadLog();
    }

    /**
     * Call the RTC experimental API.
     *
     * Available since: 2.7.0
     * Description: ZEGO provides some technical previews or special customization functions in RTC business through this API. If you need to get the use of the function or the details, please consult ZEGO technical support.
     * When to call: After [createEngine].
     *
     * @param {string} params You need to pass in a parameter in the form of a JSON string, please consult ZEGO technical support for details.
     * @return {string} Returns an argument in the format of a JSON string, please consult ZEGO technical support for details.
     */
    callExperimentalAPI(params: string): Promise<string> {
        return ZegoExpressEngineImpl.getInstance().callExperimentalAPI(params);
    }

    /**
     * Set the path of the static picture would be published when the camera is closed.
     *
     * Description: Set the path of the static picture would be published when enableCamera(false) is called, it would start to publish static pictures, and when enableCamera(true) is called, it would end publishing static pictures.
     * Use case: The developer wants to display a static picture when the camera is closed. For example, when the anchor exits the background, the camera would be actively closed. At this time, the audience side needs to display the image of the anchor temporarily leaving.
     * When to call: After the engine is initialized, call this API to configure the parameters before closing the camera.
     * Restrictions: 1. Supported picture types are JPEG/JPG, PNG, BMP, HEIF. 2. The function is only for SDK video capture and does not take effect for custom video capture.
     * Caution: 1. The static picture cannot be seen in the local preview. 2. External filters, mirroring, watermarks, and snapshots are all invalid. 3. If the picture aspect ratio is inconsistent with the set code aspect ratio, it will be cropped according to the code aspect ratio.
     * Platform differences: 1. Windows: Fill in the location of the picture directly, such as "D://dir//image.jpg". 2. iOS: If it is a full path, add the prefix "file:", such as @"file:/var/image.png"; If it is a assets picture path, add the prefix "asset:", such as @"asset:watermark". 3. Android: If it is a full path, add the prefix "file:", such as "file:/sdcard/image.png"; If it is a assets directory path, add the prefix "asset:", such as "asset:watermark.png".
     *
     * @param {string} filePath Picture file path
     * @param {ZegoPublishChannel} channel Publish channel.
     */
    setDummyCaptureImagePath(filePath: string, channel?: ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().setDummyCaptureImagePath(filePath, channel);
    }

    /**
     * Logs in to a room. You must log in to a room before publishing or playing streams.
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
    loginRoom(roomID: string, user: ZegoUser, config?: ZegoRoomConfig): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().loginRoom(roomID, user, config);
    }

    /**
     * Logs out of a room.
     *
     * Exiting the room will stop all publishing and playing streams for user, and then SDK will auto stop local preview UI. After calling this interface, you will receive [onRoomStateUpdate] callback notification successfully exits the room, while other users in the same room will receive the [onRoomUserUpdate] callback notification(On the premise of enabling isUserStatusNotify configuration).
     * @param {string} roomID - Room ID, a string of up to 128 bytes in length. Only support numbers, English characters and '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '.', '<', '>', '/', '\'
     */
    logoutRoom(roomID: string): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().logoutRoom(roomID);
    }

    /**
     * Sends a Broadcast Message.
     *
     * The sending frequency of broadcast messages in the same room cannot be higher than 10 messages/s.
     * A certain number of users in the same room who entered the room earlier can receive this callback. The message is reliable. It is generally used when the number of people in the live room is less than a certain number. The specific number is determined by the configuration of the ZEGO server.
     *
     * @param {string} roomID Room ID, a string of up to 128 bytes in length. Only support numbers, English characters and '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '.', '<', '>', '/', '\'
     * @param {string} message Message content, no longer than 1024 bytes
     * @return {ZegoIMSendBroadcastMessageResult} callback Send broadcast message result callback
     */
    sendBroadcastMessage(roomID: string, message: string): Promise<ZegoIMSendBroadcastMessageResult> {
        return ZegoExpressEngineImpl.getInstance().sendBroadcastMessage(roomID, message);
    }

    /**
     * Sends a Barrage Message (bullet screen) to all users in the same room, without guaranteeing the delivery.
     *
     * The frequency of sending barrage messages in the same room cannot be higher than 20 messages/s.
     * The message is unreliable. When the frequency of sending barrage messages in the entire room is greater than 20 messages/s, the recipient may not receive the message. It is generally used in scenarios where there is a large number of messages sent and received in the room and the reliability of the messages is not required, such as live broadcast barrage.
     *
     * @param {string} roomID Room ID, a string of up to 128 bytes in length. Only support numbers, English characters and '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '.', '<', '>', '/', '\'
     * @param {string} message Message content, no longer than 1024 bytes
     * @return {ZegoIMSendBarrageMessageResult} callback Send barrage message result callback
     */
    sendBarrageMessage(roomID: string, message: string): Promise<ZegoIMSendBarrageMessageResult> {
        return ZegoExpressEngineImpl.getInstance().sendBarrageMessage(roomID, message);
    }

    /**
     * Sends a Custom Command to the specified users in the same room.
     *
     * The frequency of custom messages sent to a single user in the same room cannot be higher than 200 messages/s, and the frequency of custom messages sent to multiple users cannot be higher than 10 messages/s.
     * The point-to-point signaling type in the same room is generally used for remote control signaling or for sending messages between users. The messages are reliable.
     *
     * @param {string} roomID Room ID, a string of up to 128 bytes in length. Only support numbers, English characters and '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '.', '<', '>', '/', '\'
     * @param {string} command Custom command content, no longer than 1024 bytes
     * @param {ZegoUser[]} toUserList The users who will receive the command
     * @return {ZegoIMSendCustomCommandResult} callback Send command result callback
     */
    sendCustomCommand(roomID: string, command: string, toUserList?: ZegoUser[]): Promise<ZegoIMSendCustomCommandResult> {
        return ZegoExpressEngineImpl.getInstance().sendCustomCommand(roomID, command, toUserList);
    }

    /**
     * Starts publishing a stream (for the specified channel).
     *
     * This interface allows users to publish their local audio and video streams to the ZEGO real-time audio and video cloud. Other users in the same room can use the streamID to play the audio and video streams for intercommunication.
     * Before you start to publish the stream, you need to join the room first by calling [loginRoom]. Other users in the same room can get the streamID by monitoring the [onRoomStreamUpdate] event callback after the local user publishing stream successfully.
     * In the case of poor network quality, user publish may be interrupted, and the SDK will attempt to reconnect. You can learn about the current state and error information of the stream published by monitoring the [onPublisherStateUpdate] event.
     * @param {string} streamID - Stream ID, a string of up to 256 characters, needs to be globally unique within the entire AppID. If in the same AppID, different users publish each stream and the stream ID is the same, which will cause the user to publish the stream failure. You cannot include URL keywords, otherwise publishing stream and playing stream will fails. Only support numbers, English characters and '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '.', '<', '>', '/', '\'.
     * @param {ZegoPublishChannel} channel - Publish stream channel. [Main] as default.
     */
    startPublishingStream(streamID: string, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().startPublishingStream(streamID, channel);
    }

    /**
     * Stops publishing a stream (for the specified channel).
     *
     * This interface allows the user to stop sending local audio and video streams and end the call.
     * If the user has initiated publish flow, this interface must be called to stop the publish of the current stream before publishing the new stream (new streamID), otherwise the new stream publish will return a failure.
     * After stopping streaming, the developer should stop the local preview based on whether the business situation requires it.
     * Use this API to stop publishing stream of aux channel.
     * @param {ZegoPublishChannel} channel - Publish stream channel. [Main] as default.
     */
    stopPublishingStream(channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().stopPublishingStream(channel);
    }

    /**
     * Starts/Updates the local video preview.
     *
     * The user can see his own local image by calling this interface. The preview function does not require you to log in to the room or publish the stream first. But after exiting the room, SDK internally actively stops previewing by default.
     * Local view and preview modes can be updated by calling this interface again.
     * You can set the mirror mode of the preview by calling the [setVideoMirrorMode] interface. The default preview setting is image mirrored.
     * When this api is called, the audio and video engine module inside SDK will start really, and it will start to try to collect audio and video. In addition to calling this api normally to preview the local screen, developers can also pass [null] to the canvas parameter, in conjunction with ZegoExpressEngine's sound wave function, in order to achieve the purpose of detecting whether the audio equipment is working properly before logging in to the room.
     * @param {ZegoView} view - The view used to display the preview image.
     * @param {ZegoPublishChannel} channel - Publish stream channel. [Main] as default.
     */
    startPreview(channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().startPreview(channel);
    }

    /**
     * Stops the local video preview.
     *
     * This api can be called to stop previewing when there is no need to see the preview locally.
     * @param {ZegoPublishChannel} channel - Publish stream channel. [Main] as default.
     */
    stopPreview(channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().stopPreview(channel);
    }

    /**
     * Sets up the video configurations.
     *
     * This api can be used to set the video frame rate, bit rate, video capture resolution, and video encoding output resolution. If you do not call this api, the default resolution is 360p, the bit rate is 600 kbps, and the frame rate is 15 fps.
     * It is necessary to set the relevant video configuration before publishing the stream, and only support the modification of the encoding resolution and the bit rate after publishing the stream.
     * Developers should note that the wide and high resolution of the mobile end is opposite to the wide and high resolution of the PC. For example, in the case of 360p, the resolution of the mobile end is 360x640, and the resolution of the PC end is 640x360.
     * @param {(ZegoVideoConfigPreset|ZegoVideoConfig)} config - Video configuration, the SDK provides a common setting combination of resolution, frame rate and bit rate, they also can be customized.
     * @param {ZegoPublishChannel} channel - Publish stream channel. [Main] as default.
     */
    setVideoConfig(config: ZegoVideoConfig, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().setVideoConfig(config, channel);
    }

    /**
     * Gets the current video configurations.
     *
     * This api can be used to get the specified publish channel's current video frame rate, bit rate, video capture resolution, and video encoding output resolution.
     * @param {ZegoPublishChannel} channel - Publish stream channel. [Main] as default.
     * @return {ZegoVideoConfig} - Video configuration object
     */
    getVideoConfig(channel?:ZegoPublishChannel): Promise<ZegoVideoConfig> {
        return ZegoExpressEngineImpl.getInstance().getVideoConfig(channel);
    }

    /**
     * Sets the video mirroring mode.
     *
     * This interface can be called to set whether the local preview video and the published video have mirror mode enabled.
     * 
     * @param {ZegoVideoMirrorMode} mirrorMode - Mirror mode for previewing or publishing the stream
     * @param {ZegoPublishChannel} channel - Publish stream channel. [Main] as default.
     */
    setVideoMirrorMode(mode: ZegoVideoMirrorMode, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().setVideoMirrorMode(mode, channel);
    }

    /** Sets the video orientation.
     *
     * This interface sets the orientation of the video. After rotation, it will be automatically adjusted to adapt the encoded image resolution.
     *
     * @param orientation Video orientation
     * @param channel Publish stream channel. [Main] as default.
     */
     setAppOrientation(orientation: ZegoOrientation, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().setAppOrientation(orientation, channel);
    }
    
    /**
     * Stops or resumes sending the audio part of a stream.
     *
     * This interface can be called when publishing the stream to publish only the video stream without publishing the audio. The SDK still collects and processes the audio, but does not send the audio data to the network. It can be set before publishing.
     * If you stop sending audio streams, the remote user that play stream of local user publishing stream can receive `Mute` status change notification by monitoring [onRemoteMicStateUpdate] callbacks,
     * @param {boolean} mute - Whether to stop sending audio streams, true means that only the video stream is sent without sending the audio stream, and false means that the audio and video streams are sent simultaneously. The default is false.
     * @param {ZegoPublishChannel} channel - Publish stream channel. [Main] as default.
     */
    mutePublishStreamAudio(mute: boolean, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().mutePublishStreamAudio(mute, channel);
    }

    /**
     * Stops or resumes sending the video part of a stream.
     *
     * When publishing the stream, this interface can be called to publish only the audio stream without publishing the video stream. The local camera can still work normally, and can normally capture, preview and process the video picture, but does not send the video data to the network. It can be set before publishing.
     * If you stop sending video streams locally, the remote user that play stream of local user publishing stream can receive `Mute` status change notification by monitoring [onRemoteCameraStateUpdate] callbacks,
     * @param {boolean} mute - Whether to stop sending video streams, true means that only the audio stream is sent without sending the video stream, and false means that the audio and video streams are sent at the same time. The default is false.
     * @param {ZegoPublishChannel} channel - Publish stream channel. [Main] as default.
     */
    mutePublishStreamVideo(mute: boolean, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().mutePublishStreamVideo(mute, channel);
    }
	
    /**
     * Enables or disables traffic control.
     * 
     * Traffic control enables SDK to dynamically adjust the bitrate of audio and video streaming according to its own and peer current network environment status.
     * Automatically adapt to the current network environment and fluctuations, so as to ensure the smooth publishing of stream.
     * @param {boolean} enable - Whether to enable traffic control. The default is ture.
     * @param {ZegoTrafficControlProperty} property - Adjustable property of traffic control, bitmask format. Should be one or the combinations of [ZegoTrafficControlProperty] enumeration. [AdaptiveFPS] as default.
     * @param {ZegoPublishChannel} channel - Publish stream channel. [Main] as default.
     */
	enableTrafficControl(enable: boolean, property: ZegoTrafficControlProperty, channel?:ZegoPublishChannel): Promise<void> {
	    return ZegoExpressEngineImpl.getInstance().enableTrafficControl(enable, property, channel);
	}
	
    /**
     * Sets the minimum video bitrate for traffic control.
     * 
     * Set how should SDK send video data when the network conditions are poor and the minimum video bitrate cannot be met.
     * When this function is not called, the SDK will automatically adjust the sent video data frames according to the current network uplink conditions by default.
     * @param {number} bitrate Minimum video bitrate (kbps)
     * @param {ZegoTrafficControlMinVideoBitrateMode} mode Video sending mode below the minimum bitrate.
     * @param {ZegoPublishChannel} channel Publish stream channel. [Main] as default.
     */
	setMinVideoBitrateForTrafficControl(bitrate: number, mode: ZegoTrafficControlMinVideoBitrateMode, channel?:ZegoPublishChannel): Promise<void> {
	    return ZegoExpressEngineImpl.getInstance().setMinVideoBitrateForTrafficControl(bitrate, mode, channel);
	}

    /**
     * Sets the audio recording volume for stream publishing.
     *
     * This interface is used to set the audio collection volume. The local user can control the volume of the audio stream sent to the far end. It can be set before publishing.
     * @param {number} volume - Volume percentage. The range is 0 to 100. Default value is 100.
     */
    setCaptureVolume(volume: number): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().setCaptureVolume(volume);
    }

    /**
     * Enables or disables hardware encoding.
     *
     * Whether to use the hardware encoding function when publishing the stream, the GPU is used to encode the stream and to reduce the CPU usage. The setting can take effect before the stream published. If it is set after the stream published, the stream should be stopped first before it takes effect.
     * Because hard-coded support is not particularly good for a few models, SDK uses software encoding by default. If the developer finds that the device is hot when publishing a high-resolution audio and video stream during testing of some models, you can consider calling this interface to enable hard coding.
     * @param {boolean} enable - Whether to enable hardware encoding, true: enable hardware encoding, false: disable hardware encoding
     */
    enableHardwareEncoder(enable: boolean): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().enableHardwareEncoder(enable);
    }

    /**
     * Adds a target CDN URL to which the stream will be relayed from ZEGO RTC server.
     * 
     * Developers can call this function to publish the audio and video streams that have been published to the ZEGO RTC server to a custom CDN content distribution network that has high latency but supports high concurrent playing stream.
     * Because this called function is essentially a dynamic relay of the audio and video streams published to the ZEGO RTC server to different CDNs, this function needs to be called after the audio and video stream is published to ZEGO RTC server successfully.
     * Since ZEGO RTC server itself can be configured to support CDN(content distribution networks), this function is mainly used by developers who have CDN content distribution services themselves.
     * You can use ZEGO's CDN audio and video streaming content distribution service at the same time by calling this function and then use the developer who owns the CDN content distribution service.
     * This function supports dynamic relay to the CDN content distribution network, so developers can use this function as a disaster recovery solution for CDN content distribution services.
     * When the {enablePublishDirectToCDN] function is set to true to publish the stream straight to the CDN, then calling this function will have no effect.
     * 
     * @param targetURL CDN relay address, supported address format is rtmp.
     * @param streamID Stream ID
     * @returns The execution result of update the relay CDN operation
     */
    addPublishCdnUrl(targetURL: string, streamID: string): Promise<ZegoPublisherUpdateCdnUrlResult> {
        return ZegoExpressEngineImpl.getInstance().addPublishCdnUrl(targetURL, streamID);
    }

    /**
     * Deletes the specified CDN URL, which is used for relaying streams from ZEGO RTC server to CDN.
     * 
     * This function is called when a CDN relayed address has been added and needs to stop propagating the stream to the CDN.
     * This function does not stop publishing audio and video stream to the ZEGO ZEGO RTC server.
     * 
     * @param targetURL Stream ID
     * @param streamID CDN relay address, supported address format rtmp.
     * @returns The execution result of update the relay CDN operation
     */
    removePublishCdnUrl(targetURL: string, streamID: string): Promise<ZegoPublisherUpdateCdnUrlResult> {
        return ZegoExpressEngineImpl.getInstance().removePublishCdnUrl(targetURL, streamID);
    }

    /**
     * Whether to publish streams directly from the client to CDN without passing through Zego RTC server.
     * 
     * This function needs to be set before [startPublishingStream].
     * After calling this function to publish the audio and video stream directly to the CDN, calling [addPublishCdnUrl] and [removePublishCdnUrl] to dynamically relay to the CDN no longer takes effect,
     * because these two functions are to relay or stop relaying the audio and video stream from ZEGO RTC server to CDN,
     * if you enable the direct publish of audio and video streams to CDN, you will not be able to dynamically relay the audio and video streams to the CDN through the ZEGO RTC server.
     * 
     * @param enable Whether to enable direct publish CDN, true: enable direct publish CDN, false: disable direct publish CDN
     * @param config CDN configuration, if null, use Zego's background default configuration
     * @param channel Publish stream channel
     */
    enablePublishDirectToCDN(enable: boolean, config: ZegoCDNConfig, channel = ZegoPublishChannel.Main): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().enablePublishDirectToCDN(enable, config, channel);
    }

    /**
     * Starts playing a stream from ZEGO's streaming cloud or from third-party CDN.
     *
     * This interface allows users to play audio and video streams both from the ZEGO real-time audio and video cloud and from third-party cdn.
     * Before starting to play the stream, you need to join the room first, you can get the new streamID in the room by listening to the [onRoomStreamUpdate] event callback.
     * In the case of poor network quality, user play may be interrupted, the SDK will try to reconnect, and the current play status and error information can be obtained by listening to the [onPlayerStateUpdate] event.
     * Playing the stream ID that does not exist, the SDK continues to try to play after executing this interface. After the stream ID is successfully published, the audio and video stream can be actually played.
     * The developer can update the player canvas by calling this interface again (the streamID must be the same).
     * @param {string} streamID - Stream ID, a string of up to 256 characters. You cannot include URL keywords, otherwise publishing stream and playing stream will fails. Only support numbers, English characters and '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '.', '<', '>', '/', '\'.
     * @param {ZegoView} view - The view used to display the preview image.
     * @param {ZegoPlayerConfig} config - Advanced player configuration
     */
    startPlayingStream(streamID: string, config?: ZegoPlayerConfig): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().startPlayingStream(streamID, config);
    }

    /**
     * Stops playing a stream.
     *
     * This interface allows the user to stop playing the stream. When stopped, the attributes set for this stream previously, such as [setPlayVolume], [mutePlayStreamAudio], [mutePlayStreamVideo], etc., will be invalid and need to be reset when playing the the stream next time.
     * @param {string} streamID - Stream ID
     */
    stopPlayingStream(streamID: string): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().stopPlayingStream(streamID);
    }

    /**
     * Sets the stream playback volume.
     *
     * This interface is used to set the playback volume of the stream. Need to be called after calling startPlayingStream.
     * You need to reset after [stopPlayingStream] and [startPlayingStream].
     * @param {string} streamID - Stream ID
     * @param {number} volume - Volume percentage. The value ranges from 0 to 100, and the default value is 100.
     */
    setPlayVolume(volume: number): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().setPlayVolume(volume);
    }

    /**
     * Set play video stream type
     * 
     * When the publish stream sets the codecID to SVC through [setVideoConfig], the puller can dynamically set and select different stream types (small resolution is one-half of the standard layer).
     * In general, when the network is weak or the rendered UI window is small, you can choose to pull videos with small resolutions to save bandwidth.
     * It can be set before and after pulling the stream.
     * 
     * @param streamType Video stream type
     * @param streamID Stream ID.
     */
    setPlayStreamVideoType(streamID: string, streamType: ZegoVideoStreamType): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().setPlayStreamVideoType(streamID, streamType);
    }

    /**
     * Stops or resumes playing the audio part of a stream.
     *
     * This api can be used to stop playing/retrieving the audio data of the stream. Need to be called after calling startPlayingStream.
     * This api is only effective for playing stream from ZEGO real-time audio and video cloud (not ZEGO CDN or third-party CDN).
     * @param {string} streamID - Stream ID
     * @param {boolean} mute - mute flag, true: mute play stream video, false: resume play stream video
     */
    mutePlayStreamAudio(streamID: string, mute: boolean): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().mutePlayStreamAudio(streamID, mute);
    }

    /**
     * Stops or resumes playing the video part of a stream.
     *
     * This interface can be used to stop playing/retrieving the video data of the stream. Need to be called after calling startPlayingStream.
     * This api is only effective for playing stream from ZEGO real-time audio and video cloud (not ZEGO CDN or third-party CDN).
     * @param {string} streamID - Stream ID
     * @param {boolean} mute - mute flag, true: mute play stream video, false: resume play stream video
     */
    mutePlayStreamVideo(streamID: string, mute: boolean): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().mutePlayStreamVideo(streamID, mute);
    }

    /**
     * Enables or disables hardware decoding.
     *
     * Turn on hardware decoding and use hardware to improve decoding efficiency. Need to be called before calling startPlayingStream.
     * Because hard-decoded support is not particularly good for a few models, SDK uses software decoding by default. If the developer finds that the device is hot when playing a high-resolution audio and video stream during testing of some models, you can consider calling this interface to enable hard decoding.
     * @param {boolean} enable - Whether to turn on hardware decoding switch, true: enable hardware decoding, false: disable hardware decoding. The default is false
     */
    enableHardwareDecoder(enable: boolean): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().enableHardwareDecoder(enable);
    }

    /**
     * Starts a stream mixing task.
     *
     * Description: Initiate a mixing stream request to the ZEGO RTC server, the server will look for the stream currently being pushed, and mix the layers according to the parameters of the mixing stream task requested by the SDK. When you need to update a mixing task, that is, when the input stream increases or decreases, you need to update the input stream list. At this time, you can update the field of the [ZegoMixerTask] object inputList and call this function again to pass in the same [ZegoMixerTask] object to update the mixing task.
     * Use cases: It is often used when multiple video images are required to synthesize a video using mixed streaming, such as education, live broadcast of teacher and student images.
     * When to call: After calling [loginRoom] to log in to the room.
     * Restrictions: None.
     * Caution: Due to the performance considerations of the client device, the SDK muxing is to start the mixing task on the ZEGO RTC server for mixing. If an exception occurs when the mixing task is requested to start, for example, the most common mixing input stream does not exist, the error code will be given from the callback callback. For specific error codes, please refer to the common error code document https://doc-zh.zego.im/zh/4378.html. If a certain input stream does not exist in the middle, the muxing task will automatically retry to pull this input stream for 90 seconds, and will not retry after 90 seconds. If all input streams no longer exist, the server will automatically stop the mixing task after 90 seconds.
     * Related callbacks: [OnMixerRelayCDNStateUpdate] can be used to obtain the CDN status update notification of the mixed stream repost, and the sound update notification of each single stream in the mixed stream can be obtained through [onMixerSoundLevelUpdate].
     * Related APIs: the mixing task can be stopped by the [stopMixerTask] function.
     *
     * @param {ZegoMixerTask} task Mixing task object. Required: Yes.
     * @return {ZegoMixerStartResult} Start notification of mixing task results.Required: No. Caution: Passing [null] means not receiving callback notifications.
     */
    startMixerTask(task: ZegoMixerTask): Promise<ZegoMixerStartResult> {
        return ZegoExpressEngineImpl.getInstance().startMixerTask(task);
    }

    /**
     * Stops a stream mixing task.
     *
     * Description: Initiate a request to end the mixing task to the ZEGO RTC server.
     * Use cases: It is often used when multiple video images are required to synthesize a video using mixed streaming, such as education, live broadcast of teacher and student images.
     * When to call: After calling [startMixerTask] to start mixing.
     * Restrictions: None.
     * Caution: If the developer starts the next mixing task without stopping the previous mixing task, the previous mixing task will not automatically stop until the input stream of the previous mixing task does not exist for 90 seconds. Before starting the next mixing task, you should stop the previous mixing task, so that when an anchor has already started the next mixing task to mix with other anchors, the audience is still pulling the output stream of the previous mixing task.
     * Related APIs: You can start mixing by using the [startMixerTask] function.
     *
     * @param {ZegoMixerTask} task Mixing task object. Required: Yes.
     * @return {ZegoMixerStopResult} Stop stream mixing task result callback notification.Required: No. Caution: Passing [null] means not receiving callback notifications.
     */
    stopMixerTask(task: ZegoMixerTask): Promise<ZegoMixerStopResult> {
        return ZegoExpressEngineImpl.getInstance().stopMixerTask(task);
    }

    /**
     * Mutes or unmutes the microphone.
     *
     * This api is used to control whether the collected audio data is used. When the microphone is muted (disabled), the data is collected and discarded, and the microphone is still occupied.
     * The microphone is still occupied because closing or opening the microphone on the hardware is a relatively heavy operation, and real users may have frequent operations. For trade-off reasons, this api simply discards the collected data.
     * If you really want SDK to give up occupy the microphone, you can call the [enableAudioCaptureDevice] interface.
     * Developers who want to control whether to use microphone on the UI should use this interface to avoid unnecessary performance overhead by using the [enableAudioCaptureDevice].
     * @param {boolean} mute - Whether to mute (disable) the microphone, true: mute (disable) microphone, false: enable microphone. The default is false.
     */
    muteMicrophone(mute: boolean): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().muteMicrophone(mute);
    }

    /**
     * Checks whether the microphone is muted.
     *
     * Can be used with [muteMicrophone], determine whether the microphone is muted.
     * @return {boolean} - Whether the microphone is muted; true: the microphone is muted; false: the microphone is enable (not muted)
     */
    isMicrophoneMuted(): Promise<boolean> {
        return ZegoExpressEngineImpl.getInstance().isMicrophoneMuted();
    }

    /**
     * Mutes or unmutes the audio output speaker.
     *
     * After mute speaker, all the SDK sounds will not play, including playing stream, mediaplayer, etc. But the SDK will still occupy the output device.
     * @param {boolean} mute - Whether to mute (disable) speaker audio output, true: mute (disable) speaker audio output, false: enable speaker audio output. The default value is false
     */
    muteSpeaker(mute: boolean): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().muteSpeaker(mute);
    }

    /**
     * Checks whether the audio output speaker is muted.
     *
     * Can be used with [muteSpeaker], determine whether the speaker audio output is muted.
     * @return {boolean} - Whether the speaker is muted; true: the speaker is muted; false: the speaker is enable (not muted)
     */
    isSpeakerMuted(): Promise<boolean> {
        return ZegoExpressEngineImpl.getInstance().isSpeakerMuted();
    }

    /**
     * Enables or disables the audio capture device.
     *
     * This api is used to control whether to release the audio collection device. When the audio collection device is turned off, the SDK will no longer occupy the audio device. Of course, if the stream is being published at this time, there is no audio data.
     * Occupying the audio capture device and giving up Occupying the audio device is a relatively heavy operation, and the [muteMicrophone] interface is generally recommended.
     * @param {boolean} enable - Whether to enable the audio capture device, true: disable audio capture device, false: enable audio capture device
     */
    enableAudioCaptureDevice(enable: boolean): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().enableAudioCaptureDevice(enable);
    }

    /**
     * Turns on/off the camera (for the specified channel).
     *
     * This interface is used to control whether to start the camera acquisition. After the camera is turned off, video capture will not be performed. At this time, the publish stream will also have no video data.
     * In the case of using a custom video capture function, because the developer has taken over the video data capturing, the SDK is no longer responsible for the video data capturing, this api is no longer valid.
     * @param {boolean} enable - Whether to turn on the camera, true: turn on camera, false: turn off camera
     * @param {ZegoPublishChannel} channel - Publishing stream channel
     */
    enableCamera(enable: boolean, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().enableCamera(enable, channel);
    }

    /** 
     * Switches to the front or the rear camera.
     *
     * This interface is used to control the front or rear camera
     * In the case of using a custom video capture function, because the developer has taken over the video data capturing, the SDK is no longer responsible for the video data capturing, this api is no longer valid.
     *
     * @param enable Whether to use the front camera, true: use the front camera, false: use the the rear camera. The default value is true
     * @param channel Publishing stream channel
     */
    useFrontCamera(enable: boolean, channel?:ZegoPublishChannel): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().useFrontCamera(enable, channel);
    }    

    /**
     * Enables or disables acoustic echo cancellation (AEC).
     * 
     * Turning on echo cancellation, the SDK filters the collected audio data to reduce the echo component in the audio.
     * It needs to be invoked before [startPublishingStream], [startPlayingStream], [startPreview], [createMediaPlayer] and [createAudioEffectPlayer] to take effect.
     * 
     * @param enable Whether to enable echo cancellation, true: enable, false: disable
     */
    enableAEC(enable: boolean): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().enableAEC(enable);
    }

    /**
     * Sets the acoustic echo cancellation (AEC) mode.
     * 
     * Switch different echo cancellation modes to control the extent to which echo data is eliminated.
     * It needs to be invoked before [startPublishingStream], [startPlayingStream], [startPreview], [createMediaPlayer] and [createAudioEffectPlayer] to take effect.
     * 
     * @param mode Echo cancellation mode
     */
    setAECMode(mode: ZegoAECMode): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().setAECMode(mode);
    }

    /**
     * Enables or disables automatic gain control (AGC).
     * 
     * When the auto gain is turned on, the sound will be amplified, but it will affect the sound quality to some extent.
     * It needs to be invoked before [startPublishingStream], [startPlayingStream], [startPreview], [createMediaPlayer] and [createAudioEffectPlayer] to take effect.
     * 
     * @param enable Whether to enable automatic gain control, true: enable, false: disable
     */
    enableAGC(enable: boolean): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().enableAGC(enable);
    }

    /**
     * Enables or disables active noise suppression (ANS, aka ANC).
     * 
     * Turning on the noise suppression switch can reduce the noise in the audio data and make the human voice clearer.
     * It needs to be invoked before [startPublishingStream], [startPlayingStream], [startPreview], [createMediaPlayer] and [createAudioEffectPlayer] to take effect.
     * 
     * @param enable Whether to enable noise suppression, true: enable, false: disable
     */
    enableANS(enable: boolean): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().enableANS(enable);
    }

    /**
     * Enables or disables transient noise suppression.
     * 
     * Suppress transient noises such as keyboard and desk knocks
     * It needs to be invoked before [startPublishingStream], [startPlayingStream], [startPreview], [createMediaPlayer] and [createAudioEffectPlayer] to take effect.
     * 
     * @param enable Whether to enable transient noise suppression, true: enable, false: disable
     */
    enableTransientANS(enable: boolean): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().enableTransientANS(enable);
    }

    /**
     * Sets the automatic noise suppression (ANS) mode.
     * 
     * Default is medium mode
     * It needs to be invoked before [startPublishingStream], [startPlayingStream], [startPreview], [createMediaPlayer] and [createAudioEffectPlayer] to take effect.
     * 
     * @param mode Audio Noise Suppression mode
     */
    setANSMode(mode: ZegoANSMode): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().setANSMode(mode);
    }

    /**
     * Enables or disables headphone monitoring.
     * 
     * enable/disable headphone monitor, this setting takes effect when the headset is connected.
     * 
     * @param enable Whether to use headphone monitor, YES: enable, NO: disable
     */
    enableHeadphoneMonitor(enable: boolean): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().enableHeadphoneMonitor(enable);
    }

    /**
     * Sets the headphone monitor volume.
     * 
     * set headphone monitor volume, this setting takes effect when the headset is connected.
     * 
     * @param volume headphone monitor volume, range from 0 to 200, 100 as default
     */
    setHeadphoneMonitorVolume(volume: number): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().setHeadphoneMonitorVolume(volume);
    }

    /**
     * Whether to turn on acoustic echo cancellation (AEC) when using the headphone.
     * 
     * It needs to be invoked before [startPublishingStream], [startPlayingStream], [startPreview], [createMediaPlayer] and [createAudioEffectPlayer] to take effect.
     * 
     * @param enable Whether to enable, [YES]: enable, [NO]: disable
     */
    enableHeadphoneAEC(enable: boolean): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().enableHeadphoneAEC(enable);
    }

    /**
     * Whether to use the built-in speaker to play audio.
     *
     * When you choose not to use the built-in speaker to play sound, that is, set to [false], the SDK will select the currently highest priority audio output device to play the sound according to the system schedule
     *
     * @param defaultToSpeaker Whether to use the built-in speaker to play sound, true: use the built-in speaker to play sound, false: use the highest priority audio output device scheduled by the current system to play sound
     */
    setAudioRouteToSpeaker(defaultToSpeaker: boolean): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().setAudioRouteToSpeaker(defaultToSpeaker);
    }

    /**
     * Get current audio route type
     * 
     * @return {ZegoAudioRoute} Audio route
     */

    getAudioRouteType(): Promise<ZegoAudioRoute> {
        return ZegoExpressEngineImpl.getInstance().getAudioRouteType();
    }

    /**
     * Creates a media player instance.
     *
     * Currently, a maximum of 4 instances can be created, after which it will return null. The more instances of a media player, the greater the performance overhead on the device.
     * @return {ZegoMediaPlayer} - Media player instance, null will be returned when the maximum number is exceeded.
     */
    createMediaPlayer(): Promise<ZegoMediaPlayer|undefined> {
        return ZegoExpressEngineImpl.getInstance().createMediaPlayer();
    }

    /**
     * Destroys a media player instance.
     *
     * @param {ZegoMediaPlayer} mediaPlayer - The media player instance object to be destroyed
     */
    destroyMediaPlayer(mediaPlayer: ZegoMediaPlayer): Promise<void> {
        return ZegoExpressEngineImpl.getInstance().destroyMediaPlayer(mediaPlayer);
    }

}
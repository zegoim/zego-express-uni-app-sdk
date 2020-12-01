
/**
 * Application scenario.
 * @enum {number}
 */
const ZegoScenario =
{
    /** 
     * @description General scenario
     */
    General: 0,
    /** 
     * @description Communication scenario
     */
    Communication: 1,
    /** 
     * @description Live scenario
     */
    Live: 2,
}

/**
 * Orientation.
 * @enum {number}
 */
const ZegoOrientation = {
    PortraitUp: 1,
    PortraitDown: 2,
    LandscapeLeft: 3,
    LandscapeRight: 4,
}

/**
 * Language.
 * @enum {number}
 */
const ZegoLanguage = {
    /** 
     * @description English
     */
    English: 0,
    /** 
     * @description Chinese
     */
    Chinese: 1,
}

/**
 * engine state.
 * @enum {number}
 */
const ZegoEngineState =
{
    /** 
     * @description The engine has started
     */
    Start: 0,
    /** 
     * @description The engine has stoped
     */
    Stop: 1,
}

/**
 * Room state.
 * @enum {number}
 */
const ZegoRoomState =
{
    /** 
     * @description Unconnected state, enter this state before logging in and after exiting the room. If there is a steady state abnormality in the process of logging in to the room, such as AppID and AppSign are incorrect, or if the same user name is logged in elsewhere and the local end is KickOut, it will enter this state.
     */
    Disconnected: 0,
    /** 
     * @description The state that the connection is being requested. It will enter this state after successful execution login room function. The display of the UI is usually performed using this state. If the connection is interrupted due to poor network quality, the SDK will perform an internal retry and will return to the requesting connection status.
     */
    Connecting: 1,
    /** 
     * @description The status that is successfully connected. Entering this status indicates that the login to the room has been successful. The user can receive the callback notification of the user and the stream information in the room.
     */
    Connected: 2,
}

/**
 * Publish channel.
 * @enum {number}
 */
const ZegoPublishChannel =
{
    /** 
     * @description Main publish channel
     */
    Main: 0,
    /** 
     * @description Auxiliary publish channel
     */
    Aux: 1,
}

/**
 * Video rendering fill mode.
 * @enum {number}
 */
const ZegoViewMode =
{
    /** 
     * @description The proportional scaling up, there may be black borders
     */
    AspectFit: 0,
    /** 
     * @description The proportional zoom fills the entire View and may be partially cut
     */
    AspectFill: 1,
    /** 
     * @description Fill the entire view, the image may be stretched
     */
    ScaleToFill: 2,
}

/**
 * Mirror mode for previewing or playing the  of the stream.
 * @enum {number}
 */
const ZegoVideoMirrorMode =
{
    /** 
     * @description The mirror image only for previewing locally. This mode is used by default.
     */
    OnlyPreviewMirror: 0,
    /** 
     * @description Both the video previewed locally and the far end playing the stream will see mirror image.
     */
    BothMirror: 1,
    /** 
     * @description Both the video previewed locally and the far end playing the stream will not see mirror image.
     */
    NoMirror: 2,
    /** 
     * @description The mirror image only for far end playing the stream.
     */
    OnlyPublishMirror: 3,
}

/**
 * Publish stream status.
 * @enum {number}
 */
const ZegoPublisherState =
{
    /** 
     * @description The state is not published, and it is in this state before publishing the stream. If a steady-state exception occurs in the publish process, such as AppID and AppSign are incorrect, or if other users are already publishing the stream, there will be a failure and enter this state.
     */
    NoPublish: 0,
    /** 
     * @description The state that it is requesting to publish the stream after the [startPublishingStream] function is successfully called. The UI is usually displayed through this state. If the connection is interrupted due to poor network quality, the SDK will perform an internal retry and will return to the requesting state.
     */
    PublishRequesting: 1,
    /** 
     * @description The state that the stream is being published, entering the state indicates that the stream has been successfully published, and the user can communicate normally.
     */
    Publishing: 2,
}

/**
 * Voice changer preset value.
 * @enum {number}
 */
const ZegoVoiceChangerPreset =
{
    /** 
     * @description No Voice changer
     */
    None: 0,
    /** 
     * @description Male to child voice (loli voice effect)
     */
    MenToChild: 1,
    /** 
     * @description Male to female voice (kindergarten voice effect)
     */
    MenToWomen: 2,
    /** 
     * @description Female to child voice
     */
    WomenToChild: 3,
    /** 
     * @description Female to male voice
     */
    WomenToMen: 4,
    /** 
     * @description Foreigner voice effect
     */
    Foreigner: 5,
    /** 
     * @description Autobot Optimus Prime voice effect
     */
    OptimusPrime: 6,
    /** 
     * @description Android robot voice effect
     */
    Android: 7,
    /** 
     * @description Ethereal voice effect
     */
    Ethereal: 8,
}

/**
 * Reverberation preset value.
 * @enum {number}
 */
const ZegoReverbPreset =
{
    /** 
     * @description No Reverberation
     */
    None: 0,
    /** 
     * @description Soft room reverb effect
     */
    SoftRoom: 1,
    /** 
     * @description Large room reverb effect
     */
    LargeRoom: 2,
    /** 
     * @description Concer hall reverb effect
     */
    ConcerHall: 3,
    /** 
     * @description Valley reverb effect
     */
    Valley: 4,
}

/**
 * Video configuration resolution and bitrate preset enumeration. The preset resolutions are adapted for mobile and desktop. On mobile, height is longer than width, and desktop is the opposite. For example, 1080p is actually 1080(w) x 1920(h) on mobile and 1920(w) x 1080(h) on desktop.
 * @enum {number}
 */
const ZegoVideoConfigPreset =
{
    /** 
     * @description Set the resolution to 320x180, the default is 15 fps, the code rate is 300 kbps
     */
    Preset180P: 0,
    /** 
     * @description Set the resolution to 480x270, the default is 15 fps, the code rate is 400 kbps
     */
    Preset270P: 1,
    /** 
     * @description Set the resolution to 640x360, the default is 15 fps, the code rate is 600 kbps
     */
    Preset360P: 2,
    /** 
     * @description Set the resolution to 960x540, the default is 15 fps, the code rate is 1200 kbps
     */
    Preset540P: 3,
    /** 
     * @description Set the resolution to 1280x720, the default is 15 fps, the code rate is 1500 kbps
     */
    Preset720P: 4,
    /** 
     * @description Set the resolution to 1920x1080, the default is 15 fps, the code rate is 3000 kbps
     */
    Preset1080P: 5,
}

/**
 * Stream quality level.
 * @enum {number}
 */
const ZegoStreamQualityLevel =
{
    /** 
     * @description Excellent
     */
    Excellent: 0,
    /** 
     * @description Good
     */
    Good: 1,
    /** 
     * @description Normal
     */
    Medium: 2,
    /** 
     * @description Bad
     */
    Bad: 3,
    /** 
     * @description Failed
     */
    Die: 4,
}

/**
 * Audio channel type.
 * @enum {number}
 */
const ZegoAudioChannel =
{
    /** 
     * @description Unknown
     */
    Unknown: 0,
    /** 
     * @description Mono
     */
    Mono: 1,
    /** 
     * @description Stereo
     */
    Stereo: 2,
}

/**
 * Audio capture stereo mode.
 * @enum {number}
 */
const ZegoAudioCaptureStereoMode =
{
    /** 
     * @description Disable capture stereo, i.e. capture mono
     */
    None: 0,
    /** 
     * @description Always enable capture stereo
     */
    Always: 1,
    /** 
     * @description Adaptive mode, capture stereo when publishing stream only, capture mono when publishing and playing stream (e.g. talk/intercom scenes)
     */
    Adaptive: 2,
}

/**
 * Audio Codec ID.
 * @enum {number}
 */
const ZegoAudioCodecID =
{
    /** 
     * @description default
     */
    Default: 0,
    /** 
     * @description Normal
     */
    Normal: 1,
    /** 
     * @description Normal2
     */
    Normal2: 2,
    /** 
     * @description Normal3
     */
    Normal3: 3,
    /** 
     * @description Low
     */
    Low: 4,
    /** 
     * @description Low2
     */
    Low2: 5,
    /** 
     * @description Low3
     */
    Low3: 6,
}

/**
 * Video codec ID.
 * @enum {number}
 */
const ZegoVideoCodecID =
{
    /** 
     * @description Default (H.264)
     */
    Default: 0,
    /** 
     * @description Scalable Video Coding (H.264 SVC)
     */
    SVC: 1,
    /** 
     * @description VP8
     */
    VP8: 2,
}

/**
 * Player video layer.
 * @enum {number}
 */
const ZegoPlayerVideoLayer =
{
    /** 
     * @description The layer to be played depends on the network status
     */
    Auto: 0,
    /** 
     * @description Play the base layer (small resolution)
     */
    Base: 1,
    /** 
     * @description Play the extend layer (big resolution)
     */
    BaseExtend: 2,
}

/**
 * Audio echo cancellation mode.
 * @enum {number}
 */
const ZegoAECMode =
{
    /** 
     * @description Aggressive echo cancellation may affect the sound quality slightly, but the echo will be very clean
     */
    Aggressive: 0,
    /** 
     * @description Moderate echo cancellation, which may slightly affect a little bit of sound, but the residual echo will be less
     */
    Medium: 1,
    /** 
     * @description Comfortable echo cancellation, that is, echo cancellation does not affect the sound quality of the sound, and sometimes there may be a little echo, but it will not affect the normal listening.
     */
    Soft: 2,
}

/**
 * Active Noise Suppression mode.
 * @enum {number}
 */
const ZegoANSMode =
{
    /** 
     * @description Soft ANS
     */
    Soft: 0,
    /** 
     * @description Medium ANS
     */
    Medium: 1,
    /** 
     * @description Aggressive ANS
     */
    Aggressive: 2,
}

/**
 * Traffic control property (bitmask enumeration).
 * @enum {number}
 */
const ZegoTrafficControlProperty =
{
    /** 
     * @description Basic
     */
    Basic: 0,
    /** 
     * @description Adaptive FPS
     */
    AdaptiveFPS: 1,
    /** 
     * @description Adaptive resolution
     */
    AdaptiveResolution: 1 << 1,
    /** 
     * @description Adaptive Audio bitrate
     */
    AdaptiveAudioBitrate: 1 << 2,
}

/**
 * Video transmission mode when current bitrate is lower than the set minimum bitrate.
 * @enum {number}
 */
const ZegoTrafficControlMinVideoBitrateMode =
{
    /** 
     * @description Stop video transmission when current bitrate is lower than the set minimum bitrate
     */
    NoVideo: 0,
    /** 
     * @description Video is sent at a very low frequency (no more than 2fps) which is lower than the set minimum bitrate
     */
    UltraLowFPS: 1,
}

/**
 * Playing stream status.
 * @enum {number}
 */
const ZegoPlayerState =
{
    /** 
     * @description The state of the flow is not played, and it is in this state before the stream is played. If the steady flow anomaly occurs during the playing process, such as AppID and AppSign are incorrect, it will enter this state.
     */
    NoPlay: 0,
    /** 
     * @description The state that the stream is being requested for playing. After the [startPlayingStream] function is successfully called, it will enter the state. The UI is usually displayed through this state. If the connection is interrupted due to poor network quality, the SDK will perform an internal retry and will return to the requesting state.
     */
    PlayRequesting: 1,
    /** 
     * @description The state that the stream is being playing, entering the state indicates that the stream has been successfully played, and the user can communicate normally.
     */
    Playing: 2,
}

/**
 * Media event when playing.
 * @enum {number}
 */
const ZegoPlayerMediaEvent =
{
    /** 
     * @description Audio stuck event when playing
     */
    AudioBreakOccur: 0,
    /** 
     * @description Audio stuck event recovery when playing
     */
    AudioBreakResume: 1,
    /** 
     * @description Video stuck event when playing
     */
    VideoBreakOccur: 2,
    /** 
     * @description Video stuck event recovery when playing
     */
    VideoBreakResume: 3,
}

/**
 * Update type.
 * @enum {number}
 */
const ZegoUpdateType =
{
    /** 
     * @description Add
     */
    Add: 0,
    /** 
     * @description Delete
     */
    Delete: 1,
}

/**
 * State of CDN relay.
 * @enum {number}
 */
const ZegoStreamRelayCDNState =
{
    /** 
     * @description The state indicates that there is no CDN relay
     */
    NoRelay: 0,
    /** 
     * @description The CDN relay is being requested
     */
    RelayRequesting: 1,
    /** 
     * @description Entering this status indicates that the CDN relay has been successful
     */
    Relaying: 2,
}

/**
 * Reason for state of CDN relay changed.
 * @enum {number}
 */
const ZegoStreamRelayCDNUpdateReason =
{
    /** 
     * @description No error
     */
    None: 0,
    /** 
     * @description Server error
     */
    ServerError: 1,
    /** 
     * @description Handshake error
     */
    HandshakeFailed: 2,
    /** 
     * @description Access point error
     */
    AccessPointError: 3,
    /** 
     * @description Stream create failure
     */
    CreateStreamFailed: 4,
    /** 
     * @description Bad name
     */
    BadName: 5,
    /** 
     * @description CDN server actively disconnected
     */
    CDNServerDisconnected: 6,
    /** 
     * @description Active disconnect
     */
    Disconnected: 7,
}

/**
 * Remote device status.
 * @enum {number}
 */
const ZegoRemoteDeviceState =
{
    /** 
     * @description Device on
     */
    Open: 0,
    /** 
     * @description General device error
     */
    GenericError: 1,
    /** 
     * @description Invalid device ID
     */
    InvalidID: 2,
    /** 
     * @description No permission
     */
    NoAuthorization: 3,
    /** 
     * @description Captured frame rate is 0
     */
    ZeroFPS: 4,
    /** 
     * @description The device is occupied
     */
    InUseByOther: 5,
    /** 
     * @description The device is not plugged in or unplugged
     */
    Unplugged: 6,
    /** 
     * @description The system needs to be restarted
     */
    RebootRequired: 7,
    /** 
     * @description System media services stop, such as under the iOS platform, when the system detects that the current pressure is huge (such as playing a lot of animation), it is possible to disable all media related services.
     */
    SystemMediaServicesLost: 8,
    /** 
     * @description Capturing disabled
     */
    Disable: 9,
    /** 
     * @description The remote device is muted
     */
    Mute: 10,
    /** 
     * @description The device is interrupted, such as a phone call interruption, etc.
     */
    Interruption: 11,
    /** 
     * @description There are multiple apps at the same time in the foreground, such as the iPad app split screen, the system will prohibit all apps from using the camera.
     */
    InBackground: 12,
    /** 
     * @description CDN server actively disconnected
     */
    MultiForegroundApp: 13,
    /** 
     * @description The system is under high load pressure and may cause abnormal equipment.
     */
    BySystemPressure: 14,
}

/**
 * Audio device type.
 * @enum {number}
 */
const ZegoAudioDeviceType =
{
    /** 
     * @description Audio input type
     */
    Input: 0,
    /** 
     * @description Audio output type
     */
    Output: 1,
}

/**
 * Mix stream content type.
 * @enum {number}
 */
const ZegoMixerInputContentType =
{
    /** 
     * @description Mix stream for audio only
     */
    Audio: 0,
    /** 
     * @description Mix stream for both audio and video
     */
    Video: 1,
}

/**
 * Capture pipeline scale mode.
 * @enum {number}
 */
const ZegoCapturePipelineScaleMode =
{
    /** 
     * @description Zoom immediately after acquisition, default
     */
    Pre: 0,
    /** 
     * @description Scaling while encoding
     */
    Post: 1,
}

/**
 * Video frame format.
 * @enum {number}
 */
const ZegoVideoFrameFormat =
{
    /** 
     * @description Unknown format, will take platform default
     */
    Unknown: 0,
    /** 
     * @description I420 (YUV420Planar) format
     */
    I420: 1,
    /** 
     * @description NV12 (YUV420SemiPlanar) format
     */
    NV12: 2,
    /** 
     * @description NV21 (YUV420SemiPlanar) format
     */
    NV21: 3,
    /** 
     * @description BGRA32 format
     */
    BGRA32: 4,
    /** 
     * @description RGBA32 format
     */
    RGBA32: 5,
    /** 
     * @description ARGB32 format
     */
    ARGB32: 6,
    /** 
     * @description ABGR32 format
     */
    ABGR32: 7,
    /** 
     * @description I422 (YUV422Planar) format
     */
    I422: 8,
}

/**
 * Video frame buffer type.
 * @enum {number}
 */
const ZegoVideoBufferType =
{
    /** 
     * @description Raw data type video frame
     */
    Unknown: 0,
    /** 
     * @description Raw data type video frame
     */
    RawData: 1,
    /** 
     * @description Encoded data type video frame
     */
    EncodedData: 2,
    /** 
     * @description Texture 2D type video frame
     */
    GLTexture2D: 3,
    /** 
     * @description CVPixelBuffer type video frame
     */
    CVPixelBuffer: 4,
    /** 
     * @description Surface Texture type video frame
     */
    SurfaceTexture: 5,
}

/**
 * Video frame format series.
 * @enum {number}
 */
const ZegoVideoFrameFormatSeries =
{
    /** 
     * @description RGB series
     */
    RGB: 0,
    /** 
     * @description YUV series
     */
    YUV: 1,
}

/**
 * Video frame flip mode.
 * @enum {number}
 */
const ZegoVideoFlipMode =
{
    /** 
     * @description No flip
     */
    None: 0,
    /** 
     * @description X-axis flip
     */
    X: 1,
    /** 
     * @description Y-axis flip
     */
    Y: 2,
    /** 
     * @description X-Y-axis flip
     */
    XY: 3,
}

/**
 * Audio Config Preset.
 * @enum {number}
 */
const ZegoAudioConfigPreset =
{
    /** 
     * @description Basic sound quality (16 kbps, Mono, ZegoAudioCodecIDDefault)
     */
    BasicQuality: 0,
    /** 
     * @description Standard sound quality (48 kbps, Mono, ZegoAudioCodecIDDefault)
     */
    StandardQuality: 1,
    /** 
     * @description Standard sound quality (56 kbps, Stereo, ZegoAudioCodecIDDefault)
     */
    StandardQualityStereo: 2,
    /** 
     * @description High sound quality (128 kbps, Mono, ZegoAudioCodecIDDefault)
     */
    HighQuality: 3,
    /** 
     * @description High sound quality (192 kbps, Stereo, ZegoAudioCodecIDDefault)
     */
    HighQualityStereo: 4,
}

/**
 * Player state.
 * @enum {number}
 */
const ZegoMediaPlayerState =
{
    /** 
     * @description Not playing
     */
    NoPlay: 0,
    /** 
     * @description Playing
     */
    Playing: 1,
    /** 
     * @description Pausing
     */
    Pausing: 2,
    /** 
     * @description End of play
     */
    PlayEnded: 3,
}

/**
 * Player network event.
 * @enum {number}
 */
const ZegoMediaPlayerNetworkEvent =
{
    /** 
     * @description Network resources are not playing well, and start trying to cache data
     */
    BufferBegin: 0,
    /** 
     * @description Network resources can be played smoothly
     */
    BufferEnded: 1,
}

/**
 * Audio channel.
 * @enum {number}
 */
const ZegoMediaPlayerAudioChannel =
{
    /** 
     * @description Audio channel left
     */
    Left: 0,
    /** 
     * @description Audio channel right
     */
    Right: 1,
    /** 
     * @description Audio channel all
     */
    All: 2,
}

/**
 * AudioEffectPlayer state.
 * @enum {number}
 */
const ZegoAudioEffectPlayState =
{
    /** 
     * @description Not playing
     */
    NoPlay: 0,
    /** 
     * @description Playing
     */
    Playing: 1,
    /** 
     * @description Pausing
     */
    Pausing: 2,
    /** 
     * @description End of play
     */
    PlayEnded: 3,
}

/**
 * Record type.
 * @enum {number}
 */
const ZegoDataRecordType =
{
    /** 
     * @description This field indicates that the audio-only SDK records audio by default, and the audio and video SDK records audio and video by default.
     */
    Default: 0,
    /** 
     * @description only record audio
     */
    OnlyAudio: 1,
    /** 
     * @description only record video, Audio-only SDK is invalid.
     */
    OnlyVideo: 2,
    /** 
     * @description record audio and video, Audio-only SDK will be recorded only audio.
     */
    AudioAndVideo: 3,
}

/**
 * Record state.
 * @enum {number}
 */
const ZegoDataRecordState =
{
    /** 
     * @description Unrecorded state, which is the state when a recording error occurs or before recording starts.
     */
    NoRecord: 0,
    /** 
     * @description Recording in progress, in this state after successfully call [startRecordingCapturedData] function
     */
    Recording: 1,
    /** 
     * @description Record successs
     */
    Success: 2,
}

/**
 * @typedef {Object} ZegoRoomConfig - Advanced room configuration.
 * @property {number} maxMemberCount - The maximum number of users in the room, Passing 0 means unlimited, the default is unlimited.
 * @property {boolean} isUserStatusNotify - Whether to enable the user in and out of the room callback notification [onRoomUserUpdate], the default is off. If developers need to use ZEGO Room user notifications, make sure that each user who login sets this flag to true
 * @property {string} token - The token issued by the developer's business server is used to ensure security. The generation rules are detailed in Room Login Authentication Description https://doc-en.zego.im/en/3881.html Default is empty string, that is, no authentication
 */

/**
 * @typedef {Object} ZegoVideoConfig - Video config.
 * @property {number} captureWidth - Capture resolution width, control the width of camera image acquisition. Only the camera is not started and the custom video capture is not used, the setting is effective. For performance reasons, the SDK scales the video frame to the encoding resolution after capturing from camera and before rendering to the preview view. Therefore, the resolution of the preview image is the encoding resolution. If you need the resolution of the preview image to be this value, Please call [setCapturePipelineScaleMode] first to change the capture pipeline scale mode to [Post]
 * @property {number} captureHeight - Capture resolution height, control the height of camera image acquisition. Only the camera is not started and the custom video capture is not used, the setting is effective. For performance reasons, the SDK scales the video frame to the encoding resolution after capturing from camera and before rendering to the preview view. Therefore, the resolution of the preview image is the encoding resolution. If you need the resolution of the preview image to be this value, Please call [setCapturePipelineScaleMode] first to change the capture pipeline scale mode to [Post]
 * @property {number} encodeWidth - Encode resolution width, control the image width of the encoder when publishing stream. The settings before and after publishing stream can be effective
 * @property {number} encodeHeight - Encode resolution height, control the image height of the encoder when publishing stream. The settings before and after publishing stream can be effective
 * @property {number} fps - Frame rate, control the frame rate of the camera and the frame rate of the encoder. Only the camera is not started, the setting is effective
 * @property {number} bitrate - Bit rate in kbps. The settings before and after publishing stream can be effective
 * @property {ZegoVideoCodecID} codecID - The codec id to be used, the default value is [default]. Settings only take effect before publishing stream
 */

/**
 * @typedef {Object} ZegoVoiceChangerParam - Voice changer parameter.
 * @property {number} pitch - Pitch parameter, value range [-8.0, 8.0], the larger the value, the sharper the sound, set it to 0.0 to turn off. Note that the voice changer effect is only valid for the captured sound.
 */

/**
 * @typedef {Object} ZegoReverbParam - Audio reverberation parameters.
 * @property {number} roomSize - Room size, in the range [0.0, 1.0], to control the size of the "room" in which the reverb is generated, the larger the room, the stronger the reverb.
 * @property {number} reverberance - Echo, in the range [0.0, 0.5], to control the trailing length of the reverb.
 * @property {number} damping - Reverb Damping, range [0.0, 2.0], controls the attenuation of the reverb, the higher the damping, the higher the attenuation.
 * @property {number} dryWetRatio - Dry/wet ratio, the range is greater than or equal to 0.0, to control the ratio between reverberation, direct sound and early reflections; dry part is set to 1 by default; the smaller the dry/wet ratio, the larger the wet ratio, the stronger the reverberation effect.
 */

/**
 * @typedef {Object} ZegoReverbEchoParam - Audio reverberation echo parameters.
 * @property {number} inGain - Gain of input audio signal, in the range [0.0, 1.0]
 * @property {number} outGain - Gain of output audio signal, in the range [0.0, 1.0]
 * @property {number} numDelays - Number of echos, in the range [0, 7]
 * @property {number[]} delay - Respective delay of echo signal, in milliseconds, in the range [0, 5000] ms
 * @property {number[]} decay - Respective decay coefficient of echo signal, in the range [0.0, 1.0]
 */

/**
 * @typedef {Object} ZegoUser - User object.
 * @property {string} userID - User ID, a string with a maximum length of 64 bytes or less. Only support numbers, English characters and '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '.', '<', '>', '/', '\'.
 * @property {string} userName - User Name, a string with a maximum length of 256 bytes or less
 */

/**
 * @typedef {Object} ZegoStream - Stream object.
 * @property {ZegoUser} user - User object instance
 * @property {string} streamID - Stream ID, a string of up to 256 characters. You cannot include URL keywords, otherwise publishing stream and playing stream will fails. Only support numbers, English characters and '~', '!', '@', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '.', '<', '>', '/', '\'.
 * @property {string} extraInfo - Stream extra info
 */

/**
 * @typedef {Object} ZegoRoomExtraInfo - Room extra information.
 * @property {string} key - The key of the room extra information.
 * @property {string} value - The value of the room extra information.
 * @property {ZegoUser} updateUser - The user who update the room extra information.
 * @property {number} updateTime - Update time of the room extra information, UNIX timestamp, in milliseconds.
 */

/**
 * @typedef {Object} ZegoRect - View related coordinates.
 * @property {number} x - The horizontal offset from the top-left corner
 * @property {number} y - The vertical offset from the top-left corner
 * @property {number} width - The width of the rectangle
 * @property {number} height - The height of the rectangle
 */

/**
 * @typedef {Object} ZegoView - View object.
 * @property {ZegoViewMode} viewMode - View mode, default is ZegoViewModeAspectFit
 * @property {number} backgroundColor - Background color, the format is 0xRRGGBB, default is black, which is 0x000000
 * @property {canvas} canvas - html canvas element
 */

/**
 * @typedef {Object} ZegoPublishStreamQuality - Published stream quality information.
 * @property {number} videoCaptureFPS - Video capture frame rate. The unit of frame rate is f/s
 * @property {number} videoEncodeFPS - Video encoding frame rate. The unit of frame rate is f/s
 * @property {number} videoSendFPS - Video transmission frame rate. The unit of frame rate is f/s
 * @property {number} videoKBPS - Video bit rate in kbps
 * @property {number} audioCaptureFPS - Audio capture frame rate. The unit of frame rate is f/s
 * @property {number} audioSendFPS - Audio transmission frame rate. The unit of frame rate is f/s
 * @property {number} audioKBPS - Audio bit rate in kbps
 * @property {number} rtt - Local to server delay, in milliseconds
 * @property {number} packetLostRate - Packet loss rate, in percentage, 0.0 ~ 1.0
 * @property {ZegoStreamQualityLevel} level - Published stream quality level
 * @property {boolean} isHardwareEncode - Whether to enable hardware encoding
 * @property {ZegoVideoCodecID} videoCodecID - Video codec ID
 * @property {number} totalSendBytes - Total number of bytes sent, including audio, video, SEI
 * @property {number} audioSendBytes - Number of audio bytes sent
 * @property {number} videoSendBytes - Number of video bytes sent
 */

/**
 * @typedef {Object} ZegoCDNConfig - CDN config object.
 * @property {string} url - CDN URL
 * @property {string} authParam - Auth param of URL
 */

/**
 * @typedef {Object} ZegoStreamRelayCDNInfo - Relay to CDN info.
 * @property {string} url - URL of publishing stream to CDN
 * @property {ZegoStreamRelayCDNState} state - State of relaying to CDN
 * @property {ZegoStreamRelayCDNUpdateReason} updateReason - Reason for relay state changed
 * @property {number} stateTime - The timestamp when the state changed, UNIX timestamp, in milliseconds.
 */

/**
 * @typedef {Object} ZegoPlayerConfig - Advanced player configuration.
 * @property {?ZegoCDNConfig} cdnConfig - The CDN configuration for playing stream. If set, the stream is play according to the URL instead of the streamID. After that, the streamID is only used as the ID of SDK internal callback.
 * @property {ZegoPlayerVideoLayer} videoLayer - Set the video layer for playing the stream
 */

/**
 * @typedef {Object} ZegoPlayStreamQuality - Played stream quality information.
 * @property {number} videoRecvFPS - Video receiving frame rate. The unit of frame rate is f/s
 * @property {number} videoDejitterFPS - Video dejitter frame rate. The unit of frame rate is f/s
 * @property {number} videoDecodeFPS - Video decoding frame rate. The unit of frame rate is f/s
 * @property {number} videoRenderFPS - Video rendering frame rate. The unit of frame rate is f/s
 * @property {number} videoKBPS - Video bit rate in kbps
 * @property {number} videoBreakRate - Video break rate, the unit is (number of breaks / every 10 seconds)
 * @property {number} audioRecvFPS - Audio receiving frame rate. The unit of frame rate is f/s
 * @property {number} audioDejitterFPS - Audio dejitter frame rate. The unit of frame rate is f/s
 * @property {number} audioDecodeFPS - Audio decoding frame rate. The unit of frame rate is f/s
 * @property {number} audioRenderFPS - Audio rendering frame rate. The unit of frame rate is f/s
 * @property {number} audioKBPS - Audio bit rate in kbps
 * @property {number} audioBreakRate - Audio break rate, the unit is (number of breaks / every 10 seconds)
 * @property {number} rtt - Server to local delay, in milliseconds
 * @property {number} packetLostRate - Packet loss rate, in percentage, 0.0 ~ 1.0
 * @property {number} peerToPeerDelay - Delay from peer to peer, in milliseconds
 * @property {number} peerToPeerPacketLostRate - Packet loss rate from peer to peer, in percentage, 0.0 ~ 1.0
 * @property {ZegoStreamQualityLevel} level - Published stream quality level
 * @property {number} delay - Delay after the data is received by the local end, in milliseconds
 * @property {boolean} isHardwareDecode - Whether to enable hardware decoding
 * @property {ZegoVideoCodecID} videoCodecID - Video codec ID
 * @property {number} totalRecvBytes - Total number of bytes received, including audio, video, SEI
 * @property {number} audioRecvBytes - Number of audio bytes received
 * @property {number} videoRecvBytes - Number of video bytes received
 */

/**
 * @typedef {Object} ZegoDeviceInfo - Device Info.
 * @property {string} deviceID - Device ID
 * @property {string} deviceName - Device name
 */

/**
 * @typedef {Object} ZegoMixerAudioConfig - Mix stream audio configuration.
 * @property {number} bitrate - Audio bitrate in kbps, default is 48 kbps, cannot be modified after starting a mixer task
 * @property {ZegoAudioChannel} channel - Audio channel, default is Mono
 * @property {ZegoAudioCodecID} codecID - codec ID, default is ZegoAudioCodecIDDefault
 */

/**
 * @typedef {Object} ZegoMixerVideoConfig - Mix stream video config object.
 * @property {number} width - Video resolution width
 * @property {number} height - Video resolution height
 * @property {number} fps - Video FPS, cannot be modified after starting a mixer task
 * @property {number} bitrate - Video bitrate in kbps
 */

/**
 * @typedef {Object} ZegoMixerInput - Mixer input.
 * @property {string} streamID - Stream ID, a string of up to 256 characters. You cannot include URL keywords, otherwise publishing stream and playing stream will fails. Only support numbers, English characters and '~', '!', '@', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '.', '<', '>', '/', '\'.
 * @property {ZegoMixerInputContentType} contentType - Mix stream content type
 * @property {ZegoRect} layout - Stream layout
 * @property {number} soundLevelID - If enable soundLevel in mix stream task, an unique soundLevelID is need for every stream
 */

/**
 * @typedef {Object} ZegoMixerOutput - Mixer output object.
 * @property {string} target - Mix stream output target, URL or stream ID, if set to be URL format, only RTMP URL surpported, for example rtmp://xxxxxxxx
 */

/**
 * @typedef {Object} ZegoWatermark - Watermark object.
 * @property {string} imageURL - Watermark image URL, only png or jpg format surpport.
 * @property {ZegoRect} layout - Watermark image layout
 */

/**
 * @typedef {Object} ZegoBroadcastMessageInfo - Broadcast message info.
 * @property {string} message - message content
 * @property {number} messageID - message id
 * @property {number} sendTime - Message send time, UNIX timestamp, in milliseconds.
 * @property {ZegoUser} fromUser - Message sender
 */

/**
 * @typedef {Object} ZegoBarrageMessageInfo - Barrage message info.
 * @property {string} message - message content
 * @property {string} messageID - message id
 * @property {number} sendTime - Message send time, UNIX timestamp, in milliseconds.
 * @property {ZegoUser} fromUser - Message sender
 */

/**
 * @typedef {Object} ZegoAudioConfig - Audio configuration.
 * @property {number} bitrate - Audio bitrate in kbps, default is 48 kbps. The settings before and after publishing stream can be effective
 * @property {ZegoAudioChannel} channel - Audio channel, default is Mono. The setting only take effect before publishing stream
 * @property {ZegoAudioCodecID} codecID - codec ID, default is ZegoAudioCodecIDDefault. The setting only take effect before publishing stream
 */

/**
 * @typedef {Object} ZegoDataRecordConfig - Record config.
 * @property {string} filePath - The path to save the recording file, absolute path, need to include the file name, the file name need to specify the suffix, currently only support .mp4 or .flv, if multiple recording for the same path, will overwrite the file with the same name. The maximum length should be less than 1024 bytes.
 * @property {ZegoDataRecordType} recordType - Type of recording media
 */

/**
 * @typedef {Object} ZegoDataRecordProgress - File recording progress.
 * @property {number} duration - Current recording duration in milliseconds
 * @property {number} currentFileSize - Current recording file size in byte
 */

/**
 * @typedef {Object} ZegoAudioEffectPlayConfig - AudioEffectPlayer play configuration.
 * @property {number} playCount - The number of play counts. When set to 0, it will play in an infinite loop until the user invoke [stop]. The default is 1, which means it will play only once.
 * @property {boolean} isPublishOut - Whether to mix audio effects into the publishing stream, the default is false.
 */

module.exports = {
    ZegoScenario,
    ZegoOrientation,
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
}


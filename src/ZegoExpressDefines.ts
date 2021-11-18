import { ZegoMediaPlayerListener } from "./ZegoExpressEventHandler"

export interface ZegoDestroyCompletionCallback {}

export interface ZegoRoomSetRoomExtraInfoResult {
    errorCode: number
}

export interface ZegoPublisherSetStreamExtraInfoResult {
    errorCode: number
}

export interface ZegoPublisherUpdateCdnUrlResult {
    errorCode: number
}

export interface ZegoPublisherTakeSnapshotResult {
    errorCode: number
    image: string
}

export interface ZegoPlayerTakeSnapshotResult {
    errorCode: number
    image: string
}

export interface ZegoIMSendBroadcastMessageResult {
    errorCode: number
    messageID: number
}

export interface ZegoIMSendBarrageMessageResult {
    errorCode: number
    messageID: string
}

export interface ZegoIMSendCustomCommandResult {
    errorCode: number
}

export interface ZegoMediaPlayerLoadResourceResult {
    errorCode: number
}

export interface ZegoMediaPlayerSeekToResult {
    errorCode: number
}

export interface ZegoMediaPlayerTakeSnapshotResult {
    errorCode: number
}

export interface ZegoMixerStartResult {
    errorCode: number
    extendedData: Map<string, object>
}

export interface ZegoMixerStopResult {
    errorCode: number
}


export interface ZegoSize {
    width: number
    height: number
}

export interface ZegoRect {
    x: number
    y: number
    width: number
    height: number
}

/**
 * Application scenario.
 */
export enum ZegoScenario {
    /**
     * General scenario
     */
	General = 0,
    /**
     * Communication scenario
     */
	Communication = 1,
	/**
     * Live scenario
     */
	Live = 2
}

/**
 * Language.
 */
export enum ZegoLanguage {
    /**
     * English
     */
    English = 0,
    /**
     * Chinese
     */
    Chinese = 1
}

export enum ZegoOrientation {
    PortraitUp = 0,
    LandscapeLeft = 1,
    PortraitDown = 2,
    LandscapeRight = 3
}


/**
 * Engine state.
 */ 
export enum ZegoEngineState {
	/**
     * The engine has started
     */
	Start = 0,
	/**
     * The engine has stoped
     */
	Stop = 1,
}

/**
 * Room state.
 */
export enum ZegoRoomState {
	/**
     * Unconnected state, enter this state before logging in and after exiting the room. If there is a steady state abnormality in the process of logging in to the room, such as AppID and AppSign are incorrect, or if the same user name is logged in elsewhere and the local end is KickOut, it will enter this state.
     */
	DisConnected = 0,
	/**
     * The state that the connection is being requested. It will enter this state after successful execution login room function. The display of the UI is usually performed using this state. If the connection is interrupted due to poor network quality, the SDK will perform an internal retry and will return to the requesting connection status.
     */
	Connecting = 1,
	/**
     * The status that is successfully connected. Entering this status indicates that the login to the room has been successful. The user can receive the callback notification of the user and the stream information in the room.
     */
	Connected = 2
}

/**
 * Publish channel.
 */
export enum ZegoPublishChannel {
	/**
     * Main publish channel
     */
	Main = 0,
	/**
     * Auxiliary publish channel
     */
	Aux = 1
}

/**
 * Publish stream status.
 */
export enum ZegoPublisherState {
	/**
     * The state is not published, and it is in this state before publishing the stream. If a steady-state exception occurs in the publish process, such as AppID and AppSign are incorrect, or if other users are already publishing the stream, there will be a failure and enter this state.
     */
	NoPublish = 0,
	/**
     * The state that it is requesting to publish the stream after the [startPublishingStream] function is successfully called. The UI is usually displayed through this state. If the connection is interrupted due to poor network quality, the SDK will perform an internal retry and will return to the requesting state.
     */
	PublishRequesting = 1,
	/**
     * The state that the stream is being published, entering the state indicates that the stream has been successfully published, and the user can communicate normally.
     */
	Publishing = 2
}

/**
 * Video rendering fill mode.
 */
export enum ZegoViewMode {
	/**
     * The proportional scaling up, there may be black borders
     */
	AspectFit = 0,
	/**
     * The proportional zoom fills the entire View and may be partially cut
     */
	AspectFill = 1,
	/**
     * Fill the entire view, the image may be stretched
     */
	ScaleToFill = 2
}

/**
 * Mirror mode for previewing or playing the of the stream.
 */
export enum ZegoVideoMirrorMode {
	/**
     * The mirror image only for previewing locally. This mode is used by default.
     */
	OnlyPreviewMirror = 0,
	/**
     * Both the video previewed locally and the far end playing the stream will see mirror image.
     */
	BothMirror = 1,
	/**
     * Both the video previewed locally and the far end playing the stream will not see mirror image.
     */
	NoMirror = 2,
	/**
     * The mirror image only for far end playing the stream.
     */
	OnlyPublishMirror = 3
}

/// SEI type
export enum ZegoSEIType {
	/// Using H.264 SEI (nalu type = 6, payload type = 243) type packaging, this type is not specified by the SEI standard, there is no conflict with the video encoder or the SEI in the video file, users do not need to follow the SEI content Do filtering, SDK uses this type by default.
	ZegoDefined = 0,
	/// SEI (nalu type = 6, payload type = 5) of H.264 is used for packaging. The H.264 standard has a prescribed format for this type: startcode + nalu type (6) + payload type (5) + len + payload (uuid + content) + trailing bits. Because the video encoder itself generates an SEI with a payload type of 5, or when a video file is used for streaming, such SEI may also exist in the video file, so when using this type, the user needs to use uuid + context as a buffer sending SEI. At this time, in order to distinguish the SEI generated by the video encoder itself, when the App sends this type of SEI, it can fill in the service-specific uuid (uuid length is 16 bytes). When the receiver uses the SDK to parse the SEI of the payload type 5, it will set filter string filters out the SEI matching the uuid and throws it to the business. If the filter string is not set, the SDK will throw all received SEI to the developer. uuid filter string setting function, [ZegoEngineConfig.advancedConfig("unregister_sei_filter","XXXXXX")], where unregister_sei_filter is the key, and XXXXX is the uuid filter string to be set.
	UserUnregister = 1
}

/// Voice changer preset value.
export enum ZegoVoiceChangerPreset {
    /// No Voice changer
    None = 0,
    /// Male to child voice (loli voice effect)
    MenToChild = 1,
    /// Male to female voice (kindergarten voice effect)
    MenToWomen = 2,
    /// Female to child voice
    WomenToChild = 3,
    /// Female to male voice
    WomenToMen = 4,
    /// Foreigner voice effect
    Foreigner = 5,
    /// Autobot Optimus Prime voice effect
    OptimusPrime = 6,
    /// Android robot voice effect
    Android = 7,
    /// Ethereal voice effect
    Ethereal = 8,
    /// Magnetic(Male) voice effect
    MaleMagnetic = 9,
    /// Fresh(Female) voice effect
    FemaleFresh = 10
}

/// Reverberation preset value.
export enum ZegoReverbPreset {
    /// No Reverberation
	None = 0,
    /// Soft room reverb effect
    SoftRoom = 1,
    /// Large room reverb effect
    LargeRoom = 2,
    /// Concer hall reverb effect
    ConcerHall = 3,
    /// Valley reverb effect
    Valley = 4,
    /// Recording studio reverb effect
    RecordingStudio = 5,
    /// Basement reverb effect
    Basement = 6,
    /// KTV reverb effect
    KTV = 7,
    /// Popular reverb effect
    Popular = 8,
    /// Rock reverb effect
    Rock = 9,
    /// Vocal concert reverb effect
    VocalConcert = 10
}

/**
 * Video configuration resolution and bitrate preset enumeration. The preset resolutions are adapted for mobile and desktop. On mobile, height is longer than width, and desktop is the opposite. For example, 1080p is actually 1080(w) x 1920(h) on mobile and 1920(w) x 1080(h) on desktop.
 */
export enum ZegoVideoConfigPreset {
    /**
     * Set the resolution to 320x180, the default is 15 fps, the code rate is 300 kbps
     */
    Preset180P = 0,
    /**
     * Set the resolution to 480x270, the default is 15 fps, the code rate is 400 kbps
     */
    Preset270P = 1,
    /**
     * Set the resolution to 640x360, the default is 15 fps, the code rate is 600 kbps
     */
    Preset360P = 2,
    /**
     * Set the resolution to 960x540, the default is 15 fps, the code rate is 1200 kbps
     */
    Preset540P = 3,
    /**
     * Set the resolution to 1280x720, the default is 15 fps, the code rate is 1500 kbps
     */
    Preset720P = 4,
    /**
     * Set the resolution to 1920x1080, the default is 15 fps, the code rate is 3000 kbps
     */
    Preset1080P = 5
}

/**
 * Stream quality level.
 */
export enum ZegoStreamQualityLevel {
    /**
     * Excellent
     */
    Excellent = 0,
    /**
     * Good
     */
    Good = 1,
    /**
     * Normal
     */
    Medium = 2,
    /**
     * Bad
     */
    Bad = 3,
    /**
     * Failed
     */
    Die = 4
}

/// Audio channel type.
export enum ZegoAudioChannel {
    /// Unknown
    Unknown = 0,
    /// Mono
    Mono = 1,
    /// Stereo
    Stereo = 2
}

/// Audio capture stereo mode.
export enum ZegoAudioCaptureStereoMode {
    /// Disable capture stereo, i.e. capture mono
    None = 0,
    /// Always enable capture stereo
    Always = 1,
    /// Adaptive mode, capture stereo when publishing stream only, capture mono when publishing and playing stream (e.g. talk/intercom scenes)
    Adaptive = 2
}

/// Audio mix mode.
export enum ZegoAudioMixMode {
    /// Default mode, no special behavior
    Raw = 0,
    /// Audio focus mode, which can highlight the sound of a certain stream in multiple audio streams
    Focused = 1
}

/// Audio Codec ID.
export enum ZegoAudioCodecID {
    /// default
    Default = 0,
    /// Normal
    Normal = 1,
    /// Normal2
    Normal2 = 2,
    /// Normal3
    Normal3 = 3,
    /// Low
    Low = 4,
    /// Low2
    Low2 = 5,
    /// Low3
    Low3 = 6
}

/**
 * Video codec ID.
 */
export enum ZegoVideoCodecID {
    /**
     * Default (H.264)
     */
    Default = 0,
    /**
     * Scalable Video Coding (H.264 SVC)
     */
    SVC = 1,
    /**
     * VP8
     */
    VP8 = 2,
    /**
     * H.265
     */
    H265 = 3
}

/**
 * Player video layer.
 */
export enum ZegoPlayerVideoLayer {
    /**
     * The layer to be played depends on the network status
     */
    Auto = 0,
    /**
     * Play the base layer (small resolution)
     */
    Base = 1,
    /**
     * Play the extend layer (big resolution)
     */
    BaseExtend = 2
}

/**
 * Video stream type
 */
export enum ZegoVideoStreamType {
    /**
     * The type to be played depends on the network status
     */
    Default = 0,
    /**
     * small resolution type
     */
    Small = 1,
    /**
     * big resolution type
     */
    Big = 2
}

/// Audio echo cancellation mode.
export enum ZegoAECMode {
    /// Aggressive echo cancellation may affect the sound quality slightly, but the echo will be very clean
    Aggressive = 0,
    /// Moderate echo cancellation, which may slightly affect a little bit of sound, but the residual echo will be less
    Medium = 1,
    /// Comfortable echo cancellation, that is, echo cancellation does not affect the sound quality of the sound, and sometimes there may be a little echo, but it will not affect the normal listening.
    Soft = 2
}

/// Active Noise Suppression mode.
export enum ZegoANSMode {
    /// Soft ANS
    Soft = 0,
    /// Medium ANS
    Medium = 1,
    /// Aggressive ANS
    Aggressive = 2
}

/**
 * Traffic control property (bitmask enumeration).
 */
export enum ZegoTrafficControlProperty {
    /**
     * Basic
     */
    Basic = 0,
    /**
     * Adaptive FPS
     */
    AdaptiveFPS = 1,
    /**
     * Adaptive resolution
     */
    AdaptiveResolution = 1 << 1,
    /**
     * Adaptive Audio bitrate
     */
    AdaptiveAudioBitrate = 1 << 2
}

/**
 * Video transmission mode when current bitrate is lower than the set minimum bitrate.
 */
export enum ZegoTrafficControlMinVideoBitrateMode {
    /**
     * Stop video transmission when current bitrate is lower than the set minimum bitrate
     */
    NoVideo = 0,
    /**
     * Video is sent at a very low frequency (no more than 2fps) which is lower than the set minimum bitrate
     */
    UltraLowFPS = 1
}

/**
 * Factors that trigger traffic control
 */
export enum ZegoTrafficControlFocusOnMode {
    /**
     * Focus only on the local network
     */
    LocalOnly = 0,
    /**
     * Pay attention to the local network, but also take into account the remote network, currently only effective in the 1v1 scenario
     */
    Remote = 1
}

/**
 * Playing stream status.
 */
export enum ZegoPlayerState {
    /**
     * The state of the flow is not played, and it is in this state before the stream is played. If the steady flow anomaly occurs during the playing process, such as AppID and AppSign are incorrect, it will enter this state.
     */
    NoPlay = 0,
    /**
     * The state that the stream is being requested for playing. After the [startPlayingStream] function is successfully called, it will enter the state. The UI is usually displayed through this state. If the connection is interrupted due to poor network quality, the SDK will perform an internal retry and will return to the requesting state.
     */
    PlayRequesting = 1,
    /**
     * The state that the stream is being playing, entering the state indicates that the stream has been successfully played, and the user can communicate normally.
     */
    Playing = 2
}


/**
 * Media event when playing.
 */
export enum ZegoPlayerMediaEvent {
    /**
     * Audio stuck event when playing
     */
    AudioBreakOccur = 0,
    /**
     * Audio stuck event recovery when playing
     */
    AudioBreakResume = 1,
    /**
     * Video stuck event when playing
     */
    VideoBreakOccur = 2,
    /**
     * Video stuck event recovery when playing
     */
    VideoBreakResume = 3
}

/**
 * Stream Resource Mode
 */
export enum ZegoStreamResourceMode {
    /**
     * Default mode. The SDK will automatically select the streaming resource according to the cdnConfig parameters set by the player config and the ready-made background configuration.
     */
    Default = 0,
    /**
     * Playing stream only from CDN.
     */
    OnlyCDN = 1,
    /**
     * Playing stream only from L3.
     */
    OnlyL3 = 2,
    /**
     * Playing stream only from RTC.
     */
    OnlyRTC = 3
}


/**
 * Update type.
 */
export enum ZegoUpdateType {
    /**
     * Add
     */
    Add = 0,
    /**
     * Delete
     */
    Delete = 1
}


/// State of CDN relay.
export enum ZegoStreamRelayCDNState {
    /// The state indicates that there is no CDN relay
    NoRelay = 0,
    /// The CDN relay is being requested
    RelayRequesting = 1,
    /// Entering this status indicates that the CDN relay has been successful
    Relaying = 2
}


/// Reason for state of CDN relay changed.
export enum ZegoStreamRelayCDNUpdateReason {
    /// No error
    None = 0,
    /// Server error
    ServerError = 1,
    /// Handshake error
    HandshakeFailed = 2,
    /// Access point error
    AccessPointError = 3,
    /// Stream create failure
    CreateStreamFailed = 4,
    /// Bad name
    BadName = 5,
    /// CDN server actively disconnected
    CDNServerDisconnected = 6,
    /// Active disconnect
    Disconnected = 7,
    /// All mixer input streams sessions closed
    MixStreamAllInputStreamClosed = 8,
    /// All mixer input streams have no data
    MixStreamAllInputStreamNoData = 9,
    /// Internal error of stream mixer server
    MixStreamServerInternalError = 10
}


/// Beauty feature (bitmask enumeration).
export enum ZegoBeautifyFeature {
    /// No beautifying
    None = 0,
    /// Polish
    Polish = 1 << 0,
    /// Sharpen
    Whiten = 1 << 1,
    /// Skin whiten
    SkinWhiten = 1 << 2,
    /// Whiten
    Sharpen = 1 << 3
}


/// Remote device status.
export enum ZegoRemoteDeviceState {
    /// Device on
    Open = 0,
    /// General device error
    GenericError = 1,
    /// Invalid device ID
    InvalidID = 2,
    /// No permission
    NoAuthorization = 3,
    /// Captured frame rate is 0
    ZeroFPS = 4,
    /// The device is occupied
    InUseByOther = 5,
    /// The device is not plugged in or unplugged
    Unplugged = 6,
    /// The system needs to be restarted
    RebootRequired = 7,
    /// System media services stop, such as under the iOS platform, when the system detects that the current pressure is huge (such as playing a lot of animation), it is possible to disable all media related services.
    SystemMediaServicesLost = 8,
    /// Capturing disabled
    Disable = 9,
    /// The remote device is muted
    Mute = 10,
    /// The device is interrupted, such as a phone call interruption, etc.
    Interruption = 11,
    /// There are multiple apps at the same time in the foreground, such as the iPad app split screen, the system will prohibit all apps from using the camera.
    InBackground = 12,
    /// CDN server actively disconnected
    MultiForegroundApp = 13,
    /// The system is under high load pressure and may cause abnormal equipment.
    BySystemPressure = 14
}


/// Audio device type.
export enum ZegoAudioDeviceType {
    /// Audio input type
    Input = 0,
    /// Audio output type
    Output = 1
}


/// Audio route
export enum ZegoAudioRoute {
    /// Speaker
    Speaker = 0,
    /// Headphone
    Headphone = 1,
    /// Bluetooth device
    Bluetooth = 2,
    /// Receiver
    Receiver = 3,
    /// External USB audio device
    ExternalUSB = 4,
    /// Apple AirPlay
    AirPlay = 5
}


/// Mix stream content type.
export enum ZegoMixerInputContentType {
    /// Mix stream for audio only
    Audio = 0,
    /// Mix stream for both audio and video
    Video = 1
}


/// Capture pipeline scale mode.
export enum ZegoCapturePipelineScaleMode {
    /// Zoom immediately after acquisition, default
    Pre = 0,
    /// Scaling while encoding
    Post = 1
}


/// Video frame format.
export enum ZegoVideoFrameFormat {
    /// Unknown format, will take platform default
    Unknown = 0,
    /// I420 (YUV420Planar) format
    I420 = 1,
    /// NV12 (YUV420SemiPlanar) format
    NV12 = 2,
    /// NV21 (YUV420SemiPlanar) format
    NV21 = 3,
    /// BGRA32 format
    BGRA32 = 4,
    /// RGBA32 format
    RGBA32 = 5,
    /// ARGB32 format
    ARGB32 = 6,
    /// ABGR32 format
    ABGR32 = 7,
    /// I422 (YUV422Planar) format
    I422 = 8
}


/// Video encoded frame format.
export enum ZegoVideoEncodedFrameFormat {
    /// AVC AVCC format
    AVCC = 0,
    /// AVC Annex-B format
    AnnexB = 1
}


/// Video frame buffer type.
export enum ZegoVideoBufferType {
    /// Raw data type video frame
    Unknown = 0,
    /// Raw data type video frame
    RawData = 1,
    /// Encoded data type video frame
    EncodedData = 2,
    /// Texture 2D type video frame
    GLTexture2D = 3,
    /// CVPixelBuffer type video frame
    CVPixelBuffer = 4
}


/// Video frame format series.
export enum ZegoVideoFrameFormatSeries {
    /// RGB series
    RGB = 0,
    /// YUV series
    YUV = 1
}


/// Video frame flip mode.
export enum ZegoVideoFlipMode {
    /// No flip
    None = 0,
    /// X-axis flip
    X = 1,
    /// Y-axis flip
    Y = 2,
    /// X-Y-axis flip
    XY = 3
}


/// Customize the audio processing configuration type.
export enum ZegoCustomAudioProcessType {
    /// Remote audio processing
    Remote = 0,
    /// Capture audio processing
    Capture = 1,
    /// Remote audio and capture audio processing
    CaptureAndRemote = 2
}


/// Audio Config Preset.
export enum ZegoAudioConfigPreset {
    /// Basic sound quality (16 kbps, Mono, ZegoAudioCodecIDDefault)
    BasicQuality = 0,
    /// Standard sound quality (48 kbps, Mono, ZegoAudioCodecIDDefault)
    StandardQuality = 1,
    /// Standard sound quality (56 kbps, Stereo, ZegoAudioCodecIDDefault)
    StandardQualityStereo = 2,
    /// High sound quality (128 kbps, Mono, ZegoAudioCodecIDDefault)
    HighQuality = 3,
    /// High sound quality (192 kbps, Stereo, ZegoAudioCodecIDDefault)
    HighQualityStereo = 4
}


/**
 * Player state.
 */
export enum ZegoMediaPlayerState {
    /**
     * Not playing
     */
    NoPlay = 0,
    /**
     * Playing
     */
    Playing = 1,
    /**
     * Pausing
     */
    Pausing = 2,
    /**
     * End of play
     */
    PlayEnded = 3
}


/**
 * Player network event.
 */
export enum ZegoMediaPlayerNetworkEvent {
    /**
     * Network resources are not playing well, and start trying to cache data
     */
    BufferBegin = 0,
    /**
     * Network resources can be played smoothly
     */
    BufferEnded = 1
}


/**
 * Audio channel.
 */
export enum ZegoMediaPlayerAudioChannel {
    /**
     * Audio channel left
     */
    Left = 0,
    /**
     * Audio channel right
     */
    Right = 1,
    /**
     * Audio channel all
     */
    All = 2
}


/// AudioEffectPlayer state.
export enum ZegoAudioEffectPlayState {
    /// Not playing
    NoPlay = 0,
    /// Playing
    Playing = 1,
    /// Pausing
    Pausing = 2,
    /// End of play
    PlayEnded = 3
}


/// volume type.
export enum ZegoVolumeType {
    /// volume local
    Local = 0,
    /// volume remote
    Remote = 1
}


/// audio sample rate.
export enum ZegoAudioSampleRate {
    /// Unknown
    Unknown = 0,
    /// 8K
    Rate8K = 8000,
    /// 16K
    Rate16K = 16000,
    /// 22.05K
    Rate22K = 22050,
    /// 24K
    Rate24K = 24000,
    /// 32K
    Rate32K = 32000,
    /// 44.1K
    Rate44K = 44100,
    /// 48K
    Rate48K = 48000
}


/// Audio capture source type.
export enum ZegoAudioSourceType {
    /// Default audio capture source (the main channel uses custom audio capture by default the aux channel uses the same sound as main channel by default)
    Default = 0,
    /// Use custom audio capture, refer to [enableCustomAudioIO]
    Custom = 1,
    /// Use media player as audio source, only support aux channel
    MediaPlayer = 2
}


/// Record type.
export enum ZegoDataRecordType {
    /// This field indicates that the Express-Audio SDK records audio by default, and the Express-Video SDK records audio and video by default. When recording files in .aac format, audio is also recorded by default.
    Default = 0,
    /// only record audio
    OnlyAudio = 1,
    /// only record video, Audio SDK and recording .aac format files are invalid.
    OnlyVideo = 2,
    /// record audio and video. Express-Audio SDK and .aac format files are recorded only audio.
    AudioAndVideo = 3
}


/// Record state.
export enum ZegoDataRecordState {
/// Unrecorded state, which is the state when a recording error occurs or before recording starts.
    NoRecord = 0,
    /// Recording in progress, in this state after successfully call [startRecordingCapturedData] function
    Recording = 1,
    /// Record successs
    Success = 2
}


/// Audio data callback function enable bitmask enumeration.
export enum ZegoAudioDataCallbackBitMask {
    /// The mask bit of this field corresponds to the enable [onCapturedAudioData] callback function
    Captured = 1 << 0,
    /// The mask bit of this field corresponds to the enable [onPlaybackAudioData] callback function
    Playback = 1 << 1,
    /// The mask bit of this field corresponds to the enable [onMixedAudioData] callback function
    Mixed = 1 << 2,
    /// The mask bit of this field corresponds to the enable [onPlayerAudioData] callback function
    Player = 1 << 3
}


/// Network mode
export enum ZegoNetworkMode {
    /// Offline (No network)
    Offline = 0,
    /// Unknown network mode
    Unknown = 1,
    /// Wired Ethernet (LAN)
    Ethernet = 2,
    /// Wi-Fi (WLAN)
    WiFi = 3,
    /// 2G Network (GPRS/EDGE/CDMA1x/etc.)
    Mode2G = 4,
    /// 3G Network (WCDMA/HSDPA/EVDO/etc.)
    Mode3G = 5,
    /// 4G Network (LTE)
    Mode4G = 6,
    /// 5G Network (NR (NSA/SA))
    Mode5G = 7
}


/// network speed test type
export enum ZegoNetworkSpeedTestType {
    /// uplink
    Uplink = 0,
    /// downlink
    Downlink = 1
}






/// Log config.
///
/// Configure the log file save path and the maximum log file size.
export interface ZegoLogConfig {

    /// The log file save path. The default path is [NSCachesDirectory]/ZegoLogs/
    logPath?: string

    /// The maximum log file size (Bytes). The default maximum size is 5MB (5 * 1024 * 1024 Bytes)
    logSize?: number
}


/// Custom video capture configuration.
///
/// Custom video capture, that is, the developer is responsible for collecting video data and sending the collected video data to SDK for video data encoding and publishing to the ZEGO RTC server. This feature is generally used by developers who use third-party beauty features or record game screen living.
/// When you need to use the custom video capture function, you need to set an instance of this class as a parameter to the [enableCustomVideoCapture] function.
/// Because when using custom video capture, SDK will no longer start the camera to capture video data. You need to collect video data from video sources by yourself.
export interface ZegoCustomVideoCaptureConfig {

    /// Custom video capture video frame data type
    bufferType: ZegoVideoBufferType
}


/// Custom video process configuration.
export interface ZegoCustomVideoProcessConfig {

    /// Custom video process video frame data type. The default value is [ZegoVideoBufferTypeCVPixelBuffer].
    bufferType: ZegoVideoBufferType
}


/// Custom video render configuration.
///
/// When you need to use the custom video render function, you need to set an instance of this class as a parameter to the [enableCustomVideoRender] function.
export interface ZegoCustomVideoRenderConfig {

    /// Custom video capture video frame data type
    bufferType: ZegoVideoBufferType

    /// Custom video rendering video frame data format。Useless when set bufferType as [EncodedData]
    frameFormatSeries: ZegoVideoFrameFormatSeries

    /// Whether the engine also renders while customizing video rendering. The default value is [false]. Useless when set bufferType as [EncodedData]
    enableEngineRender: boolean
}


/// Custom audio configuration.
export interface ZegoCustomAudioConfig {

    /// Audio capture source type
    sourceType: ZegoAudioSourceType
}

/// Profile for create engine
export interface ZegoEngineProfile {
	
	/// Application ID issued by ZEGO for developers, please apply from the ZEGO Admin Console https://console-express.zego.im The value ranges from 0 to 4294967295.
	appID: number
	
	/// Application signature for each AppID, please apply from the ZEGO Admin Console. Application signature is a 64 character string. Each character has a range of '0' ~ '9', 'a' ~ 'z'.
	appSign: string
	
	/// The application scenario. Developers can choose one of ZegoScenario based on the scenario of the app they are developing, and the engine will preset a more general setting for specific scenarios based on the set scenario. After setting specific scenarios, developers can still call specific functions to set specific parameters if they have customized parameter settings.
	scenario: ZegoScenario
}

/// Advanced engine configuration.
export interface ZegoEngineConfig {

    /// Other special function switches, if not set, no special function will be used by default. Please contact ZEGO technical support before use.
    advancedConfig?: {[key: string]: string}
}


/**
 * Advanced room configuration.
 * 
 * Configure maximum number of users in the room and authentication token, etc.
 */
export interface ZegoRoomConfig {

    /** 
     * The maximum number of users in the room, Passing 0 means unlimited, the default is unlimited.
     */
    maxMemberCount: number

    /** 
     * Whether to enable the user in and out of the room callback notification [onRoomUserUpdate], the default is off. If developers need to use ZEGO Room user notifications, make sure that each user who login sets this flag to true
     */
    isUserStatusNotify: boolean

    /**
     * The token issued by the developer's business server is used to ensure security. The generation rules are detailed in Room Login Authentication Description https://doc-en.zego.im/en/3881.html Default is empty string, that is, no authentication
     */
    token: string
}


/// Video config.
///
/// Configure parameters used for publishing stream, such as bitrate, frame rate, and resolution.
/// Developers should note that the width and height resolution of the mobile and desktop are opposite. For example, 360p, the resolution of the mobile is 360x640, and the desktop is 640x360.
export interface ZegoVideoConfig {
    captureWidth: number
    captureHeight: number
    encodeWidth: number
    encodeHeight: number
    bitrate: number
    fps: number
    codecID: ZegoVideoCodecID
}

/// Externally encoded data traffic control information.
export interface ZegoTrafficControlInfo {

    /// Video FPS to be adjusted
    fps: number

    /// Video bitrate in kbps to be adjusted
    bitrate: number

    /// Video resolution to be adjusted
    resolution: ZegoSize
}


/// SEI configuration
///
/// Used to set the relevant configuration of the Supplemental Enhancement Information.
export interface ZegoSEIConfig {

    /// SEI type
    type: ZegoSEIType
}


/// Voice changer parameter.
///
/// Developer can use the built-in presets of the SDK to change the parameters of the voice changer.
export interface ZegoVoiceChangerParam {

    /// Pitch parameter, value range [-8.0, 8.0], the larger the value, the sharper the sound, set it to 0.0 to turn off. Note that the voice changer effect is only valid for the captured sound.
    pitch: number
}


/// Audio reverberation parameters.
///
/// Developers can use the SDK's built-in presets to change the parameters of the reverb.
export interface ZegoReverbParam {

    /// Room size, in the range [0.0, 1.0], to control the size of the "room" in which the reverb is generated, the larger the room, the stronger the reverb.
    roomSize: number

    /// Echo, in the range [0.0, 0.5], to control the trailing length of the reverb.
    reverberance: number

    /// Reverb Damping, range [0.0, 2.0], controls the attenuation of the reverb, the higher the damping, the higher the attenuation.
    damping: number

    /// Dry/wet ratio, the range is greater than or equal to 0.0, to control the ratio between reverberation, direct sound and early reflections dry part is set to 1 by default the smaller the dry/wet ratio, the larger the wet ratio, the stronger the reverberation effect.
    dryWetRatio: number
}


/// Audio reverberation advanced parameters.
///
/// Developers can use the SDK's built-in presets to change the parameters of the reverb.
export interface ZegoReverbAdvancedParam {

    /// Room size(%), in the range [0.0, 1.0], to control the size of the "room" in which the reverb is generated, the larger the room, the stronger the reverb.
    roomSize: number

    /// Echo(%), in the range [0.0, 100.0], to control the trailing length of the reverb.
    reverberance: number

    /// Reverb Damping(%), range [0.0, 100.0], controls the attenuation of the reverb, the higher the damping, the higher the attenuation.
    damping: number

    /// only wet
    wetOnly: boolean

    /// wet gain(dB), range [-20.0, 10.0]
    wetGain: number

    /// dry gain(dB), range [-20.0, 10.0]
    dryGain: number

    /// Tone Low. 100% by default
    toneLow: number

    /// Tone High. 100% by default
    toneHigh: number

    /// PreDelay(ms), range [0.0, 200.0]
    preDelay: number

    /// Stereo Width(%). 0% by default
    stereoWidth: number
}


/// Audio reverberation echo parameters.
export interface ZegoReverbEchoParam {

    /// Gain of input audio signal, in the range [0.0, 1.0]
    inGain: number

    /// Gain of output audio signal, in the range [0.0, 1.0]
    outGain: number

    /// Number of echos, in the range [0, 7]
    numDelays: number

    /// Respective delay of echo signal, in milliseconds, in the range [0, 5000] ms
    delay: number[]

    /// Respective decay coefficient of echo signal, in the range [0.0, 1.0]
    decay: number[]
}


/// User object.
///
/// Configure user ID and username to identify users in the room.
/// Note that the userID must be unique under the same appID, otherwise mutual kicks out will occur.
/// It is strongly recommended that userID corresponds to the user ID of the business APP, that is, a userID and a real user are fixed and unique, and should not be passed to the SDK in a random userID. Because the unique and fixed userID allows ZEGO technicians to quickly locate online problems.
export interface ZegoUser {

    /// User ID, a string with a maximum length of 64 bytes or less. Only support numbers, English characters and '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '&#46;', '<', '>', '/', '\'.Please do not fill in sensitive user information in this field, including but not limited to mobile phone number, ID number, passport number, real name, etc.
    userID: string

    /// User Name, a string with a maximum length of 256 bytes or less.Please do not fill in sensitive user information in this field, including but not limited to mobile phone number, ID number, passport number, real name, etc.
    userName: string
}


/// Stream object.
///
/// Identify an stream object
export interface ZegoStream {

    /// User object instance.Please do not fill in sensitive user information in this field, including but not limited to mobile phone number, ID number, passport number, real name, etc.
    user: ZegoUser

    /// Stream ID, a string of up to 256 characters. You cannot include URL keywords, otherwise publishing stream and playing stream will fails. Only support numbers, English characters and '~', '!', '@', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '&#46;', '<', '>', '/', '\'.
    streamID: string

    /// Stream extra info
    extraInfo: string
}


/// Room extra information.
export interface ZegoRoomExtraInfo {

    /// The key of the room extra information.
    key: string

    /// The value of the room extra information.
    value: string

    /// The user who update the room extra information.Please do not fill in sensitive user information in this field, including but not limited to mobile phone number, ID number, passport number, real name, etc.
    updateUser: ZegoUser

    /// Update time of the room extra information, UNIX timestamp, in milliseconds.
    updateTime: number
}


/// Published stream quality information.
///
/// Audio and video parameters and network quality, etc.
export interface ZegoPublishStreamQuality {

    /// Video capture frame rate. The unit of frame rate is f/s
    videoCaptureFPS: number

    /// Video encoding frame rate. The unit of frame rate is f/s
    videoEncodeFPS: number

    /// Video transmission frame rate. The unit of frame rate is f/s
    videoSendFPS: number

    /// Video bit rate in kbps
    videoKBPS: number

    /// Audio capture frame rate. The unit of frame rate is f/s
    audioCaptureFPS: number

    /// Audio transmission frame rate. The unit of frame rate is f/s
    audioSendFPS: number

    /// Audio bit rate in kbps
    audioKBPS: number

    /// Local to server delay, in milliseconds
    rtt: number

    /// Packet loss rate, in percentage, 0.0 ~ 1.0
    packetLostRate: number

    /// Published stream quality level
    level: ZegoStreamQualityLevel

    /// Whether to enable hardware encoding
    isHardwareEncode: boolean

    /// Video codec ID
    videoCodecID: ZegoVideoCodecID

    /// Total number of bytes sent, including audio, video, SEI
    totalSendBytes: number

    /// Number of audio bytes sent
    audioSendBytes: number

    /// Number of video bytes sent
    videoSendBytes: number
}


/**
 * CDN config object.
 * 
 * Includes CDN URL and authentication parameter string
 */
export interface ZegoCDNConfig {

    /**
     * CDN URL
     */
    url: string

    /**
     * Auth param of URL
     */
    authParam: string
}


/// Relay to CDN info.
///
/// Including the URL of the relaying CDN, relaying state, etc.
export interface ZegoStreamRelayCDNInfo {

    /// URL of publishing stream to CDN
    url: string

    /// State of relaying to CDN
    state: ZegoStreamRelayCDNState

    /// Reason for relay state changed
    updateReason: ZegoStreamRelayCDNUpdateReason

    /// The timestamp when the state changed, UNIX timestamp, in milliseconds.
    stateTime: number
}


/**
 * Advanced player configuration.
 * 
 * Configure playing stream CDN configuration, video layer
 */
export interface ZegoPlayerConfig {

    /**
     * Stream resource mode
     */
    resourceMode: ZegoStreamResourceMode

    /**
     * The CDN configuration for playing stream. If set, the stream is play according to the URL instead of the streamID. After that, the streamID is only used as the ID of SDK internal callback.
     */
    cdnConfig: ZegoCDNConfig
}


/// Played stream quality information.
///
/// Audio and video parameters and network quality, etc.
export interface ZegoPlayStreamQuality {

    /// Video receiving frame rate. The unit of frame rate is f/s
    videoRecvFPS: number

    /// Video dejitter frame rate. The unit of frame rate is f/s
    videoDejitterFPS: number

    /// Video decoding frame rate. The unit of frame rate is f/s
    videoDecodeFPS: number

    /// Video rendering frame rate. The unit of frame rate is f/s
    videoRenderFPS: number

    /// Video bit rate in kbps
    videoKBPS: number

    /// Video break rate, the unit is (number of breaks / every 10 seconds)
    videoBreakRate: number

    /// Audio receiving frame rate. The unit of frame rate is f/s
    audioRecvFPS: number

    /// Audio dejitter frame rate. The unit of frame rate is f/s
    audioDejitterFPS: number

    /// Audio decoding frame rate. The unit of frame rate is f/s
    audioDecodeFPS: number

    /// Audio rendering frame rate. The unit of frame rate is f/s
    audioRenderFPS: number

    /// Audio bit rate in kbps
    audioKBPS: number

    /// Audio break rate, the unit is (number of breaks / every 10 seconds)
    audioBreakRate: number

    /// Server to local delay, in milliseconds
    rtt: number

    /// Packet loss rate, in percentage, 0.0 ~ 1.0
    packetLostRate: number

    /// Delay from peer to peer, in milliseconds
    peerToPeerDelay: number

    /// Packet loss rate from peer to peer, in percentage, 0.0 ~ 1.0
    peerToPeerPacketLostRate: number

    /// Published stream quality level
    level: ZegoStreamQualityLevel

    /// Delay after the data is received by the local end, in milliseconds
    delay: number

    /// The difference between the video timestamp and the audio timestamp, used to reflect the synchronization of audio and video, in milliseconds. This value is less than 0 means the number of milliseconds that the video leads the audio, greater than 0 means the number of milliseconds that the video lags the audio, and 0 means no difference. When the absolute value is less than 200, it can basically be regarded as synchronized audio and video, when the absolute value is greater than 200 for 10 consecutive seconds, it can be regarded as abnormal
    avTimestampDiff: number

    /// Whether to enable hardware decoding
    isHardwareDecode: boolean

    /// Video codec ID
    videoCodecID: ZegoVideoCodecID

    /// Total number of bytes received, including audio, video, SEI
    totalRecvBytes: number

    /// Number of audio bytes received
    audioRecvBytes: number

    /// Number of video bytes received
    videoRecvBytes: number
}


/// Device Info.
///
/// Including device ID and name
export interface ZegoDeviceInfo {

    /// Device ID
    deviceID: string

    /// Device name
    deviceName: string
}


/// System performance monitoring status
export interface ZegoPerformanceStatus {

    /// Current CPU usage of the app, value range [0, 1]
    cpuUsageApp: number

    /// Current CPU usage of the system, value range [0, 1]
    cpuUsageSystem: number

    /// Current memory usage of the app, value range [0, 1]
    memoryUsageApp: number

    /// Current memory usage of the system, value range [0, 1]
    memoryUsageSystem: number

    /// Current memory used of the app, in MB
    memoryUsedApp: number
}


/// Beauty configuration options.
///
/// Configure the parameters of skin peeling, whitening and sharpening
export interface ZegoBeautifyOption {

    /// The sample step size of beauty peeling, the value range is [0,1], default 0.2
    polishStep: number

    /// Brightness parameter for beauty and whitening, the larger the value, the brighter the brightness, ranging from [0,1], default 0.5
    whitenFactor: number

    /// Beauty sharpening parameter, the larger the value, the stronger the sharpening, value range [0,1], default 0.1
    sharpenFactor: number
}


/**
 * Mix stream audio configuration.
 * 
 * Configure video frame rate, bitrate, and resolution for mixer task
 */
export interface ZegoMixerAudioConfig {

    /**
     * Audio bitrate in kbps, default is 48 kbps, cannot be modified after starting a mixer task
     */
    bitrate: number

    /**
     * Audio channel, default is Mono
     */
    channel: ZegoAudioChannel

    /**
     * codec ID, default is ZegoAudioCodecIDDefault
     */
    codecID: ZegoAudioCodecID

    /**
     * Multi-channel audio stream mixing mode. If [ZegoAudioMixMode] is selected as [Focused], the SDK will select 4 input streams with [isAudioFocus] set as the focus voice highlight. If it is not selected or less than 4 channels are selected, it will automatically fill in 4 channels
     */
    mixMode: ZegoAudioMixMode
}

/**
 * Mix stream video config object.
 * 
 * Configure video frame rate, bitrate, and resolution for mixer task
 */
export interface ZegoMixerVideoConfig {

    /**
     * Video FPS, cannot be modified after starting a mixer task
     */
    fps: number

    /**
     * Video bitrate in kbps
     */
    bitrate: number

    /**
     * video width
     */
    width: number

    /**
     * video height
     */
    height: number
}


/// 
///
/// 
/**
 * Mixer input.
 * 
 * Configure the mix stream input stream ID, type, and the layout
 */
export interface ZegoMixerInput {

    /**
     * Stream ID, a string of up to 256 characters. You cannot include URL keywords, otherwise publishing stream and playing stream will fails. Only support numbers, English characters and '~', '!', '@', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '&#46;', '<', '>', '/', '\'.
     */
    streamID: string

    /**
     * Mix stream content type
     */
    contentType: ZegoMixerInputContentType

    /**
     * Stream layout. When the mixed stream is an audio stream (that is, the ContentType parameter is set to the audio mixed stream type), the layout field is not processed inside the SDK, and there is no need to pay attention to this parameter.
     */
    layout: ZegoRect

    /**
     * If enable soundLevel in mix stream task, an unique soundLevelID is need for every stream
     */
    soundLevelID: number

    /**
     * Whether the focus voice is enabled in the current input stream, the sound of this stream will be highlighted if enabled
     */
    isAudioFocus: boolean
}


/**
 * Mixer output object.
 * 
 * Configure mix stream output target URL or stream ID
 */
export interface ZegoMixerOutput {

    /**
     * Mix stream output target, URL or stream ID, if set to be URL format, only RTMP URL surpported, for example rtmp://xxxxxxxx
     */
    target: number
}


/// Watermark object.
///
/// Configure a watermark image URL and the layout of the watermark in the screen.
export interface ZegoWatermark {

    /// Watermark image URL, only png or jpg format surpport.
    imageURL: string

    /// Watermark image layout
    layout: ZegoRect
}

/**
 * Mix stream task object.
 * 
 * This class is the configuration class of the stream mixing task. When a stream mixing task is requested to the ZEGO RTC server, the configuration of the stream mixing task is required.
 * This class describes the detailed configuration information of this stream mixing task.
 */
export interface ZegoMixerTask {

    /**
     * Mix stream task ID, a string of up to 256 characters. You cannot include URL keywords, otherwise publishing stream and playing stream will fails. Only support numbers, English characters and '~', '!', '@', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '&#46;', '<', '>', '/', '\'.
     */
    taskID: string

    /**
     * The audio configuration of the mix stream task object
     */
    audioConfig: ZegoMixerAudioConfig

    /**
     * The video configuration of the mix stream task object
     */
    videoConfig: ZegoMixerVideoConfig

    /**
     * The input stream list for the mix stream task object
     */
    inputList: ZegoMixerInput[]

    /**
     * The output list of the mix stream task object
     */
    outputList: ZegoMixerOutput[]

    /**
     * The watermark of the mix stream task object
     */
    watermark: ZegoWatermark

    /**
     * The background image of the mix stream task object
     */
    backgroundImageURL: string

    /**
     * Enable or disable sound level callback for the task. If enabled, then the remote player can get the soundLevel of every stream in the inputlist by [onMixerSoundLevelUpdate] callback.
     */
    enableSoundLevel: boolean

    /**
     * The advanced configuration, such as specifying video encoding and others. If you need to use it, contact ZEGO technical support.
     */
    advancedConfig: {[key: string]: string}
}


/**
 * Auto mix stream task object.
 * 
 * Description: When using [StartAutoMixerTask] function to start an auto stream mixing task to the ZEGO RTC server, user need to set this parameter to configure the auto stream mixing task, including the task ID, room ID, audio configuration, output stream list, and whether to enable the sound level callback.
 * Use cases: This configuration is required when an auto stream mixing task is requested to the ZEGO RTC server.
 * Caution: As an argument passed when [StartAutoMixerTask] function is called.
 */
export interface ZegoAutoMixerTask {

    /**
     * The taskID of the auto mixer task.Description: Auto stream mixing task id, must be unique in a room.Use cases: User need to set this parameter when initiating an auto stream mixing task.Required: Yes.Recommended value: Set this parameter based on requirements.Value range: A string up to 256 bytes.Caution: When starting a new auto stream mixing task, only one auto stream mixing task ID can exist in a room, that is, to ensure the uniqueness of task ID. You are advised to associate task ID with room ID. You can directly use the room ID as the task ID.Cannot include URL keywords, for example, 'http' and '?' etc, otherwise publishing stream and playing stream will fail. Only support numbers, English characters and '~', '!', '@', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '.', '<', '>', '/', '\'.
     */
    taskID: string
  
    /**
     * The roomID of the auto mixer task.Description: Auto stream mixing task id.Use cases: User need to set this parameter when initiating an auto stream mixing task.Required: Yes.Recommended value: Set this parameter based on requirements.Value range: A string up to 128 bytes.Caution: Only support numbers, English characters and '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '-', '`', ';', '’', ',', '.', '<', '>', '/', '\'.
     */
    roomID: string
  
    /**
     * The audio config of the auto mixer task.Description: The audio config of the auto mixer task.Use cases: If user needs special requirements for the audio config of the auto stream mixing task, such as adjusting the audio bitrate, user can set this parameter as required. Otherwise, user do not need to set this parameter.Required: No.Default value: The default audio bitrate is `48 kbps`, the default audio channel is `ZEGO_AUDIO_CHANNEL_MONO`, the default encoding ID is `ZEGO_AUDIO_CODEC_ID_DEFAULT`, and the default multi-channel audio stream mixing mode is `ZEGO_AUDIO_MIX_MODE_RAW`.Recommended value: Set this parameter based on requirements.
     */
    audioConfig: ZegoMixerAudioConfig
  
    /**
     * The output list of the auto mixer task.Description: The output list of the auto stream mixing task, items in the list are URL or stream ID, if the item set to be URL format, only RTMP URL surpported, for example rtmp://xxxxxxxx.Use cases: User need to set this parameter to specify the mix stream output target when starting an auto stream mixing task.Required: Yes.
     */
    outputList: ZegoMixerOutput[]
  
    /**
     * Enable or disable sound level callback for the task. If enabled, then the remote player can get the sound level of every stream in the inputlist by [onAutoMixerSoundLevelUpdate] callback.Description: Enable or disable sound level callback for the task.If enabled, then the remote player can get the sound level of every stream in the inputlist by [onAutoMixerSoundLevelUpdate] callback.Use cases: This parameter needs to be configured if user need the sound level information of every stream when an auto stream mixing task started.Required: No.Default value: `false`.Recommended value: Set this parameter based on requirements.
     */
    enableSoundLevel: boolean
}

/// Broadcast message info.
///
/// The received object of the room broadcast message, including the message content, message ID, sender, sending time
export interface ZegoBroadcastMessageInfo {

    /// message content
    message: string

    /// message id
    messageID: number

    /// Message send time, UNIX timestamp, in milliseconds.
    sendTime: number

    /// Message sender.Please do not fill in sensitive user information in this field, including but not limited to mobile phone number, ID number, passport number, real name, etc.
    fromUser: ZegoUser
}


/// Barrage message info.
///
/// The received object of the room barrage message, including the message content, message ID, sender, sending time
export interface ZegoBarrageMessageInfo {

    /// message content
    message: string

    /// message id
    messageID: string

    /// Message send time, UNIX timestamp, in milliseconds.
    sendTime: number

    /// Message sender.Please do not fill in sensitive user information in this field, including but not limited to mobile phone number, ID number, passport number, real name, etc.
    fromUser: ZegoUser
}


/// Object for video frame fieldeter.
///
/// Including video frame format, width and height, etc.
export interface ZegoVideoFrameParam {

    /// Video frame format
    format: ZegoVideoFrameFormat

    /// Number of bytes per line (for example: BGRA only needs to consider strides [0], I420 needs to consider strides [0,1,2])
    strides: number

    /// Video frame size
    size: {width: number, height: number}
}


/// Object for video encoded frame fieldeter.
///
/// Including video encoded frame format, width and height, etc.
export interface ZegoVideoEncodedFrameParam {

    /// Video encoded frame format
    format: ZegoVideoEncodedFrameFormat

    /// Whether it is a keyframe
    isKeyFrame: boolean

    /// Video frame rotation
    rotation: number

    /// Video frame size
    size: ZegoSize

    /// SEI data
    SEIData: string
}


/// Parameter object for audio frame.
///
/// Including the sampling rate and channel of the audio frame
export interface ZegoAudioFrameParam {

    /// Sampling Rate
    sampleRate: ZegoAudioSampleRate

    /// Audio channel, default is Mono
    channel: ZegoAudioChannel
}


/// Audio configuration.
///
/// Configure audio bitrate, audio channel, audio encoding for publishing stream
export interface ZegoAudioConfig {

    /// Audio bitrate in kbps, default is 48 kbps. The settings before and after publishing stream can be effective
    bitrate: number

    /// Audio channel, default is Mono. The setting only take effect before publishing stream
    channel: ZegoAudioChannel

    /// codec ID, default is ZegoAudioCodecIDDefault. The setting only take effect before publishing stream
    codecID: ZegoAudioCodecID

    presetConfig(preset: ZegoAudioConfigPreset): Promise<void>
}


/// Audio mixing data.
export interface ZegoAudioMixingData {

    /// Audio PCM data that needs to be mixed into the stream
    audioData: string

    /// Audio data attributes, including sample rate and number of channels. Currently supports 16k 32k 44.1k 48k sampling rate, mono or stereo channel, 16-bit deep PCM data. Developers need to explicitly specify audio data attributes, otherwise mixing will not take effect.
    param: ZegoAudioFrameParam

    /// SEI data, used to transfer custom data. When audioData is null, SEIData will not be sent
    SEIData: string
}


/// Customize the audio processing configuration object.
///
/// Including custom audio acquisition type, sampling rate, channel number, sampling number and other parameters
export interface ZegoCustomAudioProcessConfig {

    /// Sampling rate, the sampling rate of the input data expected by the audio pre-processing module in App. If 0, the default is the SDK internal sampling rate.
    sampleRate: ZegoAudioSampleRate

    /// Number of sound channels, the expected number of sound channels for input data of the audio pre-processing module in App. If 0, the default is the number of internal channels in the SDK
    channel: ZegoAudioChannel

    /// The number of samples required to encode a frame; When encode = false, if samples = 0, the SDK will use the internal sample number, and the SDK will pass the audio data to the external pre-processing module. If the samples! = 0 (the effective value of samples is between [160, 2048]), and the SDK will send audio data to the external preprocessing module that sets the length of sample number. Encode = true, the number of samples for a frame of AAC encoding can be set as (480/512/1024/1960/2048)
    samples: number
}


/// File recording progress.
export interface ZegoDataRecordProgress {

    /// Current recording duration in milliseconds
    duration: number

    /// Current recording file size in byte
    currentFileSize: number
}


/// Network probe config
export interface ZegoNetworkProbeConfig {

    /// Whether do traceroute, enabling tranceRoute will significantly increase network detection time
    enableTraceroute: boolean
}


/// http probe result
export interface ZegoNetworkProbeHttpResult {

    /// http probe errorCode, 0 means the connection is normal
    errorCode: number

    /// http request cost time, the unit is millisecond
    requestCostTime: number
}


/// tcp probe result
export interface ZegoNetworkProbeTcpResult {

    /// tcp probe errorCode, 0 means the connection is normal
    errorCode: number

    /// tcp rtt, the unit is millisecond
    rtt: number

    /// tcp connection cost time, the unit is millisecond
    connectCostTime: number
}


/// udp probe result
export interface ZegoNetworkProbeUdpResult {

    /// udp probe errorCode, 0 means the connection is normal
    errorCode: number

    /// The total time that the SDK send udp data to server and receive a reply, the unit is millisecond
    rtt: number
}


/// traceroute result
///
/// Jump up to 30 times. The traceroute result is for reference and does not represent the final network connection result. The priority is http, tcp, udp probe result.
export interface ZegoNetworkProbeTracerouteResult {

    /// traceroute error code, 0 means normal
    errorCode: number

    /// Time consumed by trace route, the unit is millisecond
    tracerouteCostTime: number
}


/// Network probe result
export interface ZegoNetworkProbeResult {

    /// http probe result
    httpProbeResult: ZegoNetworkProbeHttpResult

    /// tcp probe result
    tcpProbeResult: ZegoNetworkProbeTcpResult

    /// udp probe result
    udpProbeResult: ZegoNetworkProbeUdpResult

    /// traceroute result
    tracerouteResult: ZegoNetworkProbeTracerouteResult
}


/// Network speed test config
export interface ZegoNetworkSpeedTestConfig {

    /// Test uplink or not
    testUplink: boolean

    /// The unit is kbps. Recommended to use the bitrate in ZegoVideoConfig when call startPublishingStream to determine whether the network uplink environment is suitable.
    expectedUplinkBitrate: number

    /// Test downlink or not
    testDownlink: boolean

    /// The unit is kbps. Recommended to use the bitrate in ZegoVideoConfig when call startPublishingStream to determine whether the network downlink environment is suitable.
    expectedDownlinkBitrate: number
}


/// test connectivity result
export interface ZegoTestNetworkConnectivityResult {

    /// connect cost
    connectCost: number
}


/// network speed test quality
export interface ZegoNetworkSpeedTestQuality {

    /// Time to connect to the server, in milliseconds. During the speed test, if the network connection is disconnected, it will automatically initiate a reconnection, and this variable will be updated accordingly.
    connectCost: number

    /// rtt, in milliseconds
    rtt: number

    /// packet lost rate. in percentage, 0.0 ~ 1.0
    packetLostRate: number
}


/// AudioEffectPlayer play configuration.
export interface ZegoAudioEffectPlayConfig {

    /// The number of play counts. When set to 0, it will play in an infinite loop until the user invoke [stop]. The default is 1, which means it will play only once.
    playCount: number

    /// Whether to mix audio effects into the publishing stream, the default is false.
    isPublishOut: boolean
}

/// Precise seek configuration
export interface ZegoAccurateSeekConfig {

    /// The timeout time for precise search; if not set, the SDK internal default is set to 5000 milliseconds, the effective value range is [2000, 10000], the unit is ms
    timeout: number
}


/// Media player network cache information
export interface ZegoNetWorkResourceCache {

    /// Cached duration, unit ms
    time: number

    /// Cached size, unit byte
    size: number
}

export interface ZegoMediaPlayer {
	
	/**
	 * Register the event handler of mediaplayer
	 * 
	 * @param event event type 
	 * @param callback callback
	 */
	on<MediaPlayerEventType extends keyof ZegoMediaPlayerListener>(event: MediaPlayerEventType, callback: ZegoMediaPlayerListener[MediaPlayerEventType]): void;
	
    /**
     * Unregister the event handler of mediaplayer
     * 
     * @param event event type 
     * @param callback callback
     */
	off<MediaPlayerEventType extends keyof ZegoMediaPlayerListener>(event: MediaPlayerEventType, callback?: ZegoMediaPlayerListener[MediaPlayerEventType]): void;

    /**
     * Load media resource.
     *
     * Yon can pass the absolute path of the local resource or the URL of the network resource
     *
     * @param path the absolute path of the local resource or the URL of the network resource
     * @return the result of calling this API
     */
    loadResource(path: string): Promise<ZegoMediaPlayerLoadResourceResult>
  
    /**
     * Start playing.
     *
     * You need to load resources before playing
     */
    start(): Promise<void>

    /**
     * Stop playing.
     */
    stop(): Promise<void>

    /**
     * Pause playing.
     */
    pause(): Promise<void>

    /**
     * resume playing.
     */
    resume(): Promise<void>
	
    /**
     * Set the view of the player playing video.
     *
     * @param view Video rendered canvas object ID
     */
    setPlayerView(playerID: number): Promise<void>;

	/**
     * Set the specified playback progress.
     *
     * Unit is millisecond
     *
     * @param millisecond Point in time of specified playback progress
     * @return the result of calling this API
     */
    seekTo(millisecond: number): Promise<ZegoMediaPlayerSeekToResult>

    /**
     * Whether to repeat playback.
     *
     * @param enable repeat playback flag. The default is false.
     */
    enableRepeat(enable: boolean): Promise<void>

    /**
     * Whether to mix the player's sound into the stream being published.
     *
     * @param enable Aux audio flag. The default is false.
     */
    enableAux(enable: boolean): Promise<void>

    /**
     * Whether to play locally silently.
     *
     * If [enableAux] switch is turned on, there is still sound in the publishing stream. The default is false.
     *
     * @param mute Mute local audio flag, The default is false.
     */
    muteLocal(mute: boolean): Promise<void>

    /**
     * Set mediaplayer volume. Both the local play volume and the publish volume are set.
     *
     * @param volume The range is 0 ~ 200. The default is 60.
     */
    setVolume(volume: number): Promise<void>

    /**
     * Set mediaplayer local play volume.
     *
     * @param volume The range is 0 ~ 200. The default is 60.
     */
    setPlayVolume(volume: number): Promise<void>

    /**
     * Set mediaplayer publish volume.
     *
     * @param volume The range is 0 ~ 200. The default is 60.
     */
    setPublishVolume(volume: number): Promise<void>

	/**
     * Set playback progress callback interval.
     *
     * This function can control the callback frequency of [onMediaPlayerPlayingProgress]. When the callback interval is set to 0, the callback is stopped. The default callback interval is 1s
     * This callback are not returned exactly at the set callback interval, but rather at the frequency at which the audio or video frames are processed to determine whether the callback is needed to call
     *
     * @param millisecond Interval of playback progress callback in milliseconds
     */
    setProgressInterval(millisecond: number): Promise<void>

    /**
     * Set the audio track of the playback file.
     * 
     * @param index Audio track index, the number of audio tracks can be obtained through the [audioTrackCount].
     */
    setAudioTrackIndex(index: number): Promise<void>

	/**
	 * Setting up the specific voice changer parameters.
	 * 
	 * @param param Voice changer parameters
	 * @param audioChannel The audio channel to be voice changed
	 */
    setVoiceChangerParam(param: ZegoVoiceChangerParam, audioChannel: ZegoMediaPlayerAudioChannel): Promise<void>

	/**
	 * Take a screenshot of the current playing screen of the media player.
	 * 
	 * Only in the case of calling `setPlayerCanvas` to set the display controls and the playback state, can the screenshot be taken normally
	 * 
	 * @param callback The callback of the screenshot of the media player playing screen
	 */
    takeSnapshot(): Promise<ZegoMediaPlayerTakeSnapshotResult>

	/**
	 * Open precise seek and set relevant attributes.
	 * 
	 * Call the setting before loading the resource. After setting, it will be valid throughout the life cycle of the media player. For multiple calls to ‘enableAccurateSeek’, the configuration is an overwrite relationship, and each call to ‘enableAccurateSeek’ only takes effect on the resources loaded later.
	 * 
	 * @param enable Whether to enable accurate seek
	 * @param config The property setting of precise seek is valid only when enable is YES.
	 */
    enableAccurateSeek(enable: boolean, config: ZegoAccurateSeekConfig): Promise<void>

	/**
	 * Set the maximum cache duration and cache data size of web materials.
	 * 
	 * The setting must be called before loading the resource, and it will take effect during the entire life cycle of the media player.
	 * Time and size are not allowed to be 0 at the same time. The SDK internal default time is 5000, and the size is 15*1024*1024 byte.When one of time and size reaches the set value first, the cache will stop.
	 * 
	 * @param time The maximum length of the cache time, in ms, the SDK internal default is 5000; the effective value is greater than or equal to 2000; if you fill in 0, it means no limit.
	 * @param size The maximum size of the cache, the unit is byte, the internal default size of the SDK is 15*1024*1024 byte; the effective value is greater than or equal to 5000000, if you fill in 0, it means no limit.
	 */
    setNetworkResourceMaxCache(time: number, size: number): Promise<void>

	/**
	 * Get the playable duration and size of the cached data of the current network material cache queue
	 * 
	 * @return Returns the current cached information, including the length of time the data can be played and the size of the cached data.
	 */
    getNetworkResourceCache(): Promise<ZegoNetWorkResourceCache>

	/**
	 * Use this interface to set the cache threshold that the media player needs to resume playback. The SDK default value is 5000ms，The valid value is greater than or equal to 1000ms
	 * 
	 * @param threshold Threshold that needs to be reached to resume playback, unit ms.
	 */
    setNetworkBufferThreshold(threshold: number): Promise<void>

    /**
     * Gets the current local playback volume of the mediaplayer, the range is 0 ~ 200, with the default value of 60.
     * 
     * @return current play volume
     */
    getPlayVolume(): Promise<number>

    /**
     * Gets the current publish volume of the mediaplayer, the range is 0 ~ 200, with the default value of 60.
     * @return current play volume
     */
    getPublishVolume(): Promise<number>

    /**
     * Get the total progress of your media resources.
     *
     * You should load resource before invoking this function, otherwise the return value is 0
     *
     * @return Total duration. The unit is millisecond
     */
    getTotalDuration(): Promise<number>

    /**
     * Get current playing progress.
     *
     * You should load resource before invoking this function, otherwise the return value is 0
     * 
     * @return Current progress. The unit is millisecond
     */
    getCurrentProgress(): Promise<number>

    /**
     * Get the count of audio tracks of the current media file.
     * 
     * @return The count of audio tracks
     */
    getAudioTrackCount(): Promise<number>

    /**
     * Get the current state of mediaplayer.
     * 
     * @return Current state
     */
    getCurrentState(): Promise<ZegoMediaPlayerState>

	/**
     * Get media player index.
     */
    getIndex(): number
}


package com.zego.express;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Application;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Rect;
import android.os.Build;
import android.support.v4.content.ContextCompat;
import android.util.Base64;
import android.util.Log;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import com.taobao.weex.annotation.JSMethod;
import com.taobao.weex.bridge.JSCallback;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import im.zego.zegoexpress.ZegoAudioEffectPlayer;
import im.zego.zegoexpress.ZegoExpressEngine;
import im.zego.zegoexpress.ZegoMediaPlayer;
import im.zego.zegoexpress.callback.IZegoApiCalledEventHandler;
import im.zego.zegoexpress.callback.IZegoAudioEffectPlayerLoadResourceCallback;
import im.zego.zegoexpress.callback.IZegoAudioEffectPlayerSeekToCallback;
import im.zego.zegoexpress.callback.IZegoDestroyCompletionCallback;
import im.zego.zegoexpress.callback.IZegoEventHandler;
import im.zego.zegoexpress.callback.IZegoIMSendBarrageMessageCallback;
import im.zego.zegoexpress.callback.IZegoIMSendBroadcastMessageCallback;
import im.zego.zegoexpress.callback.IZegoIMSendCustomCommandCallback;
import im.zego.zegoexpress.callback.IZegoMediaPlayerAudioHandler;
import im.zego.zegoexpress.callback.IZegoMediaPlayerEventHandler;
import im.zego.zegoexpress.callback.IZegoMediaPlayerLoadResourceCallback;
import im.zego.zegoexpress.callback.IZegoMediaPlayerSeekToCallback;
import im.zego.zegoexpress.callback.IZegoMediaPlayerTakeSnapshotCallback;
import im.zego.zegoexpress.callback.IZegoMediaPlayerVideoHandler;
import im.zego.zegoexpress.callback.IZegoMixerStartCallback;
import im.zego.zegoexpress.callback.IZegoMixerStopCallback;
import im.zego.zegoexpress.callback.IZegoPlayerTakeSnapshotCallback;
import im.zego.zegoexpress.callback.IZegoPublisherSetStreamExtraInfoCallback;
import im.zego.zegoexpress.callback.IZegoPublisherTakeSnapshotCallback;
import im.zego.zegoexpress.callback.IZegoPublisherUpdateCdnUrlCallback;
import im.zego.zegoexpress.callback.IZegoRoomSetRoomExtraInfoCallback;
import im.zego.zegoexpress.constants.ZegoAECMode;
import im.zego.zegoexpress.constants.ZegoANSMode;
import im.zego.zegoexpress.constants.ZegoAudioCaptureStereoMode;
import im.zego.zegoexpress.constants.ZegoAudioChannel;
import im.zego.zegoexpress.constants.ZegoAudioCodecID;
import im.zego.zegoexpress.constants.ZegoAudioRoute;
import im.zego.zegoexpress.constants.ZegoCapturePipelineScaleMode;
import im.zego.zegoexpress.constants.ZegoEngineState;
import im.zego.zegoexpress.constants.ZegoMediaPlayerAudioChannel;
import im.zego.zegoexpress.constants.ZegoMediaPlayerNetworkEvent;
import im.zego.zegoexpress.constants.ZegoMediaPlayerState;
import im.zego.zegoexpress.constants.ZegoMixerInputContentType;
import im.zego.zegoexpress.constants.ZegoOrientation;
import im.zego.zegoexpress.constants.ZegoPlayerMediaEvent;
import im.zego.zegoexpress.constants.ZegoPlayerState;
import im.zego.zegoexpress.constants.ZegoPublishChannel;
import im.zego.zegoexpress.constants.ZegoPublisherState;
import im.zego.zegoexpress.constants.ZegoRemoteDeviceState;
import im.zego.zegoexpress.constants.ZegoReverbPreset;
import im.zego.zegoexpress.constants.ZegoRoomState;
import im.zego.zegoexpress.constants.ZegoSEIType;
import im.zego.zegoexpress.constants.ZegoScenario;
import im.zego.zegoexpress.constants.ZegoStreamResourceMode;
import im.zego.zegoexpress.constants.ZegoTrafficControlFocusOnMode;
import im.zego.zegoexpress.constants.ZegoTrafficControlMinVideoBitrateMode;
import im.zego.zegoexpress.constants.ZegoUpdateType;
import im.zego.zegoexpress.constants.ZegoVideoCodecID;
import im.zego.zegoexpress.constants.ZegoVideoConfigPreset;
import im.zego.zegoexpress.constants.ZegoVideoMirrorMode;
import im.zego.zegoexpress.constants.ZegoVideoStreamType;
import im.zego.zegoexpress.constants.ZegoVoiceChangerPreset;
import im.zego.zegoexpress.entity.ZegoAccurateSeekConfig;
import im.zego.zegoexpress.entity.ZegoAudioConfig;
import im.zego.zegoexpress.entity.ZegoAudioEffectPlayConfig;
import im.zego.zegoexpress.entity.ZegoAudioFrameParam;
import im.zego.zegoexpress.entity.ZegoAutoMixerTask;
import im.zego.zegoexpress.entity.ZegoBarrageMessageInfo;
import im.zego.zegoexpress.entity.ZegoBeautifyOption;
import im.zego.zegoexpress.entity.ZegoBroadcastMessageInfo;
import im.zego.zegoexpress.entity.ZegoCDNConfig;
import im.zego.zegoexpress.entity.ZegoCanvas;
import im.zego.zegoexpress.entity.ZegoEngineConfig;
import im.zego.zegoexpress.entity.ZegoLogConfig;
import im.zego.zegoexpress.entity.ZegoMixerAudioConfig;
import im.zego.zegoexpress.entity.ZegoMixerInput;
import im.zego.zegoexpress.entity.ZegoMixerOutput;
import im.zego.zegoexpress.entity.ZegoMixerTask;
import im.zego.zegoexpress.entity.ZegoMixerVideoConfig;
import im.zego.zegoexpress.entity.ZegoNetWorkResourceCache;
import im.zego.zegoexpress.entity.ZegoPlayStreamQuality;
import im.zego.zegoexpress.entity.ZegoPlayerConfig;
import im.zego.zegoexpress.entity.ZegoPublishStreamQuality;
import im.zego.zegoexpress.entity.ZegoReverbAdvancedParam;
import im.zego.zegoexpress.entity.ZegoReverbEchoParam;
import im.zego.zegoexpress.entity.ZegoRoomConfig;
import im.zego.zegoexpress.entity.ZegoRoomExtraInfo;
import im.zego.zegoexpress.entity.ZegoSEIConfig;
import im.zego.zegoexpress.entity.ZegoStream;
import im.zego.zegoexpress.entity.ZegoStreamRelayCDNInfo;
import im.zego.zegoexpress.entity.ZegoUser;
import im.zego.zegoexpress.entity.ZegoVideoConfig;
import im.zego.zegoexpress.entity.ZegoVideoFrameParam;
import im.zego.zegoexpress.entity.ZegoVoiceChangerParam;
import im.zego.zegoexpress.entity.ZegoWatermark;
import io.dcloud.feature.uniapp.common.UniModule;

public class ZegoExpressUniAppEngine extends UniModule {
    static HashMap<String, ZegoPlayStreamStore> playViewMap = new HashMap<>();
    static HashMap<String, ZegoCanvas> previewViewMap = new HashMap<>();
    static HashMap<String, ZegoCanvas> mediaPlayerViewMap = new HashMap<>();

    HashMap<String, ZegoMediaPlayer> mediaPlayerDict = new HashMap<>();
    HashMap<String, ZegoAudioEffectPlayer> audioEffectPlayerDict = new HashMap<>();

    private boolean mIsInited = false;

    /* send event to js */
    // 引擎回调事件
    private void sendEvent(String eventName, Object... varargs) {
        List<Object> args = Arrays.asList(varargs);
        Map<String, Object> map = new HashMap<>();
        map.put("data", args);
        if (!mWXSDKInstance.isDestroy()) {
            mWXSDKInstance.fireGlobalEventCallback(prefix() + eventName, map);
        }
    }

    // 媒体播放器回调事件
    private void sendMediaPlayerEvent(String eventName, Integer index, Object... varargs) {
        List<Object> args = Arrays.asList(varargs);
        Map<String, Object> map = new HashMap<>();
        map.put("data", args);
        map.put("idx", index);
        if (!mWXSDKInstance.isDestroy()) {
            mWXSDKInstance.fireGlobalEventCallback(prefix() + eventName, map);
        }
    }

    private void callbackNotNull(JSCallback callback, Object o) {
        if (callback != null && !mWXSDKInstance.isDestroy()) {
            callback.invoke(o);
        }
    }

    private void callbackNotNull(JSCallback callback) {
        callbackNotNull(callback, null);
    }

    @JSMethod(uiThread = false)
    public String prefix() {
        return "im.zego.express";
    }

    @SuppressWarnings("unused")
    @JSMethod(uiThread = false)
    public void callMethod(JSONObject params, JSCallback callback) {
        String methodName = params.getString("method");
        JSONObject args = params.getJSONObject("args");
        try {
            if (args != null) {
                Method method = this.getClass().getDeclaredMethod(methodName, JSONObject.class, JSCallback.class);
                method.invoke(this, args, callback);
            } else {
                Method method = this.getClass().getDeclaredMethod(methodName, JSCallback.class);
                method.invoke(this, callback);
            }
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        }
    }

    /** Engine */
    @SuppressWarnings("unused")
    public void createEngine(JSONObject params, JSCallback callback) {
        final long appID = params.getLong("appID");
        final String appSign = params.getString("appSign");
        final boolean isTestEnv = params.getBoolean("isTestEnv");
        int scenario = params.getIntValue("scenario");

        ZegoExpressEngine.setApiCalledCallback(new IZegoApiCalledEventHandler() {
            @Override
            public void onApiCalledResult(int errorCode, String funcName, String info) {
                super.onApiCalledResult(errorCode, funcName, info);
                sendEvent("apiCalledResult", errorCode, funcName, info);
            }
        });

        ZegoExpressEngine.createEngine(appID, appSign, isTestEnv, ZegoScenario.getZegoScenario(scenario), (Application)this.mWXSDKInstance.getContext().getApplicationContext(), new IZegoEventHandler() {
            @Override
            public void onDebugError(int errorCode, String funcName, String info) {
                super.onDebugError(errorCode, funcName, info);
                sendEvent("debugError", errorCode, funcName, info);
            }

            @Override
            public void onEngineStateUpdate(ZegoEngineState state) {
                super.onEngineStateUpdate(state);
                sendEvent("engineStateUpdate", state.value());
            }

            @Override
            public void onRoomStateUpdate(String roomID, ZegoRoomState state, int errorCode, org.json.JSONObject extendedData) {
                super.onRoomStateUpdate(roomID, state, errorCode, extendedData);
                sendEvent("roomStateUpdate", roomID, state.value(), errorCode, JSONObject.parse(extendedData.toString()));
            }

            @Override
            public void onRoomUserUpdate(String roomID, ZegoUpdateType updateType, ArrayList<ZegoUser> userList) {
                super.onRoomUserUpdate(roomID, updateType, userList);

                JSONArray userListArray = new JSONArray();
                for (ZegoUser user : userList) {
                    JSONObject userMap = new JSONObject();
                    userMap.put("userID", user.userID);
                    userMap.put("userName", user.userName);
                    userListArray.add(userMap);
                }
                sendEvent("roomUserUpdate", roomID, updateType.value(), userListArray);
            }


            @Override
            public void onRoomOnlineUserCountUpdate(String roomID, int count) {
                super.onRoomOnlineUserCountUpdate(roomID, count);
                sendEvent("roomOnlineUserCountUpdate", roomID, count);
            }

            @Override
            public void onRoomExtraInfoUpdate(String roomID, ArrayList<ZegoRoomExtraInfo> roomExtraInfoList) {
                super.onRoomExtraInfoUpdate(roomID, roomExtraInfoList);
                JSONArray roomExtraInfoArray = new JSONArray();
                for(ZegoRoomExtraInfo info : roomExtraInfoList) {
                    JSONObject infoMap = new JSONObject();
                    infoMap.put("key", info.key);
                    infoMap.put("value", info.value);
                    infoMap.put("updateTime", info.updateTime);

                    JSONObject userMap = new JSONObject();
                    userMap.put("userID", info.updateUser.userID);
                    userMap.put("userName", info.updateUser.userName);
                    infoMap.put("updateUser", userMap);
                    roomExtraInfoArray.add(infoMap);
                }
                sendEvent("roomExtraInfoUpdate", roomID, roomExtraInfoArray);
            }

            @Override
            public void onRoomStreamUpdate(String roomID, ZegoUpdateType updateType, ArrayList<ZegoStream> streamList, org.json.JSONObject extendedData) {
                super.onRoomStreamUpdate(roomID, updateType, streamList, extendedData);
                JSONArray streamListArray = new JSONArray();
                for(ZegoStream stream : streamList) {
                    JSONObject streamMap = new JSONObject();
                    streamMap.put("streamID", stream.streamID);
                    streamMap.put("extraInfo", stream.extraInfo);

                    JSONObject userMap = new JSONObject();
                    userMap.put("userID", stream.user.userID);
                    userMap.put("userName", stream.user.userName);
                    streamMap.put("user", userMap);
                    streamListArray.add(streamMap);
                }
                sendEvent("roomStreamUpdate", roomID, updateType.value(), streamListArray, JSONObject.parse(extendedData.toString()));
            }

            @Override
            public void onRoomStreamExtraInfoUpdate(String roomID, ArrayList<ZegoStream> streamList) {
                super.onRoomStreamExtraInfoUpdate(roomID, streamList);
                JSONArray streamListArray = new JSONArray();
                for(ZegoStream stream : streamList) {
                    JSONObject streamMap = new JSONObject();
                    streamMap.put("streamID", stream.streamID);
                    streamMap.put("extraInfo", stream.extraInfo);

                    JSONObject userMap = new JSONObject();
                    userMap.put("userID", stream.user.userID);
                    userMap.put("userName", stream.user.userName);
                    streamMap.put("user", userMap);
                    streamListArray.add(streamMap);
                }
                sendEvent("roomStreamExtraInfoUpdate", roomID, streamListArray);
            }

            @Override
            public void onPublisherStateUpdate(String streamID, ZegoPublisherState state, int errorCode, org.json.JSONObject extendedData) {
                super.onPublisherStateUpdate(streamID, state, errorCode, extendedData);
                sendEvent("publisherStateUpdate", streamID, state.value(), errorCode, JSONObject.parse(extendedData.toString()));
            }

            @Override
            public void onPublisherQualityUpdate(String streamID, ZegoPublishStreamQuality quality) {
                super.onPublisherQualityUpdate(streamID, quality);

                JSONObject qualityMap = new JSONObject();
                qualityMap.put("videoCaptureFPS", quality.videoCaptureFPS);
                qualityMap.put("videoEncodeFPS", quality.videoEncodeFPS);
                qualityMap.put("videoSendFPS", quality.videoSendFPS);
                qualityMap.put("videoKBPS", quality.videoKBPS);
                qualityMap.put("audioCaptureFPS", quality.audioCaptureFPS);
                qualityMap.put("audioSendFPS", quality.audioSendFPS);
                qualityMap.put("audioKBPS", quality.audioKBPS);
                qualityMap.put("rtt", quality.rtt);
                qualityMap.put("packetLostRate", quality.packetLostRate);
                qualityMap.put("level", quality.level.value());
                qualityMap.put("isHardwareEncode", quality.isHardwareEncode);
                qualityMap.put("videoCodecID", quality.videoCodecID.value());
                qualityMap.put("totalSendBytes", quality.totalSendBytes);
                qualityMap.put("audioSendBytes", quality.audioSendBytes);
                qualityMap.put("videoSendBytes", quality.videoSendBytes);

                sendEvent("publisherQualityUpdate", streamID, qualityMap);
            }

            @Override
            public void onPublisherCapturedAudioFirstFrame() {
                super.onPublisherCapturedAudioFirstFrame();

                JSONObject args = new JSONObject();
                sendEvent("publisherCapturedAudioFirstFrame", args);
            }

            @Override
            public void onPublisherCapturedVideoFirstFrame(ZegoPublishChannel channel) {
                super.onPublisherCapturedVideoFirstFrame(channel);

                sendEvent("publisherCapturedVideoFirstFrame", channel.value());
            }

            @Override
            public void onPublisherVideoSizeChanged(int width, int height, ZegoPublishChannel channel) {
                super.onPublisherVideoSizeChanged(width, height, channel);
                sendEvent("publisherVideoSizeChanged", width, height, channel.value());
            }

            @Override
            public void onPlayerStateUpdate(String streamID, ZegoPlayerState state, int errorCode, org.json.JSONObject extendedData) {
                super.onPlayerStateUpdate(streamID, state, errorCode, extendedData);
                sendEvent("playerStateUpdate", streamID, state.value(), errorCode, JSONObject.parse(extendedData.toString()));
            }

            @Override
            public void onPlayerQualityUpdate(String streamID, ZegoPlayStreamQuality quality) {
                super.onPlayerQualityUpdate(streamID, quality);

                JSONObject qualityMap = new JSONObject();
                qualityMap.put("videoRecvFPS", quality.videoRecvFPS);
                qualityMap.put("videoDejitterFPS", quality.videoDejitterFPS);
                qualityMap.put("videoDecodeFPS", quality.videoDecodeFPS);
                qualityMap.put("videoRenderFPS", quality.videoRenderFPS);
                qualityMap.put("videoKBPS", quality.videoKBPS);
                qualityMap.put("videoBreakRate", quality.videoBreakRate);
                qualityMap.put("audioRecvFPS", quality.audioRecvFPS);
                qualityMap.put("audioDejitterFPS", quality.audioDejitterFPS);
                qualityMap.put("audioDecodeFPS", quality.audioDecodeFPS);
                qualityMap.put("audioRenderFPS", quality.audioRenderFPS);
                qualityMap.put("audioKBPS", quality.audioKBPS);
                qualityMap.put("audioBreakRate", quality.audioBreakRate);
                qualityMap.put("rtt", quality.rtt);
                qualityMap.put("packetLostRate", quality.packetLostRate);
                qualityMap.put("peerToPeerPacketLostRate", quality.peerToPeerPacketLostRate);
                qualityMap.put("peerToPeerDelay", quality.peerToPeerDelay);
                qualityMap.put("level", quality.level.value());
                qualityMap.put("delay", quality.delay);
                qualityMap.put("avTimestampDiff", quality.avTimestampDiff);
                qualityMap.put("isHardwareDecode", quality.isHardwareDecode);
                qualityMap.put("videoCodecID", quality.videoCodecID.value());
                qualityMap.put("totalRecvBytes", quality.totalRecvBytes);
                qualityMap.put("audioRecvBytes", quality.audioRecvBytes);
                qualityMap.put("videoRecvBytes", quality.videoRecvBytes);

                sendEvent("playerQualityUpdate", streamID, qualityMap);
            }

            @Override
            public void onPlayerMediaEvent(String streamID, ZegoPlayerMediaEvent event) {
                super.onPlayerMediaEvent(streamID, event);

                sendEvent("playerMediaEvent", streamID, event.value());
            }

            @Override
            public void onPlayerRecvAudioFirstFrame(String streamID) {
                super.onPlayerRecvAudioFirstFrame(streamID);
                sendEvent("playerRecvAudioFirstFrame", streamID);
            }

            @Override
            public void onPlayerRecvVideoFirstFrame(String streamID) {
                super.onPlayerRecvVideoFirstFrame(streamID);
                sendEvent("playerRecvVideoFirstFrame", streamID);
            }

            @Override
            public void onPlayerRenderVideoFirstFrame(String streamID) {
                super.onPlayerRenderVideoFirstFrame(streamID);
                sendEvent("playerRenderVideoFirstFrame", streamID);
            }

            @Override
            public void onPlayerVideoSizeChanged(String streamID, int width, int height) {
                super.onPlayerVideoSizeChanged(streamID, width, height);
                sendEvent("playerVideoSizeChanged", streamID, width, height);
            }

            @Override
            public void onMixerRelayCDNStateUpdate(String taskID, ArrayList<ZegoStreamRelayCDNInfo> infoList) {
                super.onMixerRelayCDNStateUpdate(taskID, infoList);
                JSONArray infoArray = new JSONArray();
                for (ZegoStreamRelayCDNInfo info : infoList) {
                    JSONObject infoMap = new JSONObject();
                    infoMap.put("url", info.url);
                    infoMap.put("state", info.state.value());
                    infoMap.put("stateTime", info.stateTime);
                    infoMap.put("updateReason", info.updateReason.value());

                    infoArray.add(infoMap);
                }
                sendEvent("mixerRelayCDNStateUpdate", taskID, infoArray);
            }

            @Override
            public void onMixerSoundLevelUpdate(HashMap<Integer, Float> soundLevels) {
                super.onMixerSoundLevelUpdate(soundLevels);
                sendEvent("mixerSoundLevelUpdate", soundLevels);
            }

            @Override
            public void onCapturedSoundLevelUpdate(float soundLevel) {
                super.onCapturedSoundLevelUpdate(soundLevel);
                sendEvent("capturedSoundLevelUpdate", soundLevel);
            }

            @Override
            public void onRemoteSoundLevelUpdate(HashMap<String, Float> soundLevels) {
                super.onRemoteSoundLevelUpdate(soundLevels);

                JSONObject soundLevelsMap = new JSONObject();
                for(Map.Entry<String, Float> entry: soundLevels.entrySet()) {
                    soundLevelsMap.put(entry.getKey(), entry.getValue());
                }
                sendEvent("remoteSoundLevelUpdate", soundLevelsMap);
            }

            @Override
            public void onDeviceError(int errorCode, String deviceName) {
                super.onDeviceError(errorCode, deviceName);
                sendEvent("deviceError", errorCode, deviceName);
            }

            @Override
            public void onRemoteCameraStateUpdate(String streamID, ZegoRemoteDeviceState state) {
                super.onRemoteCameraStateUpdate(streamID, state);
                sendEvent("remoteCameraStateUpdate", streamID, state.value());
            }

            @Override
            public void onRemoteMicStateUpdate(String streamID, ZegoRemoteDeviceState state) {
                super.onRemoteMicStateUpdate(streamID, state);
                sendEvent("remoteMicStateUpdate", streamID, state.value());
            }

            @Override
            public void onIMRecvBroadcastMessage(String roomID, ArrayList<ZegoBroadcastMessageInfo> messageList) {
                super.onIMRecvBroadcastMessage(roomID, messageList);
                JSONArray messageInfoArray = new JSONArray();
                for (ZegoBroadcastMessageInfo info : messageList) {
                    JSONObject infoMap = new JSONObject();
                    infoMap.put("message", info.message);
                    infoMap.put("messageID", info.messageID);
                    infoMap.put("sendTime", info.sendTime);

                    ZegoUser fromUser = info.fromUser;
                    JSONObject userMap = new JSONObject();
                    userMap.put("userID", fromUser.userID);
                    userMap.put("userName", fromUser.userName);
                    infoMap.put("fromUser", userMap);

                    messageInfoArray.add(infoMap);
                }

                sendEvent("IMRecvBroadcastMessage", roomID, messageInfoArray);
            }

            @Override
            public void onIMRecvBarrageMessage(String roomID, ArrayList<ZegoBarrageMessageInfo> messageList) {
                super.onIMRecvBarrageMessage(roomID, messageList);

                JSONArray messageInfoArray = new JSONArray();
                for (ZegoBarrageMessageInfo info : messageList) {
                    JSONObject infoMap = new JSONObject();
                    infoMap.put("message", info.message);
                    infoMap.put("messageID", info.messageID);
                    infoMap.put("sendTime", info.sendTime);

                    ZegoUser fromUser = info.fromUser;
                    JSONObject userMap = new JSONObject();
                    userMap.put("userID", fromUser.userID);
                    userMap.put("userName", fromUser.userName);
                    infoMap.put("fromUser", userMap);

                    messageInfoArray.add(infoMap);
                }

                sendEvent("IMRecvBarrageMessage", roomID, messageInfoArray);
            }

            @Override
            public void onIMRecvCustomCommand(String roomID, ZegoUser fromUser, String command) {
                super.onIMRecvCustomCommand(roomID, fromUser, command);
                JSONObject userMap = new JSONObject();
                userMap.put("userID", fromUser.userID);
                userMap.put("userName", fromUser.userName);

                sendEvent("IMRecvCustomCommand", roomID, userMap, command);
            }
        });
        mIsInited = true;
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void destroyEngine(final JSCallback callback) {
        if (mIsInited) {
            ZegoExpressEngine.destroyEngine(new IZegoDestroyCompletionCallback() {
                @Override
                public void onDestroyCompletion() {
                    callbackNotNull(callback);
                }
            });
        } else {
            callbackNotNull(callback);
        }
    }

    @SuppressWarnings("unused")
    public void setEngineConfig(JSONObject map, JSCallback callback) {
        JSONObject config = map.getJSONObject("config");
        ZegoEngineConfig configObj = new ZegoEngineConfig();

        JSONObject advancedConfig = config.getJSONObject("advancedConfig");
        if(advancedConfig != null) {
            for(Map.Entry<String, Object> entry: advancedConfig.entrySet()) {
                configObj.advancedConfig.put(entry.getKey(), entry.getValue().toString());
            }
        }

        ZegoExpressEngine.setEngineConfig(configObj);
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void setLogConfig(JSONObject map, JSCallback callback) {
        JSONObject config = map.getJSONObject("config");
        if(config != null) {
            ZegoLogConfig logConfig = new ZegoLogConfig();
            logConfig.logSize = config.getIntValue("logSize");
            String logPath = config.getString("logPath");
            if(logPath != null) {
                logConfig.logPath = logPath;
            }
            ZegoExpressEngine.setLogConfig(logConfig);
        }

        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void getVersion(JSCallback callback) {
        callbackNotNull(callback, ZegoExpressEngine.getVersion());
    }

    @SuppressWarnings("unused")
    public void uploadLog(JSCallback callback) {
        ZegoExpressEngine.getEngine().uploadLog();
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void callExperimentalAPI(JSONObject map, JSCallback callback) {
        String params = map.getString("params");
        String result = ZegoExpressEngine.getEngine().callExperimentalAPI(params);
        callbackNotNull(callback, result);
    }

    @SuppressWarnings("unused")
    public void setDummyCaptureImagePath(JSONObject map, JSCallback callback) {
        String filePath = map.getString("filePath");
        ZegoPublishChannel channel = ZegoPublishChannel.getZegoPublishChannel(map.getInteger("channel"));

        ZegoExpressEngine.getEngine().setDummyCaptureImagePath(filePath, channel);
        callbackNotNull(callback);
    }

    /** Room */
    @SuppressWarnings("unused")
    public void loginRoom(JSONObject map, JSCallback callback) {
        Log.i("ZegoExpressUniAppEngine", "loginRoom: true");
        String roomID = map.getString("roomID");
        JSONObject user = map.getJSONObject("user");
        JSONObject config = map.getJSONObject("config");
        ZegoUser userObj = new ZegoUser(user.getString("userID"), user.getString("userName"));

        if(config != null) {
            ZegoRoomConfig roomConfigObj = new ZegoRoomConfig();
            if (config.containsKey("userUpdate")) {
                roomConfigObj.isUserStatusNotify = config.getBoolean("userUpdate");
            }
            if (config.containsKey("isUserStatusNotify")) {
                roomConfigObj.isUserStatusNotify = config.getBoolean("isUserStatusNotify");
            }
            if (config.containsKey("maxMemberCount")) {
                roomConfigObj.maxMemberCount = config.getIntValue("maxMemberCount");
            }
            if (config.containsKey("token")) {
                roomConfigObj.token = config.getString("token");
            }

            ZegoExpressEngine.getEngine().loginRoom(roomID, userObj, roomConfigObj);
        } else {
            ZegoExpressEngine.getEngine().loginRoom(roomID, userObj);
        }
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void logoutRoom(JSONObject map, JSCallback callback) {
        String roomID = map.getString("roomID");
        ZegoExpressEngine.getEngine().logoutRoom(roomID);
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void switchRoom(JSONObject map, JSCallback callback) {
        String fromRoomID = map.getString("fromRoomID");
        String toRoomID = map.getString("toRoomID");
        JSONObject config = map.getJSONObject("config");

        if (config != null) {
            ZegoRoomConfig roomConfigObj = new ZegoRoomConfig();
            if (config.containsKey("userUpdate")) {
                roomConfigObj.isUserStatusNotify = config.getBoolean("userUpdate");
            }
            if (config.containsKey("isUserStatusNotify")) {
                roomConfigObj.isUserStatusNotify = config.getBoolean("isUserStatusNotify");
            }
            roomConfigObj.maxMemberCount = config.getIntValue("maxMemberCount");
            roomConfigObj.token = config.getString("token");

            ZegoExpressEngine.getEngine().switchRoom(fromRoomID, toRoomID, roomConfigObj);
        } else {
            ZegoExpressEngine.getEngine().switchRoom(fromRoomID, toRoomID);
        }
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void setRoomExtraInfo(JSONObject map, final JSCallback callback) {
        String value = map.getString("value");
        String key = map.getString("key");
        String roomID = map.getString("roomID");

        ZegoExpressEngine.getEngine().setRoomExtraInfo(value, key, roomID, new IZegoRoomSetRoomExtraInfoCallback() {
            @Override
            public void onRoomSetRoomExtraInfoResult(int i) {
                callbackNotNull(callback, i);
            }
        });
    }

    /** Publish */
    @SuppressWarnings("unused")
    public void startPublishingStream(JSONObject map, JSCallback callback) {
        String streamID = map.getString("streamID");
        int channel = map.getIntValue("channel");
        ZegoExpressEngine.getEngine().startPublishingStream(streamID, ZegoPublishChannel.getZegoPublishChannel(channel));
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void stopPublishingStream(JSONObject map, JSCallback callback) {
        int channel = map.getIntValue("channel");
        ZegoExpressEngine.getEngine().stopPublishingStream(ZegoPublishChannel.getZegoPublishChannel(channel));
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void setStreamExtraInfo(JSONObject map, final JSCallback callback) {
        String extraInfo = map.getString("extraInfo");
        ZegoExpressEngine.getEngine().setStreamExtraInfo(extraInfo, new IZegoPublisherSetStreamExtraInfoCallback() {
            @Override
            public void onPublisherSetStreamExtraInfoResult(int i) {
                callbackNotNull(callback, i);
            }
        });
    }

    @SuppressWarnings("unused")
    public void startPreview(JSONObject map, JSCallback callback) {
        Integer channel = map.getInteger("channel");
        ZegoCanvas canvas = previewViewMap.get(channel.toString());
        ZegoExpressEngine.getEngine().startPreview(canvas, ZegoPublishChannel.getZegoPublishChannel(channel));
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void stopPreview(JSONObject map, JSCallback callback) {
        int channel = map.getIntValue("channel");
        ZegoExpressEngine.getEngine().stopPreview(ZegoPublishChannel.getZegoPublishChannel(channel));
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void setVideoConfig(JSONObject map, JSCallback callback) {
        int channel = map.getIntValue("channel");
        ZegoVideoConfig configObj = new ZegoVideoConfig();

        if (map.get("config") instanceof Integer || map.get("config") instanceof Number) {
            Integer config = map.getInteger("config");
            configObj = new ZegoVideoConfig(ZegoVideoConfigPreset.getZegoVideoConfigPreset(config));
        } else if (map.get("config") instanceof JSONObject) {
            JSONObject config = map.getJSONObject("config");
            if (config.containsKey("captureWidth")) {
                configObj.captureWidth = config.getIntValue("captureWidth");
            }
            if (config.containsKey("captureHeight")) {
                configObj.captureHeight = config.getIntValue("captureHeight");
            }
            if (config.containsKey("encodeWidth")) {
                configObj.encodeWidth = config.getIntValue("encodeWidth");
            }
            if (config.containsKey("encodeHeight")) {
                configObj.encodeHeight = config.getIntValue("encodeHeight");
            }
            if (config.containsKey("bitrate")) {
                configObj.bitrate = config.getIntValue("bitrate");
            }
            if (config.containsKey("fps")) {
                configObj.fps = config.getIntValue("fps");
            }
            if (config.containsKey("codecID")) {
                configObj.codecID = ZegoVideoCodecID.getZegoVideoCodecID(config.getIntValue("codecID"));
            }
        }

        ZegoExpressEngine.getEngine().setVideoConfig(configObj, ZegoPublishChannel.getZegoPublishChannel(channel));
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void getVideoConfig(JSONObject map, JSCallback callback) {
        int channel = map.getIntValue("channel");
        ZegoVideoConfig config = ZegoExpressEngine.getEngine().getVideoConfig(ZegoPublishChannel.getZegoPublishChannel(channel));

        JSONObject o = new JSONObject();

        o.put("captureWidth", config.captureWidth);
        o.put("captureHeight", config.captureHeight);
        o.put("encodeWidth", config.encodeWidth);
        o.put("encodeHeight", config.encodeHeight);

        o.put("bitrate", config.bitrate);
        o.put("fps", config.fps);
        o.put("codecID", config.codecID.value());
        callbackNotNull(callback, o);
    }

    @SuppressWarnings("unused")
    public void setVideoMirrorMode(JSONObject map, JSCallback callback) {
        int mirrorMode = map.getIntValue("mode");
        int channel = map.getIntValue("channel");

        ZegoExpressEngine.getEngine().setVideoMirrorMode(ZegoVideoMirrorMode.getZegoVideoMirrorMode(mirrorMode), ZegoPublishChannel.getZegoPublishChannel(channel));
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void setAppOrientation(JSONObject map, JSCallback callback) {
        int orientation = map.getIntValue("orientation");
        int channel = map.getIntValue("channel");
        ZegoExpressEngine.getEngine().setAppOrientation(ZegoOrientation.getZegoOrientation(orientation), ZegoPublishChannel.getZegoPublishChannel(channel));
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void setAudioConfig(JSONObject map, JSCallback callback) {
        JSONObject config = map.getJSONObject("config");
        ZegoAudioConfig configObj = new ZegoAudioConfig();
        configObj.bitrate = config.getIntValue("bitrate");
        configObj.channel = ZegoAudioChannel.getZegoAudioChannel(config.getIntValue("channel"));
        configObj.codecID = ZegoAudioCodecID.getZegoAudioCodecID(config.getIntValue("codecID"));

        ZegoExpressEngine.getEngine().setAudioConfig(configObj);
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void getAudioConfig(JSCallback callback) {
        ZegoAudioConfig config = ZegoExpressEngine.getEngine().getAudioConfig();

        JSONObject map = new JSONObject();
        map.put("bitrate", config.bitrate);
        map.put("channel", config.channel.value());
        map.put("codecID", config.codecID.value());

        callbackNotNull(callback, map);
    }

    @SuppressWarnings("unused")
    public void setPublishStreamEncryptionKey(JSONObject map, JSCallback callback) {
        String key = map.getString("key");
        int channel = map.getIntValue("channel");

        ZegoExpressEngine.getEngine().setPublishStreamEncryptionKey(key, ZegoPublishChannel.getZegoPublishChannel(channel));
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void takePublishStreamSnapshot(JSONObject map, final JSCallback callback) {
        int channel = map.getIntValue("channel");
        ZegoExpressEngine.getEngine().takePublishStreamSnapshot(new IZegoPublisherTakeSnapshotCallback() {
            @SuppressLint("LongLogTag")
            @Override
            public void onPublisherTakeSnapshotResult(int i, Bitmap bitmap) {
                JSONObject params = new JSONObject();
                params.put("errorCode", i);
                params.put("imageBase64", bitmapToBase64(bitmap));
                callbackNotNull(callback, params);
            }
        }, ZegoPublishChannel.getZegoPublishChannel(channel));
    }

    @SuppressWarnings("unused")
    public void mutePublishStreamAudio(JSONObject map, JSCallback callback) {
        boolean mute = map.getBoolean("mute");
        int channel = map.getIntValue("channel");
        ZegoExpressEngine.getEngine().mutePublishStreamAudio(mute, ZegoPublishChannel.getZegoPublishChannel(channel));
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void mutePublishStreamVideo(JSONObject map, JSCallback callback) {
        boolean mute = map.getBoolean("mute");
        int channel = map.getIntValue("channel");
        ZegoExpressEngine.getEngine().mutePublishStreamVideo(mute, ZegoPublishChannel.getZegoPublishChannel(channel));
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void enableTrafficControl(JSONObject map, JSCallback callback) {
        boolean enable = map.getBoolean("enable");
        int property = map.getIntValue("property");
        ZegoExpressEngine.getEngine().enableTrafficControl(enable, property);
        callbackNotNull(callback, map);
    }

    @SuppressWarnings("unused")
    public void setMinVideoBitrateForTrafficControl(JSONObject map, JSCallback callback) {
        int bitrate = map.getIntValue("bitrate");
        int mode = map.getIntValue("mode");
        int channel = map.getIntValue("channel");

        ZegoExpressEngine.getEngine().setMinVideoBitrateForTrafficControl(
                bitrate,
                ZegoTrafficControlMinVideoBitrateMode.getZegoTrafficControlMinVideoBitrateMode(mode),
                ZegoPublishChannel.getZegoPublishChannel(channel)
        );
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void setTrafficControlFocusOn(JSONObject map, JSCallback callback) {
        int mode = map.getIntValue("mode");
        int channel = map.getIntValue("channel");

        ZegoExpressEngine.getEngine().setTrafficControlFocusOn(
                ZegoTrafficControlFocusOnMode.getZegoTrafficControlFocusOnMode(mode),
                ZegoPublishChannel.getZegoPublishChannel(channel)
        );
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void setCaptureVolume(JSONObject map, JSCallback callback) {
        int volume = map.getIntValue("volume");
        ZegoExpressEngine.getEngine().setCaptureVolume(volume);
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void setAudioCaptureStereoMode(JSONObject map, JSCallback callback) {
        int mode = map.getIntValue("mode");
        ZegoExpressEngine.getEngine().setAudioCaptureStereoMode(ZegoAudioCaptureStereoMode.getZegoAudioCaptureStereoMode(mode));
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void addPublishCdnUrl(JSONObject map, final JSCallback callback) {
        String targetURL = map.getString("targetURL");
        String streamID = map.getString("streamID");

        ZegoExpressEngine.getEngine().addPublishCdnUrl(streamID, targetURL, new IZegoPublisherUpdateCdnUrlCallback() {
            @Override
            public void onPublisherUpdateCdnUrlResult(int i) {
                callbackNotNull(callback, i);
            }
        });
    }

    @SuppressWarnings("unused")
    public void removePublishCdnUrl(JSONObject map, final JSCallback callback) {
        String targetURL = map.getString("targetURL");
        String streamID = map.getString("streamID");

        ZegoExpressEngine.getEngine().removePublishCdnUrl(streamID, targetURL, new IZegoPublisherUpdateCdnUrlCallback() {
            @Override
            public void onPublisherUpdateCdnUrlResult(int i) {
                callbackNotNull(callback, i);
            }
        });
    }

    @SuppressWarnings("unused")
    public void enablePublishDirectToCDN(JSONObject map, JSCallback callback) {
        int channel = map.getIntValue("channel");
        boolean enable = map.getBoolean("enable");
        JSONObject config = map.getJSONObject("config");

        ZegoCDNConfig cdnConfig = new ZegoCDNConfig();
        if (config != null) {
            cdnConfig.url = config.getString("url");
            cdnConfig.authParam = config.getString("authParam");
        }

        ZegoExpressEngine.getEngine().enablePublishDirectToCDN(enable, cdnConfig, ZegoPublishChannel.getZegoPublishChannel(channel));
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void setPublishWatermark(JSONObject map, JSCallback callback) {
        int channel = map.getIntValue("channel");
        boolean isPreviewVisible = map.getBoolean("isPreviewVisible");
        JSONObject mark = map.getJSONObject("watermark");
        String imageURL = mark.getString("imageURL");
        JSONObject layout = mark.getJSONObject("layout");
        android.graphics.Rect rect = new Rect(
                layout.getIntValue("x"),
                layout.getIntValue("y"),
                layout.getIntValue("width") + layout.getIntValue("x"),
                layout.getIntValue("height") + layout.getIntValue("y")
        );
        ZegoWatermark watermark = new ZegoWatermark(imageURL, rect);
        ZegoExpressEngine.getEngine().setPublishWatermark(watermark, isPreviewVisible, ZegoPublishChannel.getZegoPublishChannel(channel));
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void setSEIConfig(JSONObject map, JSCallback callback) {
        JSONObject config = map.getJSONObject("config");
        ZegoSEIConfig seiConfig = new ZegoSEIConfig();
        if (config != null) {
            seiConfig.type = ZegoSEIType.getZegoSEIType(config.getIntValue("type"));
        }

        ZegoExpressEngine.getEngine().setSEIConfig(seiConfig);
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void sendSEI(JSONObject map, JSCallback callback) {
        int channel = map.getIntValue("channel");
        byte[] data = map.getBytes("data");

        ZegoExpressEngine.getEngine().sendSEI(data, ZegoPublishChannel.getZegoPublishChannel(channel));
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void setCapturePipelineScaleMode(JSONObject map, JSCallback callback) {
        int mode = map.getIntValue("mode");

        ZegoExpressEngine.getEngine().setCapturePipelineScaleMode(ZegoCapturePipelineScaleMode.getZegoCapturePipelineScaleMode(mode));
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void enableHardwareEncoder(JSONObject map, JSCallback callback) {
        boolean enable = map.getBoolean("enable");
        ZegoExpressEngine.getEngine().enableHardwareEncoder(enable);
        callbackNotNull(callback);
    }

    /** Playing */
    @SuppressWarnings("unused")
    public void startPlayingStream(JSONObject map, JSCallback callback) {
        String streamID = map.getString("streamID");
        JSONObject config = map.getJSONObject("config");
        ZegoPlayStreamStore store = playViewMap.get(streamID);
        if (store == null) {
            store = new ZegoPlayStreamStore();
        }
        store.isPlaying = true;

        if (config == null) {
            ZegoExpressEngine.getEngine().startPlayingStream(streamID, store.canvas);
        } else {
            ZegoPlayerConfig configP = new ZegoPlayerConfig();
            ZegoCDNConfig cdnConfig = new ZegoCDNConfig();
            if (config.getJSONObject("cdnConfig") != null) {
                cdnConfig.authParam = config.getJSONObject("cdnConfig").getString("authParam");
                cdnConfig.url = config.getJSONObject("cdnConfig").getString("url");
                configP.cdnConfig = cdnConfig;
            }
            if (config.containsKey("resourceMode")) {
                int resourceMode = config.getIntValue("resourceMode");
                configP.resourceMode = ZegoStreamResourceMode.getZegoStreamResourceMode(resourceMode);
            }
            ZegoExpressEngine.getEngine().startPlayingStream(streamID, store.canvas, configP);
            store.config = configP;
        }
        playViewMap.put(streamID, store);

        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void stopPlayingStream(JSONObject map, JSCallback callback) {
        String streamID = map.getString("streamID");

        ZegoExpressEngine.getEngine().stopPlayingStream(streamID);
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void setPlayStreamDecryptionKey(JSONObject map, JSCallback callback) {
        String streamID = map.getString("streamID");
        String key = map.getString("key");

        ZegoExpressEngine.getEngine().setPlayStreamDecryptionKey(streamID, key);
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void takePlayStreamSnapshot(JSONObject map, final JSCallback callback) {
        String streamID = map.getString("streamID");

        ZegoExpressEngine.getEngine().takePlayStreamSnapshot(streamID, new IZegoPlayerTakeSnapshotCallback() {
            @Override
            public void onPlayerTakeSnapshotResult(int i, android.graphics.Bitmap bitmap) {
                JSONObject params = new JSONObject();
                params.put("errorCode", i);
                params.put("imageBase64", bitmapToBase64(bitmap));
                callbackNotNull(callback, params);
            }
        });
    }

    @SuppressWarnings("unused")
    public void setPlayVolume(JSONObject map, JSCallback callback) {
        String streamID = map.getString("streamID");
        int volume = map.getIntValue("volume");
        ZegoExpressEngine.getEngine().setPlayVolume(streamID, volume);
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void setPlayStreamVideoType(JSONObject map, JSCallback callback) {
        String streamID = map.getString("streamID");
        int streamType = map.getIntValue("streamType");

        ZegoExpressEngine.getEngine().setPlayStreamVideoType(streamID, ZegoVideoStreamType.getZegoVideoStreamType(streamType));
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void setAllPlayStreamVolume(JSONObject map, JSCallback callback) {
        int volume = map.getIntValue("volume");
        ZegoExpressEngine.getEngine().setAllPlayStreamVolume(volume);
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void setPlayStreamBufferIntervalRange(JSONObject map, JSCallback callback) {

    }

    @SuppressWarnings("unused")
    public void setPlayStreamFocusOn(JSONObject map, JSCallback callback) {
        String streamID = map.getString("streamID");

        ZegoExpressEngine.getEngine().setPlayStreamFocusOn(streamID);
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void mutePlayStreamAudio(JSONObject map, JSCallback callback) {
        boolean mute = map.getBoolean("mute");
        String streamID = map.getString("streamID");
        ZegoExpressEngine.getEngine().mutePlayStreamAudio(streamID, mute);
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void mutePlayStreamVideo(JSONObject map, JSCallback callback) {
        boolean mute = map.getBoolean("mute");
        String streamID = map.getString("streamID");
        ZegoExpressEngine.getEngine().mutePlayStreamVideo(streamID, mute);
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void muteAllPlayStreamAudio(JSONObject map, JSCallback callback) {
        boolean mute = map.getBoolean("mute");
        ZegoExpressEngine.getEngine().muteAllPlayStreamAudio(mute);
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void muteAllPlayStreamVideo(JSONObject map, JSCallback callback) {
        boolean mute = map.getBoolean("mute");
        ZegoExpressEngine.getEngine().muteAllPlayStreamVideo(mute);
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void enableHardwareDecoder(JSONObject map, JSCallback callback) {
        boolean enable = map.getBoolean("enable");
        ZegoExpressEngine.getEngine().enableHardwareDecoder(enable);
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void enableCheckPoc(JSONObject map, JSCallback callback) {
        boolean enable = map.getBoolean("enable");
        ZegoExpressEngine.getEngine().enableCheckPoc(enable);
        callbackNotNull(callback);
    }

    /** Preprocess */
    @SuppressWarnings("unused")
    public void enableAEC(JSONObject map, JSCallback callback) {
        boolean enable = map.getBoolean("enable");

        ZegoExpressEngine.getEngine().enableAEC(enable);
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void enableHeadphoneAEC(JSONObject map, JSCallback callback) {
        boolean enable = map.getBoolean("enable");

        ZegoExpressEngine.getEngine().enableHeadphoneAEC(enable);
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void setAECMode(JSONObject map, JSCallback callback) {
        int mode = map.getIntValue("mode");

        ZegoExpressEngine.getEngine().setAECMode(ZegoAECMode.getZegoAECMode(mode));
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void enableAGC(JSONObject map, JSCallback callback) {
        boolean enable = map.getBoolean("enable");

        ZegoExpressEngine.getEngine().enableAGC(enable);
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void enableANS(JSONObject map, JSCallback callback) {
        boolean enable = map.getBoolean("enable");

        ZegoExpressEngine.getEngine().enableANS(enable);
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void enableTransientANS(JSONObject map, JSCallback callback) {
        boolean enable = map.getBoolean("enable");

        ZegoExpressEngine.getEngine().enableTransientANS(enable);
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void setANSMode(JSONObject map, JSCallback callback) {
        int mode = map.getIntValue("mode");

        ZegoExpressEngine.getEngine().setANSMode(ZegoANSMode.getZegoANSMode(mode));
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void enableBeautify(JSONObject map, JSCallback callback) {
        int feature = map.getIntValue("feature");
        int channel = map.getIntValue("channel");

        ZegoExpressEngine.getEngine().enableBeautify(feature, ZegoPublishChannel.getZegoPublishChannel(channel));
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void setBeautifyOption(JSONObject map, JSCallback callback) {
        JSONObject option = map.getJSONObject("option");
        int channel = map.getIntValue("channel");
        ZegoBeautifyOption beautifyOption = new ZegoBeautifyOption();
        if (option != null) {
            beautifyOption.polishStep = option.getDoubleValue("polishStep");
            beautifyOption.sharpenFactor = option.getDoubleValue("sharpenFactor");
            beautifyOption.whitenFactor = option.getDoubleValue("whitenFactor");
            ZegoExpressEngine.getEngine().setBeautifyOption(beautifyOption, ZegoPublishChannel.getZegoPublishChannel(channel));
        }

        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void setAudioEqualizerGain(JSONObject map, JSCallback callback) {
        int bandIndex = map.getIntValue("bandIndex");
        float bandGain = map.getFloatValue("bandGain");

        ZegoExpressEngine.getEngine().setAudioEqualizerGain(bandIndex, bandGain);
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void setVoiceChangerPreset(JSONObject map, JSCallback callback) {
        int preset = map.getIntValue("preset");

        ZegoExpressEngine.getEngine().setVoiceChangerPreset(ZegoVoiceChangerPreset.getZegoVoiceChangerPreset(preset));
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void setVoiceChangerParam(JSONObject map, JSCallback callback) {
        JSONObject param = map.getJSONObject("param");
        ZegoVoiceChangerParam changerParam = new ZegoVoiceChangerParam();
        if (param != null) {
            changerParam.pitch = param.getFloat("pitch");
        }
        ZegoExpressEngine.getEngine().setVoiceChangerParam(changerParam);
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void setReverbPreset(JSONObject map, JSCallback callback) {
        int preset = map.getIntValue("preset");

        ZegoExpressEngine.getEngine().setReverbPreset(ZegoReverbPreset.getZegoReverbPreset(preset));
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void setReverbAdvancedParam(JSONObject map, JSCallback callback) {
        JSONObject param = map.getJSONObject("param");
        ZegoReverbAdvancedParam advancedParam = new ZegoReverbAdvancedParam();
        if (param != null) {
            advancedParam.damping = param.getFloatValue("damping");
            advancedParam.dryGain = param.getFloatValue("dryGain");
            advancedParam.preDelay = param.getFloatValue("preDelay");
            advancedParam.reverberance = param.getFloatValue("reverberance");
            advancedParam.roomSize = param.getFloatValue("roomSize");
            advancedParam.stereoWidth = param.getFloatValue("stereoWidth");
            advancedParam.toneHigh = param.getFloatValue("toneHigh");
            advancedParam.toneLow = param.getFloatValue("toneLow");
            advancedParam.wetGain = param.getFloatValue("wetGain");
            advancedParam.wetOnly = param.getBoolean("wetOnly");
        }
        ZegoExpressEngine.getEngine().setReverbAdvancedParam(advancedParam);
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void setReverbEchoParam(JSONObject map, JSCallback callback) {
        JSONObject param = map.getJSONObject("param");
        ZegoReverbEchoParam echoParam = new ZegoReverbEchoParam();
        if (param != null) {
            echoParam.outGain = param.getFloatValue("outGain");
            echoParam.inGain = param.getFloatValue("inGain");
            echoParam.numDelays = param.getIntValue("numDelays");
            JSONArray delayObjectArray = param.getJSONArray("delay");
            int[] delayArray = new int[delayObjectArray.size()];
            for (int i = 0; i < delayObjectArray.size(); i++) {
                delayArray[i] = delayObjectArray.getIntValue(i);
            }
            float[] decayArray = new float[delayObjectArray.size()];
            for (int i = 0; i < delayObjectArray.size(); i++) {
                decayArray[i] = delayObjectArray.getFloatValue(i);
            }
            echoParam.delay = delayArray;
            echoParam.decay = decayArray;
        }
        ZegoExpressEngine.getEngine().setReverbEchoParam(echoParam);
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void enableVirtualStereo(JSONObject map, JSCallback callback) {
        boolean enable = map.getBooleanValue("enable");
        int angle = map.getIntValue("angle");

        ZegoExpressEngine.getEngine().enableVirtualStereo(enable, angle);
        callbackNotNull(callback);
    }

    /** IM */
    @SuppressWarnings("unused")
    public void sendBroadcastMessage(JSONObject map, final JSCallback callback) {
        String roomID = map.getString("roomID");
        String message = map.getString("message");

        ZegoExpressEngine.getEngine().sendBroadcastMessage(roomID, message, new IZegoIMSendBroadcastMessageCallback() {
            @Override
            public void onIMSendBroadcastMessageResult(int i, long l) {
                JSONObject params = new JSONObject();
                params.put("errorCode", i);
                params.put("messageID", l);
                callbackNotNull(callback, params);
            }
        });
    }

    @SuppressWarnings("unused")
    public void sendBarrageMessage(JSONObject map, final JSCallback callback) {
        String roomID = map.getString("roomID");
        String message = map.getString("message");

        ZegoExpressEngine.getEngine().sendBarrageMessage(roomID, message, new IZegoIMSendBarrageMessageCallback() {
            @Override
            public void onIMSendBarrageMessageResult(int i, String s) {
                JSONObject params = new JSONObject();
                params.put("errorCode", i);
                params.put("messageID", s);
                callbackNotNull(callback, params);
            }
        });
    }

    @SuppressWarnings("unused")
    public void sendCustomCommand(JSONObject map, final JSCallback callback) {
        String roomID = map.getString("roomID");
        String command = map.getString("command");
        JSONArray toUserList = map.getJSONArray("toUserList");
        ArrayList<ZegoUser> userListArray = new ArrayList<>();
        for (Object userOBjMap : toUserList) {
            JSONObject userMap = (JSONObject) JSONObject.toJSON(userOBjMap);
            ZegoUser user = new ZegoUser(userMap.getString("userID"), userMap.getString("userName"));
            userListArray.add(user);
        }
        ZegoExpressEngine.getEngine().sendCustomCommand(roomID, command, userListArray, new IZegoIMSendCustomCommandCallback() {
            @Override
            public void onIMSendCustomCommandResult(int i) {
                callbackNotNull(callback, i);
            }
        });
    }

    /** Mixer */
    @SuppressWarnings("unused")
    public void startMixerTask(JSONObject map, final JSCallback callback) {

        JSONObject taskMap = map.getJSONObject("task");

        String taskID = taskMap.getString("taskID");
        ZegoMixerTask taskObject = new ZegoMixerTask(taskID);

        // MixerInput
        JSONArray inputListMap = taskMap.getJSONArray("inputList");
        if (inputListMap != null && !inputListMap.isEmpty()) {
            ArrayList<ZegoMixerInput> inputListObject= new ArrayList<>();
            for (Object inputMapObject: inputListMap) {
                JSONObject inputMap = (JSONObject) JSONObject.toJSON(inputMapObject);
                String streamID = inputMap.getString("streamID");
                int contentType = inputMap.getInteger("contentType");
                JSONObject layout = inputMap.getJSONObject("layout");
                android.graphics.Rect rect = new Rect(
                        layout.getIntValue("x"),
                        layout.getIntValue("y"),
                        layout.getIntValue("width") + layout.getIntValue("x"),
                        layout.getIntValue("height") + layout.getIntValue("y")
                );
                int soundLevelID = inputMap.getInteger("soundLevelID");
                ZegoMixerInput inputObject = new ZegoMixerInput(streamID, ZegoMixerInputContentType.getZegoMixerInputContentType(contentType), rect, soundLevelID);
                inputListObject.add(inputObject);
            }
            taskObject.setInputList(inputListObject);
        }

        // MixerOutput
        JSONArray outputListMap = taskMap.getJSONArray("outputList");
        if (outputListMap != null && !outputListMap.isEmpty()) {
            ArrayList<ZegoMixerOutput> outputListObject = new ArrayList<>();
            for (Object outputMapObject : outputListMap) {
                JSONObject outputMap = (JSONObject) JSONObject.toJSON(outputMapObject);
                String target = outputMap.getString("target");
                ZegoMixerOutput outputObject = new ZegoMixerOutput(target);
                outputListObject.add(outputObject);
            }
            taskObject.setOutputList(outputListObject);
        }

        // AudioConfig
        JSONObject audioConfigMap = taskMap.getJSONObject("audioConfig");
        if (audioConfigMap != null && !audioConfigMap.isEmpty()) {
            int bitrate = audioConfigMap.getInteger("bitrate");
            int channel = audioConfigMap.getInteger("channel");
            int codecID = audioConfigMap.getInteger("codecID");
            ZegoMixerAudioConfig audioConfigObject = new ZegoMixerAudioConfig();
            audioConfigObject.bitrate = bitrate;
            audioConfigObject.channel = ZegoAudioChannel.getZegoAudioChannel(channel);
            audioConfigObject.codecID = ZegoAudioCodecID.getZegoAudioCodecID(codecID);

            taskObject.setAudioConfig(audioConfigObject);
        }

        // VideoConfig
        JSONObject videoConfigMap = taskMap.getJSONObject("videoConfig");
        if (videoConfigMap != null && !videoConfigMap.isEmpty()) {
            int width = videoConfigMap.getInteger("width");
            int height = videoConfigMap.getInteger("height");
            int fps = videoConfigMap.getInteger("fps");
            int bitrate = videoConfigMap.getInteger("bitrate");
            ZegoMixerVideoConfig videoConfigObject = new ZegoMixerVideoConfig(width, height, fps, bitrate);

            taskObject.setVideoConfig(videoConfigObject);
        }

        // Watermark
        JSONObject watermarkMap = taskMap.getJSONObject("watermark");
        if (watermarkMap != null && !watermarkMap.isEmpty()) {
            String imageURL = watermarkMap.getString("imageURL");
            if (imageURL != null && imageURL.length() > 0) {
                JSONObject layout = watermarkMap.getJSONObject("layout");
                android.graphics.Rect rect = new Rect(
                        layout.getIntValue("x"),
                        layout.getIntValue("y"),
                        layout.getIntValue("width") + layout.getIntValue("x"),
                        layout.getIntValue("height") + layout.getIntValue("y")
                );
                ZegoWatermark watermarkObject = new ZegoWatermark(imageURL, rect);

                taskObject.setWatermark(watermarkObject);
            }
        }

        // Background Image
        String backgroundImageURL = taskMap.getString("backgroundImageURL");
        if (backgroundImageURL != null && backgroundImageURL.length() > 0) {
            taskObject.setBackgroundImageURL(backgroundImageURL);
        }

        // Enable SoundLevel
        boolean enableSoundLevel = taskMap.getBoolean("enableSoundLevel");
        taskObject.enableSoundLevel(enableSoundLevel);

        // Set AdvancedConfig
        HashMap<String, String> advancedConfig = taskMap.getObject("advancedConfig", HashMap.class);
        taskObject.setAdvancedConfig(advancedConfig);

        ZegoExpressEngine.getEngine().startMixerTask(taskObject, new IZegoMixerStartCallback() {
            @Override
            public void onMixerStartResult(int errorCode, org.json.JSONObject extendedData) {
                HashMap<String, Object> resultMap = new HashMap<>();
                resultMap.put("errorCode", errorCode);
                resultMap.put("extendedData", extendedData.toString());
                callbackNotNull(callback, resultMap);
            }
        });
    }

    @SuppressWarnings("unused")
    public void stopMixerTask(JSONObject map, final JSCallback callback) {

        JSONObject taskMap = map.getJSONObject("task");

        String taskID = taskMap.getString("taskID");
        ZegoMixerTask taskObject = new ZegoMixerTask(taskID);

        // MixerInput
        JSONArray inputListMap = taskMap.getJSONArray("inputList");
        if (inputListMap != null && !inputListMap.isEmpty()) {
            ArrayList<ZegoMixerInput> inputListObject= new ArrayList<>();
            for (Object inputMapObject: inputListMap) {
                JSONObject inputMap = (JSONObject) JSONObject.toJSON(inputMapObject);
                String streamID = inputMap.getString("streamID");
                int contentType = inputMap.getInteger("contentType");
                JSONObject layout = inputMap.getJSONObject("layout");
                android.graphics.Rect rect = new Rect(
                        layout.getIntValue("x"),
                        layout.getIntValue("y"),
                        layout.getIntValue("width") + layout.getIntValue("x"),
                        layout.getIntValue("height") + layout.getIntValue("y")
                );
                int soundLevelID = inputMap.getInteger("soundLevelID");
                ZegoMixerInput inputObject = new ZegoMixerInput(streamID, ZegoMixerInputContentType.getZegoMixerInputContentType(contentType), rect, soundLevelID);
                inputListObject.add(inputObject);
            }
            taskObject.setInputList(inputListObject);
        }

        // MixerOutput
        JSONArray outputListMap = taskMap.getJSONArray("outputList");
        if (outputListMap != null && !outputListMap.isEmpty()) {
            ArrayList<ZegoMixerOutput> outputListObject = new ArrayList<>();
            for (Object outputMapObject : outputListMap) {
                JSONObject outputMap = (JSONObject) JSONObject.toJSON(outputMapObject);
                String target = outputMap.getString("target");
                ZegoMixerOutput outputObject = new ZegoMixerOutput(target);
                outputListObject.add(outputObject);
            }
            taskObject.setOutputList(outputListObject);
        }

        // no need to set audio config

        // no need to set video config

        // no need to set watermark

        // no need to set background image

        // no need to set enable sound level

        ZegoExpressEngine.getEngine().stopMixerTask(taskObject, new IZegoMixerStopCallback() {
            @Override
            public void onMixerStopResult(int errorCode) {
                HashMap<String, Object> resultMap = new HashMap<>();
                resultMap.put("errorCode", errorCode);
                callbackNotNull(callback, resultMap);
            }
        });
    }

    @SuppressWarnings("unused")
    public void startAutoMixerTask(JSONObject map, final JSCallback callback) {

        JSONObject taskMap = map.getJSONObject("task");

        String taskID = taskMap.getString("taskID");
        String roomID = taskMap.getString("roomID");
        ZegoAutoMixerTask taskObject = new ZegoAutoMixerTask();
        taskObject.taskID = taskID;
        taskObject.roomID = roomID;

        // MixerOutput
        JSONArray outputListMap = taskMap.getJSONArray("outputList");
        if (outputListMap != null && !outputListMap.isEmpty()) {
            ArrayList<ZegoMixerOutput> outputListObject = new ArrayList<>();
            for (Object outputMapObject : outputListMap) {
                JSONObject outputMap = (JSONObject) JSONObject.toJSON(outputMapObject);
                String target = outputMap.getString("target");
                ZegoMixerOutput outputObject = new ZegoMixerOutput(target);
                outputListObject.add(outputObject);
            }
            taskObject.outputList = outputListObject;
        }

        // AudioConfig
        JSONObject audioConfigMap = taskMap.getJSONObject("audioConfig");
        if (audioConfigMap != null && !audioConfigMap.isEmpty()) {
            int bitrate = audioConfigMap.getInteger("bitrate");
            int channel = audioConfigMap.getInteger("channel");
            int codecID = audioConfigMap.getInteger("codecID");
            ZegoMixerAudioConfig audioConfigObject = new ZegoMixerAudioConfig();
            audioConfigObject.bitrate = bitrate;
            audioConfigObject.channel = ZegoAudioChannel.getZegoAudioChannel(channel);
            audioConfigObject.codecID = ZegoAudioCodecID.getZegoAudioCodecID(codecID);

            taskObject.audioConfig = audioConfigObject;
        }

        // Enable SoundLevel
        taskObject.enableSoundLevel = taskMap.getBoolean("enableSoundLevel");

        ZegoExpressEngine.getEngine().startAutoMixerTask(taskObject, new IZegoMixerStartCallback() {
            @Override
            public void onMixerStartResult(int errorCode, org.json.JSONObject extendedData) {
                HashMap<String, Object> resultMap = new HashMap<>();
                resultMap.put("errorCode", errorCode);
                resultMap.put("extendedData", extendedData.toString());
                callbackNotNull(callback, resultMap);
            }
        });
    }

    @SuppressWarnings("unused")
    public void stopAutoMixerTask(JSONObject map, final JSCallback callback) {

        JSONObject taskMap = map.getJSONObject("task");

        String taskID = taskMap.getString("taskID");
        String roomID = taskMap.getString("roomID");
        ZegoAutoMixerTask taskObject = new ZegoAutoMixerTask();
        taskObject.taskID = taskID;
        taskObject.roomID = roomID;

        // MixerOutput
        JSONArray outputListMap = taskMap.getJSONArray("outputList");
        if (outputListMap != null && !outputListMap.isEmpty()) {
            ArrayList<ZegoMixerOutput> outputListObject = new ArrayList<>();
            for (Object outputMapObject : outputListMap) {
                JSONObject outputMap = (JSONObject) JSONObject.toJSON(outputMapObject);
                String target = outputMap.getString("target");
                ZegoMixerOutput outputObject = new ZegoMixerOutput(target);
                outputListObject.add(outputObject);
            }
            taskObject.outputList = outputListObject;
        }

        // no need to set audio config

        // no need to set video config

        // no need to set watermark

        // no need to set background image

        // no need to set enable sound level

        ZegoExpressEngine.getEngine().stopAutoMixerTask(taskObject, new IZegoMixerStopCallback() {
            @Override
            public void onMixerStopResult(int errorCode) {
                HashMap<String, Object> resultMap = new HashMap<>();
                resultMap.put("errorCode", errorCode);
                callbackNotNull(callback, resultMap);
            }
        });
    }

    /** Device */
    @SuppressWarnings("unused")
    public void muteMicrophone(JSONObject map, JSCallback callback) {
        boolean mute = map.getBoolean("mute");
        ZegoExpressEngine.getEngine().muteMicrophone(mute);
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void isMicrophoneMuted(JSCallback callback) {
        boolean mute = ZegoExpressEngine.getEngine().isMicrophoneMuted();
        callbackNotNull(callback, mute);
    }

    @SuppressWarnings("unused")
    public void  muteSpeaker(JSONObject map, JSCallback callback) {
        boolean mute = map.getBoolean("mute");
        ZegoExpressEngine.getEngine().muteSpeaker(mute);
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void isSpeakerMuted(JSCallback callback) {
        boolean mute = ZegoExpressEngine.getEngine().isSpeakerMuted();
        callbackNotNull(callback, mute);
    }

    @SuppressWarnings("unused")
    public void enableAudioCaptureDevice(JSONObject map, JSCallback callback) {
        boolean enable = map.getBoolean("enable");
        ZegoExpressEngine.getEngine().enableAudioCaptureDevice(enable);
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void getAudioRouteType(JSCallback callback) {
        ZegoAudioRoute route = ZegoExpressEngine.getEngine().getAudioRouteType();
        callbackNotNull(callback, route.value());
    }

    @SuppressWarnings("unused")
    public void setAudioRouteToSpeaker(JSONObject map, JSCallback callback) {
        boolean defaultToSpeaker = map.getBoolean("defaultToSpeaker");
        ZegoExpressEngine.getEngine().setAudioRouteToSpeaker(defaultToSpeaker);
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void enableCamera(JSONObject map, JSCallback callback) {
        boolean enable = map.getBoolean("enable");
        int channel = map.getIntValue("channel");
        ZegoExpressEngine.getEngine().enableCamera(enable,ZegoPublishChannel.getZegoPublishChannel(channel));
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void useFrontCamera(JSONObject map, JSCallback callback) {
        boolean enable = map.getBoolean("enable");
        int channel = map.getIntValue("channel");
        ZegoExpressEngine.getEngine().useFrontCamera(enable, ZegoPublishChannel.getZegoPublishChannel(channel));
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void setCameraZoomFactor(JSONObject map, JSCallback callback) {
        float enable = map.getFloat("factor");
        int channel = map.getIntValue("channel");
        ZegoExpressEngine.getEngine().setCameraZoomFactor(enable, ZegoPublishChannel.getZegoPublishChannel(channel));
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void getCameraMaxZoomFactor(JSONObject map, JSCallback callback) {
        int channel = map.getIntValue("channel");
        float factor = ZegoExpressEngine.getEngine().getCameraMaxZoomFactor(ZegoPublishChannel.getZegoPublishChannel(channel));
        callbackNotNull(callback, factor);
    }

    @SuppressWarnings("unused")
    public void startSoundLevelMonitor(JSONObject map, JSCallback callback) {
        int millisecond = map.getIntValue("millisecond");
        ZegoExpressEngine.getEngine().startSoundLevelMonitor(millisecond);
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void stopSoundLevelMonitor(JSCallback callback) {
        ZegoExpressEngine.getEngine().startSoundLevelMonitor();
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void startAudioSpectrumMonitor(JSONObject map, JSCallback callback) {
        int millisecond = map.getIntValue("millisecond");
        ZegoExpressEngine.getEngine().startAudioSpectrumMonitor(millisecond);
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void stopAudioSpectrumMonitor(JSCallback callback) {
        ZegoExpressEngine.getEngine().stopAudioSpectrumMonitor();
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void enableHeadphoneMonitor(JSONObject map, JSCallback callback) {
        boolean enable = map.getBoolean("enable");
        ZegoExpressEngine.getEngine().enableHeadphoneMonitor(enable);
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void setHeadphoneMonitorVolume(JSONObject map, JSCallback callback) {
        int volume = map.getIntValue("volume");
        ZegoExpressEngine.getEngine().setHeadphoneMonitorVolume(volume);
        callbackNotNull(callback);
    }

    /** Media player */
    @SuppressWarnings("unused")
    public void createMediaPlayer(JSCallback callback) {
        ZegoMediaPlayer player = ZegoExpressEngine.getEngine().createMediaPlayer();
        player.setEventHandler(mediaPlayerEventHandler);
//        player.setVideoHandler(mediaPlayerVideoHandler);
//        player.setAudioHandler(mediaPlayerAudioHandler);

        mediaPlayerDict.put(Integer.toString(player.getIndex()), player);
        JSONObject obj = new JSONObject();
        obj.put("playerID", player.getIndex());
        callbackNotNull(callback, obj);
    }

    @SuppressWarnings("unused")
    public void destroyMediaPlayer(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoMediaPlayer player = mediaPlayerDict.get(Integer.toString(playerID));
        ZegoExpressUniAppEngine.mediaPlayerViewMap.remove(Integer.toString(playerID));
        if (player != null) {
            ZegoExpressEngine.getEngine().destroyMediaPlayer(player);
        }
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void mediaPlayerLoadResource(JSONObject map, final JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        String path = map.getString("path");
        ZegoMediaPlayer player = mediaPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            player.loadResource(path, new IZegoMediaPlayerLoadResourceCallback() {
                @Override
                public void onLoadResourceCallback(int i) {
                    callbackNotNull(callback, i);
                }
            });
        }
    }

    @SuppressWarnings("unused")
    public void mediaPlayerSetPlayerView(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoMediaPlayer player = mediaPlayerDict.get(Integer.toString(playerID));
        ZegoCanvas canvas = ZegoExpressUniAppEngine.mediaPlayerViewMap.get(Integer.toString(playerID));
        if (player != null) {
            player.setPlayerCanvas(canvas);
        }
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void mediaPlayerStart(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoMediaPlayer player = mediaPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            player.start();
        }
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void mediaPlayerStop(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoMediaPlayer player = mediaPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            player.stop();
        }
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void mediaPlayerPause(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoMediaPlayer player = mediaPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            player.pause();
        }
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void mediaPlayerResume(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoMediaPlayer player = mediaPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            player.resume();
        }
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void mediaPlayerSeekTo(JSONObject map, final JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoMediaPlayer player = mediaPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            long millisecond = map.getLong("millisecond");
            player.seekTo(millisecond, new IZegoMediaPlayerSeekToCallback() {
                @Override
                public void onSeekToTimeCallback(int i) {
                    callbackNotNull(callback, i);
                }
            });
        }
    }

    @SuppressWarnings("unused")
    public void mediaPlayerEnableRepeat(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoMediaPlayer player = mediaPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            boolean enable = map.getBoolean("enable");
            player.enableRepeat(enable);
        }
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void mediaPlayerEnableAux(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoMediaPlayer player = mediaPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            boolean enable = map.getBoolean("enable");
            player.enableAux(enable);
        }
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void mediaPlayerMuteLocal(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoMediaPlayer player = mediaPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            boolean mute = map.getBoolean("mute");
            player.muteLocal(mute);
        }
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void mediaPlayerSetVolume(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoMediaPlayer player = mediaPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            int volume = map.getIntValue("volume");
            player.setVolume(volume);
        }
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void mediaPlayerSetPlayVolume(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoMediaPlayer player = mediaPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            int volume = map.getIntValue("volume");
            player.setPlayVolume(volume);
        }
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void mediaPlayerSetPublishVolume(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoMediaPlayer player = mediaPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            int volume = map.getIntValue("volume");
            player.setPublishVolume(volume);
        }
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void mediaPlayerSetProgressInterval(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoMediaPlayer player = mediaPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            long millisecond = map.getLong("millisecond");
            player.setProgressInterval(millisecond);
        }
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void mediaPlayerSetAudioTrackIndex(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoMediaPlayer player = mediaPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            int index = map.getIntValue("index");
            player.setAudioTrackIndex(index);
        }
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void mediaPlayerSetVoiceChangerParam(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoMediaPlayer player = mediaPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            JSONObject param = map.getJSONObject("param");
            int audioChannel = map.getIntValue("audioChannel");
            ZegoVoiceChangerParam changerParam = new ZegoVoiceChangerParam();
            if (param != null) {
                changerParam.pitch = param.getFloat("pitch");
            }
            player.setVoiceChangerParam(ZegoMediaPlayerAudioChannel.getZegoMediaPlayerAudioChannel(audioChannel), changerParam);
        }
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void mediaPlayerTakeSnapshot(JSONObject map, final JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoMediaPlayer player = mediaPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            player.takeSnapshot(new IZegoMediaPlayerTakeSnapshotCallback() {
                @Override
                public void onPlayerTakeSnapshotResult(int i, android.graphics.Bitmap bitmap) {
                    JSONObject params = new JSONObject();
                    params.put("errorCode", i);
                    params.put("imageBase64", bitmapToBase64(bitmap));
                    callbackNotNull(callback, params);
                }
            });
        }
    }

    @SuppressWarnings("unused")
    public void mediaPlayerEnableAccurateSeek(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoMediaPlayer player = mediaPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            boolean enable = map.getBoolean("enable");
            JSONObject config = map.getJSONObject("config");
            ZegoAccurateSeekConfig seekConfig = new ZegoAccurateSeekConfig();
            if (config != null) {
                seekConfig.timeout = config.getLong("timeout");
            }
            player.enableAccurateSeek(enable, seekConfig);
        }
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void mediaPlayerSetNetWorkResourceMaxCache(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoMediaPlayer player = mediaPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            int time = map.getIntValue("time");
            int size = map.getIntValue("size");
            player.setNetWorkResourceMaxCache(time, size);
        }
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void mediaPlayerSetNetWorkBufferThreshold(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoMediaPlayer player = mediaPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            int threshold = map.getIntValue("threshold");
            player.setNetWorkBufferThreshold(threshold);
        }
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void mediaPlayerGetTotalDuration(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoMediaPlayer player = mediaPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            long totalDuration = player.getTotalDuration();
            callbackNotNull(callback, totalDuration);
        } else {
            callbackNotNull(callback);
        }
    }

    @SuppressWarnings("unused")
    public void mediaPlayerGetCurrentProgress(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoMediaPlayer player = mediaPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            long progress = player.getCurrentProgress();
            callbackNotNull(callback, progress);
        } else {
            callbackNotNull(callback);
        }
    }

    @SuppressWarnings("unused")
    public void mediaPlayerGetPlayVolume(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoMediaPlayer player = mediaPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            int volume = player.getPlayVolume();
            callbackNotNull(callback, volume);
        } else {
            callbackNotNull(callback);
        }
    }

    @SuppressWarnings("unused")
    public void mediaPlayerGetPublishVolume(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoMediaPlayer player = mediaPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            int volume = player.getPublishVolume();
            callbackNotNull(callback, volume);
        } else {
            callbackNotNull(callback);
        }
    }

    @SuppressWarnings("unused")
    public void mediaPlayerGetAudioTrackCount(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoMediaPlayer player = mediaPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            int audioTrackCount = player.getAudioTrackCount();
            callbackNotNull(callback, audioTrackCount);
        } else {
            callbackNotNull(callback);
        }
    }

    @SuppressWarnings("unused")
    public void mediaPlayerGetCurrentState(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoMediaPlayer player = mediaPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            ZegoMediaPlayerState state = player.getCurrentState();
            callbackNotNull(callback, state);
        } else {
            callbackNotNull(callback);
        }
    }

    @SuppressWarnings("unused")
    public void mediaPlayerGetNetWorkResourceCache(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoMediaPlayer player = mediaPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            ZegoNetWorkResourceCache resourceCache = player.getNetWorkResourceCache();
            JSONObject params = new JSONObject();
            params.put("time", resourceCache.time);
            params.put("size", resourceCache.size);
            callbackNotNull(callback, params);
        } else {
            callbackNotNull(callback);
        }
    }

    /** Audio Effect Player */
    @SuppressWarnings("unused")
    public void createAudioEffectPlayer(JSCallback callback) {
        ZegoAudioEffectPlayer player = ZegoExpressEngine.getEngine().createAudioEffectPlayer();
        audioEffectPlayerDict.put(Integer.toString(player.getIndex()), player);
        JSONObject obj = new JSONObject();
        obj.put("playerID", player.getIndex());
        callbackNotNull(callback, obj);
    }

    @SuppressWarnings("unused")
    public void destroyAudioEffectPlayer(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoAudioEffectPlayer player = audioEffectPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            ZegoExpressEngine.getEngine().destroyAudioEffectPlayer(player);
        }
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void audioEffectPlayerStart(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoAudioEffectPlayer player = audioEffectPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            int audioEffectID = map.getIntValue("audioEffectID");
            String path = map.getString("path");
            JSONObject config = map.getJSONObject("config");
            ZegoAudioEffectPlayConfig audioEffectPlayConfig = new ZegoAudioEffectPlayConfig();
            if (config != null) {
                audioEffectPlayConfig.isPublishOut = config.getBoolean("isPublishOut");
                audioEffectPlayConfig.playCount = config.getIntValue("playCount");
            }
            player.start(audioEffectID, path, audioEffectPlayConfig);
        }
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void audioEffectPlayerStop(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoAudioEffectPlayer player = audioEffectPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            int audioEffectID = map.getIntValue("audioEffectID");
            player.stop(audioEffectID);
        }
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void audioEffectPlayerPause(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoAudioEffectPlayer player = audioEffectPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            int audioEffectID = map.getIntValue("audioEffectID");
            player.pause(audioEffectID);
        }
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void audioEffectPlayerResume(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoAudioEffectPlayer player = audioEffectPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            int audioEffectID = map.getIntValue("audioEffectID");
            player.resume(audioEffectID);
        }
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void audioEffectPlayerStopAll(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoAudioEffectPlayer player = audioEffectPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            player.stopAll();
        }
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void audioEffectPlayerPauseAll(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoAudioEffectPlayer player = audioEffectPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            player.pauseAll();
        }
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void audioEffectPlayerResumeAll(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoAudioEffectPlayer player = audioEffectPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            player.resumeAll();
        }
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void audioEffectPlayerSeekTo(JSONObject map, final JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoAudioEffectPlayer player = audioEffectPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            long millisecond = map.getLong("millisecond");
            int audioEffectID = map.getIntValue("audioEffectID");
            player.seekTo(audioEffectID, millisecond, new IZegoAudioEffectPlayerSeekToCallback() {
                @Override
                public void onSeekToCallback(int i) {
                    callbackNotNull(callback, i);
                }
            });
        }
    }

    @SuppressWarnings("unused")
    public void audioEffectPlayerSetVolume(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoAudioEffectPlayer player = audioEffectPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            int volume = map.getIntValue("volume");
            int audioEffectID = map.getIntValue("audioEffectID");
            player.setVolume(audioEffectID, volume);
        }
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void audioEffectPlayerSetVolumeAll(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoAudioEffectPlayer player = audioEffectPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            int volume = map.getIntValue("volume");
            player.setVolumeAll(volume);
        }
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    public void audioEffectPlayerGetTotalDuration(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoAudioEffectPlayer player = audioEffectPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            int audioEffectID = map.getIntValue("audioEffectID");
            long duration = player.getTotalDuration(audioEffectID);
            callbackNotNull(callback, duration);
        } else {
            callbackNotNull(callback);
        }
    }

    @SuppressWarnings("unused")
    public void audioEffectPlayerGetCurrentProgress(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoAudioEffectPlayer player = audioEffectPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            int audioEffectID = map.getIntValue("audioEffectID");
            long progress = player.getCurrentProgress(audioEffectID);
            callbackNotNull(callback, progress);
        } else {
            callbackNotNull(callback);
        }
    }

    @SuppressWarnings("unused")
    public void audioEffectPlayerLoadResource(JSONObject map, final JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoAudioEffectPlayer player = audioEffectPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            int audioEffectID = map.getIntValue("audioEffectID");
            String path = map.getString("path");
            player.loadResource(audioEffectID, path, new IZegoAudioEffectPlayerLoadResourceCallback() {
                @Override
                public void onLoadResourceCallback(int i) {
                    callbackNotNull(callback, i);
                }
            });
        }
    }

    @SuppressWarnings("unused")
    public void audioEffectPlayerUnloadResource(JSONObject map, JSCallback callback) {
        int playerID = map.getIntValue("playerID");
        ZegoAudioEffectPlayer player = audioEffectPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            int audioEffectID = map.getIntValue("audioEffectID");
            player.unloadResource(audioEffectID);
        }
        callbackNotNull(callback);
    }

    private final IZegoMediaPlayerEventHandler mediaPlayerEventHandler = new IZegoMediaPlayerEventHandler() {
        @Override
        public void onMediaPlayerStateUpdate(ZegoMediaPlayer mediaPlayer, ZegoMediaPlayerState state, int errorCode) {
            super.onMediaPlayerStateUpdate(mediaPlayer, state, errorCode);

            sendMediaPlayerEvent("mediaPlayerStateUpdate", mediaPlayer.getIndex(), state.value(), errorCode);
        }

        @Override
        public void onMediaPlayerNetworkEvent(ZegoMediaPlayer mediaPlayer, ZegoMediaPlayerNetworkEvent networkEvent) {
            super.onMediaPlayerNetworkEvent(mediaPlayer, networkEvent);

            sendMediaPlayerEvent("mediaPlayerNetworkEvent", mediaPlayer.getIndex(), networkEvent.value());
        }

        @Override
        public void onMediaPlayerPlayingProgress(ZegoMediaPlayer mediaPlayer, long millisecond) {
            super.onMediaPlayerPlayingProgress(mediaPlayer, millisecond);

            sendMediaPlayerEvent("mediaPlayerPlayingProgress", mediaPlayer.getIndex(), millisecond);
        }

        @Override
        public void onMediaPlayerRecvSEI(ZegoMediaPlayer mediaPlayer, byte[] data) {
            super.onMediaPlayerRecvSEI(mediaPlayer, data);

            sendMediaPlayerEvent("mediaPlayerRecvSEI", mediaPlayer.getIndex(), ByteBuffer.wrap(data));
        }
    };

    private final IZegoMediaPlayerVideoHandler mediaPlayerVideoHandler = new IZegoMediaPlayerVideoHandler() {
        @Override
        public void onVideoFrame(ZegoMediaPlayer zegoMediaPlayer, ByteBuffer[] byteBuffers, int[] ints, ZegoVideoFrameParam zegoVideoFrameParam) {

            JSONObject videoFrameParamObj = new JSONObject();
            videoFrameParamObj.put("format", zegoVideoFrameParam.format.value());
            videoFrameParamObj.put("width", zegoVideoFrameParam.width);
            videoFrameParamObj.put("height", zegoVideoFrameParam.height);
            videoFrameParamObj.put("rotation", zegoVideoFrameParam.rotation);
            videoFrameParamObj.put("strides", zegoVideoFrameParam.strides);

            sendMediaPlayerEvent("mediaPlayerVideoFrame", zegoMediaPlayer.getIndex(), byteBuffers, ints, videoFrameParamObj);

        }
    };

    private final IZegoMediaPlayerAudioHandler mediaPlayerAudioHandler = new IZegoMediaPlayerAudioHandler() {
        @Override
        public void onAudioFrame(ZegoMediaPlayer zegoMediaPlayer, ByteBuffer byteBuffer, int i, ZegoAudioFrameParam zegoAudioFrameParam) {

            JSONObject audioFrameParamObj = new JSONObject();
            audioFrameParamObj.put("channel", zegoAudioFrameParam.channel.value());
            audioFrameParamObj.put("sampleRate", zegoAudioFrameParam.sampleRate.value());

            sendMediaPlayerEvent("mediaPlayerAudioFrame", zegoMediaPlayer.getIndex(), byteBuffer.array(), i, audioFrameParamObj);
        }
    };

    /** Private */
    @SuppressWarnings("unused")
    public void setPluginVersion(JSONObject map, JSCallback callback) {
        String version = map.getString("version");
        ZegoLog.log("*** Plugin Version: %s", version);
        callbackNotNull(callback);
    }

    @SuppressWarnings("unused")
    @JSMethod (uiThread = false)
    public void requestCameraAndAudioPermission() {
        String[] PERMISSIONS_STORAGE = {
                "android.permission.CAMERA",
                "android.permission.RECORD_AUDIO"};
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (ContextCompat.checkSelfPermission(mWXSDKInstance.getContext(), "android.permission.CAMERA") != PackageManager.PERMISSION_GRANTED
                    || ContextCompat.checkSelfPermission(mWXSDKInstance.getContext(), "android.permission.RECORD_AUDIO") != PackageManager.PERMISSION_GRANTED) {
                Activity activity = (Activity)mWXSDKInstance.getContext();
                activity.requestPermissions(PERMISSIONS_STORAGE, 101);
            }
        }
    }

    @SuppressWarnings("unused")
    @JSMethod (uiThread = false)
    public boolean getCameraAndAudioPermissionResult() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            return ContextCompat.checkSelfPermission(mWXSDKInstance.getContext(), "android.permission.CAMERA") == PackageManager.PERMISSION_GRANTED
                    && ContextCompat.checkSelfPermission(mWXSDKInstance.getContext(), "android.permission.RECORD_AUDIO") == PackageManager.PERMISSION_GRANTED;
        } else {
            return true;
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        int REQUEST_CODE_ADDRESS = 100;
        if (requestCode == REQUEST_CODE_ADDRESS) {
            if (grantResults[0] == PackageManager.PERMISSION_GRANTED && grantResults[1] == PackageManager.PERMISSION_GRANTED) {
                // Permission Granted 授予权限
                //处理授权之后逻辑

            } else {
                // Permission Denied 权限被拒绝
            }
        }
    }

    /**
     * bitmap 转base64
     * @param bitmap BitMap
     * @return base64
     */
    private static String bitmapToBase64(Bitmap bitmap) {
        String result = null;
        ByteArrayOutputStream baos = null;
        try {
            if (bitmap != null) {
                baos = new ByteArrayOutputStream();
                bitmap.compress(Bitmap.CompressFormat.JPEG, 100, baos);

                baos.flush();
                baos.close();

                byte[] bitmapBytes = baos.toByteArray();
                result = Base64.encodeToString(bitmapBytes, Base64.DEFAULT);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                if (baos != null) {
                    baos.flush();
                    baos.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return result;
    }
}

class ZegoPlayStreamStore {
    ZegoPlayerConfig config;
    ZegoCanvas canvas;
    boolean isPlaying;

    ZegoPlayStreamStore() {

    }
}

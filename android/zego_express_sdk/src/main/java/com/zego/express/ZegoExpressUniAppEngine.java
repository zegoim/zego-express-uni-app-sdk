package com.zego.express;

import android.app.Activity;
import android.app.Application;
import android.content.pm.PackageManager;
import android.os.Build;
import android.support.annotation.Nullable;
import android.support.v4.content.ContextCompat;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.taobao.weex.annotation.JSMethod;
import com.taobao.weex.bridge.JSCallback;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import im.zego.zegoexpress.ZegoExpressEngine;
import im.zego.zegoexpress.ZegoMediaPlayer;
import im.zego.zegoexpress.callback.IZegoDestroyCompletionCallback;
import im.zego.zegoexpress.callback.IZegoEventHandler;
import im.zego.zegoexpress.callback.IZegoIMSendCustomCommandCallback;
import im.zego.zegoexpress.callback.IZegoMediaPlayerLoadResourceCallback;
import im.zego.zegoexpress.callback.IZegoPublisherSetStreamExtraInfoCallback;
import im.zego.zegoexpress.constants.ZegoAudioCaptureStereoMode;
import im.zego.zegoexpress.constants.ZegoAudioChannel;
import im.zego.zegoexpress.constants.ZegoAudioCodecID;
import im.zego.zegoexpress.constants.ZegoEngineState;
import im.zego.zegoexpress.constants.ZegoLanguage;
import im.zego.zegoexpress.constants.ZegoOrientation;
import im.zego.zegoexpress.constants.ZegoPlayerMediaEvent;
import im.zego.zegoexpress.constants.ZegoPlayerState;
import im.zego.zegoexpress.constants.ZegoPlayerVideoLayer;
import im.zego.zegoexpress.constants.ZegoPublishChannel;
import im.zego.zegoexpress.constants.ZegoPublisherState;
import im.zego.zegoexpress.constants.ZegoRemoteDeviceState;
import im.zego.zegoexpress.constants.ZegoRoomState;
import im.zego.zegoexpress.constants.ZegoScenario;
import im.zego.zegoexpress.constants.ZegoUpdateType;
import im.zego.zegoexpress.constants.ZegoVideoCodecID;
import im.zego.zegoexpress.entity.ZegoAudioConfig;
import im.zego.zegoexpress.entity.ZegoCDNConfig;
import im.zego.zegoexpress.entity.ZegoCanvas;
import im.zego.zegoexpress.entity.ZegoEngineConfig;
import im.zego.zegoexpress.entity.ZegoLogConfig;
import im.zego.zegoexpress.entity.ZegoPlayStreamQuality;
import im.zego.zegoexpress.entity.ZegoPlayerConfig;
import im.zego.zegoexpress.entity.ZegoPublishStreamQuality;
import im.zego.zegoexpress.entity.ZegoRoomConfig;
import im.zego.zegoexpress.entity.ZegoStream;
import im.zego.zegoexpress.entity.ZegoUser;
import im.zego.zegoexpress.entity.ZegoVideoConfig;
import io.dcloud.feature.uniapp.common.UniModule;

public class ZegoExpressUniAppEngine extends UniModule {
    static HashMap<String, ZegoCanvas> playViewMap = new HashMap<String, ZegoCanvas>();
    static HashMap<String, ZegoCanvas> previewViewMap = new HashMap<String, ZegoCanvas>();

    HashMap<String, JSCallback> callBackEventDict = new HashMap<String, JSCallback>();
    HashMap<String, ZegoMediaPlayer> mediaPlayerDict = new HashMap<String, ZegoMediaPlayer>();

    static String kZegoExpressUniAppEngineEventKey = "eventKey";

    static String kZegoExpressUniAppEngineResultKey = "resultKey";

    private void sendEvent(String eventName,
                           Object params) {
        JSCallback callback = callBackEventDict.get(eventName);
        JSONObject result = new JSONObject();
        result.put(kZegoExpressUniAppEngineEventKey, eventName);
        result.put(kZegoExpressUniAppEngineResultKey, params);
        if (callback != null) {
            callback.invokeAndKeepAlive(result);
        }
    }

    @JSMethod(uiThread = true)
    public void on(String event, JSCallback callback) {
        if(callback != null) {
            callBackEventDict.put(event, callback);
        }
    }

    @JSMethod (uiThread = false)
    public void createEngine(Integer appID, String appSign, boolean isTestEnv, int scenario) {
        JSONObject param = new JSONObject();
        param.put("appSign", appSign);
        param.put("info", "触发了原生的create调用");
        param.put("appID", appID);
        sendEvent("", param);
        ZegoExpressEngine.createEngine(appID.longValue(), appSign, isTestEnv, ZegoScenario.getZegoScenario(scenario), (Application) this.mWXSDKInstance.getContext().getApplicationContext(), new IZegoEventHandler() {
            @Override
            public void onDebugError(int errorCode, String funcName, String info) {
                super.onDebugError(errorCode, funcName, info);

            }

            @Override
            public void onEngineStateUpdate(ZegoEngineState state) {
                super.onEngineStateUpdate(state);
                sendEvent("engineStateUpdate", state.value());
            }

            @Override
            public void onRoomStateUpdate(String roomID, ZegoRoomState state, int errorCode, org.json.JSONObject extendedData) {
                super.onRoomStateUpdate(roomID, state, errorCode, extendedData);

                JSONObject map = new JSONObject();
                map.put("roomID", roomID);
                map.put("state", state.value());
                map.put("errorCode", errorCode);
                map.put("extendedData", JSONObject.parse(extendedData.toString()));

                sendEvent("roomStateUpdate", map);
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
                JSONObject map = new JSONObject();
                map.put("roomID", roomID);
                map.put("updateType", updateType.value());
                map.put("userList", userListArray);

                sendEvent("roomUserUpdate", map);
            }


            @Override
            public void onRoomOnlineUserCountUpdate(String roomID, int count) {
                super.onRoomOnlineUserCountUpdate(roomID, count);
                JSONObject args = new JSONObject();
                args.put("roomID", roomID);
                args.put("count", count);
                sendEvent("roomOnlineUserCountUpdate", args);
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
                JSONObject args = new JSONObject();
                args.put("roomID", roomID);
                args.put("updateType", updateType.value());
                args.put("streamList", streamListArray);
                args.put("extendedData", extendedData);
                sendEvent("roomStreamUpdate", args);
            }

            @Override
            public void onPublisherStateUpdate(String streamID, ZegoPublisherState state, int errorCode, org.json.JSONObject extendedData) {
                super.onPublisherStateUpdate(streamID, state, errorCode, extendedData);

                JSONObject args = new JSONObject();
                args.put("streamID", streamID);
                args.put("state", state.value());
                args.put("errorCode", errorCode);
                args.put("extendedData", JSONObject.parse(extendedData.toString()));

                sendEvent("publisherStateUpdate", args);
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
                qualityMap.put("totalSendBytes", quality.totalSendBytes);
                qualityMap.put("audioSendBytes", quality.audioSendBytes);
                qualityMap.put("videoSendBytes", quality.videoSendBytes);

                JSONObject args = new JSONObject();
                args.put("streamID", streamID);
                args.put("qualityMap", qualityMap);

                sendEvent("publisherQualityUpdate", args);
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

                JSONObject args = new JSONObject();
                args.put("channel", channel.value());
                sendEvent("publisherCapturedVideoFirstFrame", args);
            }

            @Override
            public void onPublisherVideoSizeChanged(int width, int height, ZegoPublishChannel channel) {
                super.onPublisherVideoSizeChanged(width, height, channel);

                JSONObject args = new JSONObject();
                sendEvent("publisherVideoSizeChanged", args);
            }

            @Override
            public void onPlayerStateUpdate(String streamID, ZegoPlayerState state, int errorCode, org.json.JSONObject extendedData) {
                super.onPlayerStateUpdate(streamID, state, errorCode, extendedData);
                JSONObject args = new JSONObject();
                args.put("streamID", streamID);
                args.put("state", state.value());
                args.put("errorCode", errorCode);
                args.put("extendedData", JSONObject.parse(extendedData.toString()));
                sendEvent("playerStateUpdate", args);
            }

            @Override
            public void onPlayerQualityUpdate(String streamID, ZegoPlayStreamQuality quality) {
                super.onPlayerQualityUpdate(streamID, quality);

                JSONObject qualityMap = new JSONObject();
                qualityMap.put("videoRecvFPS", quality.videoRecvFPS);
                qualityMap.put("videoDecodeFPS", quality.videoDecodeFPS);
                qualityMap.put("videoRenderFPS", quality.videoRenderFPS);
                qualityMap.put("videoKBPS", quality.videoKBPS);
                qualityMap.put("audioRecvFPS", quality.audioRecvFPS);
                qualityMap.put("audioDecodeFPS", quality.audioDecodeFPS);
                qualityMap.put("audioRenderFPS", quality.audioRenderFPS);
                qualityMap.put("audioKBPS", quality.audioKBPS);
                qualityMap.put("rtt", quality.rtt);
                qualityMap.put("packetLostRate", quality.packetLostRate);
                qualityMap.put("peerToPeerPacketLostRate", quality.peerToPeerPacketLostRate);
                qualityMap.put("peerToPeerDelay", quality.peerToPeerDelay);
                qualityMap.put("level", quality.level.value());
                qualityMap.put("delay", quality.delay);
                qualityMap.put("isHardwareDecode", quality.isHardwareDecode);
                qualityMap.put("totalRecvBytes", quality.totalRecvBytes);
                qualityMap.put("audioRecvBytes", quality.audioRecvBytes);
                qualityMap.put("videoRecvBytes", quality.videoRecvBytes);

                JSONObject args = new JSONObject();
                args.put("streamID", streamID);
                args.put("qualityMap", qualityMap);
                sendEvent("playerQualityUpdate", args);
            }

            @Override
            public void onPlayerMediaEvent(String streamID, ZegoPlayerMediaEvent event) {
                super.onPlayerMediaEvent(streamID, event);

                JSONObject args = new JSONObject();
                args.put("streamID", streamID);
                args.put("event", event.value());
                sendEvent("playerMediaEvent", args);
            }

            @Override
            public void onPlayerRecvAudioFirstFrame(String streamID) {
                super.onPlayerRecvAudioFirstFrame(streamID);

                JSONObject args = new JSONObject();
                args.put("streamID", streamID);
                sendEvent("playerRecvAudioFirstFrame", args);
            }

            @Override
            public void onPlayerRecvVideoFirstFrame(String streamID) {
                super.onPlayerRecvVideoFirstFrame(streamID);

                JSONObject args = new JSONObject();
                args.put("streamID", streamID);
                sendEvent("playerRecvVideoFirstFrame", args);
            }

            @Override
            public void onPlayerRenderVideoFirstFrame(String streamID) {
                super.onPlayerRenderVideoFirstFrame(streamID);

                JSONObject args = new JSONObject();
                args.put("streamID", streamID);
                sendEvent("playerRenderVideoFirstFrame", args);
            }

            @Override
            public void onPlayerVideoSizeChanged(String streamID, int width, int height) {
                super.onPlayerVideoSizeChanged(streamID, width, height);

                JSONObject args = new JSONObject();
                args.put("streamID", streamID);
                args.put("width", width);
                args.put("height", height);
                sendEvent("playerVideoSizeChanged", args);
            }

            @Override
            public void onCapturedSoundLevelUpdate(float soundLevel) {
                super.onCapturedSoundLevelUpdate(soundLevel);
                JSONObject args = new JSONObject();
                args.put("soundLevel", soundLevel);
                sendEvent("capturedSoundLevelUpdate", args);
            }

            @Override
            public void onRemoteSoundLevelUpdate(HashMap<String, Float> soundLevels) {
                super.onRemoteSoundLevelUpdate(soundLevels);

                JSONObject soundLevelsMap = new JSONObject();
                for(Map.Entry<String, Float> entry: soundLevels.entrySet()) {
                    soundLevelsMap.put(entry.getKey(), entry.getValue());
                }
                JSONObject args = new JSONObject();
                args.put("soundLevelsMap", soundLevelsMap);
                sendEvent("remoteSoundLevelUpdate", args);
            }

            @Override
            public void onDeviceError(int errorCode, String deviceName) {
                super.onDeviceError(errorCode, deviceName);

                JSONObject args = new JSONObject();
                args.put("errorCode", errorCode);
                args.put("deviceName", deviceName);
                sendEvent("deviceError", args);
            }

            @Override
            public void onRemoteCameraStateUpdate(String streamID, ZegoRemoteDeviceState state) {
                super.onRemoteCameraStateUpdate(streamID, state);
                JSONObject args = new JSONObject();
                args.put("streamID", streamID);
                args.put("state", state.value());
                sendEvent("remoteCameraStateUpdate", args);
            }

            @Override
            public void onRemoteMicStateUpdate(String streamID, ZegoRemoteDeviceState state) {
                super.onRemoteMicStateUpdate(streamID, state);

                JSONObject args = new JSONObject();
                args.put("streamID", streamID);
                args.put("state", state.value());
                sendEvent("remoteMicStateUpdate", args);
            }

            @Override
            public void onIMRecvCustomCommand(String roomID, ZegoUser fromUser, String command) {
                super.onIMRecvCustomCommand(roomID, fromUser, command);
                JSONObject userMap = new JSONObject();
                userMap.put("userID", fromUser.userID);
                userMap.put("userName", fromUser.userName);
                JSONObject map = new JSONObject();
                map.put("roomID", roomID);
                map.put("fromUser", userMap);
                map.put("command", command);

                sendEvent("IMRecvCustomCommand", map);
            }
        });
    }

    @JSMethod (uiThread = true)
    public void destroyEngine(final JSCallback callback) {
        ZegoExpressEngine.destroyEngine(new IZegoDestroyCompletionCallback() {
            @Override
            public void onDestroyCompletion() {
                if (callback != null) {
                    callback.invoke(true);
                }
            }
        });
    }

    @JSMethod (uiThread = false)
    public void startPreview(Integer channel) {
        ZegoCanvas canvas = previewViewMap.get(channel.toString());
        ZegoExpressEngine.getEngine().startPreview(canvas, ZegoPublishChannel.getZegoPublishChannel(channel));
    }

    @JSMethod (uiThread = false)
    public void  startPlayingStream(String streamID, JSONObject config) {
        ZegoCanvas canvas = playViewMap.get(streamID);
        if (config == null) {
            ZegoExpressEngine.getEngine().startPlayingStream(streamID, canvas);
            return;
        }
        ZegoPlayerConfig configP = new ZegoPlayerConfig();
        ZegoCDNConfig cdnConfig = new ZegoCDNConfig();
        if (config.getJSONObject("cdnConfig") != null) {
            cdnConfig.authParam = config.getJSONObject("cdnConfig").getString("authParam");
            cdnConfig.url = config.getJSONObject("cdnConfig").getString("url");
            configP.cdnConfig = cdnConfig;
        }
        if (config.getInteger("videoLayer") != null) {
            configP.videoLayer = ZegoPlayerVideoLayer.getZegoPlayerVideoLayer(config.getIntValue("videoLayer"));
        }
        ZegoExpressEngine.getEngine().startPlayingStream(streamID, canvas, configP);
    }

    @JSMethod (uiThread = false)
    public void setEngineConfig(JSONObject config) {
        ZegoEngineConfig configObj = new ZegoEngineConfig();
        JSONObject logConfig = config.getJSONObject("logConfig");
        if(logConfig != null) {
            ZegoLogConfig logConfigObj = new ZegoLogConfig();
            String logPath = logConfig.getString("logPath");
            if(logPath != null) {
                logConfigObj.logPath = logPath;
            }

            logConfigObj.logSize = logConfig.getIntValue("logSize");
            configObj.logConfig = logConfigObj;
        }

        JSONObject advancedConfig = config.getJSONObject("advancedConfig");
        if(advancedConfig != null) {
            for(Map.Entry<String, Object> entry: advancedConfig.entrySet()) {
                configObj.advancedConfig.put(entry.getKey(), entry.getValue().toString());
            }
        }

        ZegoExpressEngine.setEngineConfig(configObj);
    }

    @JSMethod (uiThread = false)
    public void setDebugVerbose(boolean enable, int language) {
        ZegoExpressEngine.getEngine().setDebugVerbose(enable, ZegoLanguage.getZegoLanguage(language));
    }

    @JSMethod (uiThread = false)
    public void uploadLog() {
        ZegoExpressEngine.getEngine().uploadLog();

    }

    @JSMethod (uiThread = false)
    public void setAppOrientation(int orientation, int channel) {
        ZegoExpressEngine.getEngine().setAppOrientation(ZegoOrientation.getZegoOrientation(orientation), ZegoPublishChannel.getZegoPublishChannel(channel));
    }

    @JSMethod (uiThread = false)
    public String getVersion() {
        return ZegoExpressEngine.getVersion();
    }

    @JSMethod (uiThread = false)
    public void loginRoom(String roomID, JSONObject user, JSONObject config) {
        ZegoUser userObj = new ZegoUser(user.getString("userID"), user.getString("userName"));

        if(config != null) {
            ZegoRoomConfig roomConfigObj = new ZegoRoomConfig();
            roomConfigObj.isUserStatusNotify = config.getBoolean("userUpdate");
            roomConfigObj.maxMemberCount = config.getIntValue("maxMemberCount");
            roomConfigObj.token = config.getString("token");

            ZegoExpressEngine.getEngine().loginRoom(roomID, userObj, roomConfigObj);
        } else {
            ZegoExpressEngine.getEngine().loginRoom(roomID, userObj);
        }
    }

    @JSMethod (uiThread = false)
    public void logoutRoom(String roomID) {
        ZegoExpressEngine.getEngine().logoutRoom(roomID);
    }

    @JSMethod (uiThread = false)
    public void startPublishingStream(String streamID, int channel) {
        ZegoExpressEngine.getEngine().startPublishingStream(streamID, ZegoPublishChannel.getZegoPublishChannel(channel));
    }

    @JSMethod (uiThread = false)
    public void stopPublishingStream(int channel) {
        ZegoExpressEngine.getEngine().stopPublishingStream(ZegoPublishChannel.getZegoPublishChannel(channel));
    }

    @JSMethod (uiThread = false)
    public void setStreamExtraInfo(String extraInfo, final JSCallback callback) {
        ZegoExpressEngine.getEngine().setStreamExtraInfo(extraInfo, new IZegoPublisherSetStreamExtraInfoCallback() {
            @Override
            public void onPublisherSetStreamExtraInfoResult(int i) {
                if (callback != null) {
                    callback.invoke(i);
                }
            }
        });
    }

    @JSMethod (uiThread = false)
    public void setVideoConfig(JSONObject config, int channel) {
        ZegoVideoConfig configObj = new ZegoVideoConfig();
        configObj.captureWidth = config.getIntValue("captureWidth");
        configObj.captureHeight = config.getIntValue("captureHeight");
        configObj.encodeWidth = config.getIntValue("encodeWidth");
        configObj.encodeHeight = config.getIntValue("encodeHeight");
        configObj.bitrate = config.getIntValue("bitrate");
        configObj.fps = config.getIntValue("fps");
        configObj.codecID = ZegoVideoCodecID.getZegoVideoCodecID(config.getIntValue("codecID"));

        ZegoExpressEngine.getEngine().setVideoConfig(configObj, ZegoPublishChannel.getZegoPublishChannel(channel));
    }

    @JSMethod (uiThread = false)
    public JSONObject getVideoConfig(int channel) {
        ZegoVideoConfig config = ZegoExpressEngine.getEngine().getVideoConfig(ZegoPublishChannel.getZegoPublishChannel(channel));

        JSONObject map = new JSONObject();
        map.put("captureWidth", config.captureWidth);
        map.put("captureHeight", config.captureHeight);
        map.put("encodeWidth", config.encodeWidth);
        map.put("encodeHeight", config.encodeHeight);
        map.put("bitrate", config.bitrate);
        map.put("fps", config.fps);
        map.put("codecID", config.codecID.value());

        return map;
    }

    @JSMethod (uiThread = false)
    public void setAudioConfig(JSONObject config) {
        ZegoAudioConfig configObj = new ZegoAudioConfig();
        configObj.bitrate = config.getIntValue("bitrate");
        configObj.channel = ZegoAudioChannel.getZegoAudioChannel(config.getIntValue("channel"));
        configObj.codecID = ZegoAudioCodecID.getZegoAudioCodecID(config.getIntValue("codecID"));

        ZegoExpressEngine.getEngine().setAudioConfig(configObj);
    }

    @JSMethod (uiThread = false)
    public JSONObject getAudioConfig() {
        ZegoAudioConfig config = ZegoExpressEngine.getEngine().getAudioConfig();

        JSONObject map = new JSONObject();
        map.put("bitrate", config.bitrate);
        map.put("channel", config.channel.value());
        map.put("codecID", config.codecID.value());

        return map;
    }

    @JSMethod (uiThread = false)
    public void enableTrafficControl(boolean enable, int property) {
        ZegoExpressEngine.getEngine().enableTrafficControl(enable, property);

    }

    @JSMethod (uiThread = false)
    public void mutePublishStreamAudio(boolean mute, int channel) {
        ZegoExpressEngine.getEngine().mutePublishStreamAudio(mute, ZegoPublishChannel.getZegoPublishChannel(channel));

    }

    @JSMethod (uiThread = false)
    public void mutePublishStreamVideo(boolean mute, int channel) {
        ZegoExpressEngine.getEngine().mutePublishStreamVideo(mute, ZegoPublishChannel.getZegoPublishChannel(channel));

    }

    @JSMethod (uiThread = false)
    public void setAudioCaptureStereoMode(int mode) {
        ZegoExpressEngine.getEngine().setAudioCaptureStereoMode(ZegoAudioCaptureStereoMode.getZegoAudioCaptureStereoMode(mode));
    }

    @JSMethod (uiThread = false)
    public void setCaptureVolume(int volume) {
        ZegoExpressEngine.getEngine().setCaptureVolume(volume);
    }

    @JSMethod (uiThread = false)
    public void setPlayVolume(String streamID, int volume) {
        ZegoExpressEngine.getEngine().setPlayVolume(streamID, volume);

    }

    @JSMethod (uiThread = false)
    public void enableHardwareEncoder(boolean enable) {
        ZegoExpressEngine.getEngine().enableHardwareEncoder(enable);
    }

    @JSMethod (uiThread = false)
    public void enableCamera(boolean enable, Integer channel) {
        ZegoExpressEngine.getEngine().enableCamera(enable,ZegoPublishChannel.getZegoPublishChannel(channel));
    }

    @JSMethod (uiThread = false)
    public void mutePlayStreamAudio(String streamID, boolean mute) {
        ZegoExpressEngine.getEngine().mutePlayStreamAudio(streamID, mute);
    }

    @JSMethod (uiThread = false)
    public void mutePlayStreamVideo(String streamID, boolean mute) {
        ZegoExpressEngine.getEngine().mutePlayStreamVideo(streamID, mute);

    }

    @JSMethod (uiThread = false)
    public void enableHardwareDecoder(boolean enable) {
        ZegoExpressEngine.getEngine().enableHardwareDecoder(enable);
    }

    @JSMethod (uiThread = false)
    public void useFrontCamera(boolean enable, int channel) {
        ZegoExpressEngine.getEngine().useFrontCamera(enable, ZegoPublishChannel.getZegoPublishChannel(channel));
    }


    @JSMethod (uiThread = false)
    public JSONObject createMediaPlayer() {
        ZegoMediaPlayer player = ZegoExpressEngine.getEngine().createMediaPlayer();
        mediaPlayerDict.put(Integer.toString(player.getIndex()), player);
        JSONObject obj = new JSONObject();
        obj.put("playerID", player.getIndex());
        return obj;
    }

    @JSMethod (uiThread = false)
    public void destroyMediaPlayer(int playerID) {
        ZegoMediaPlayer player = mediaPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            ZegoExpressEngine.getEngine().destroyMediaPlayer(player);
        }
    }

    @JSMethod (uiThread = false)
    public void startMediaPlayer(int playerID) {
        ZegoMediaPlayer player = mediaPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            player.start();
        }
    }

    @JSMethod (uiThread = false)
    public void enableMediaPlayerAux(int playerID, boolean enable) {
        ZegoMediaPlayer player = mediaPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            player.enableAux(enable);
        }
    }

    @JSMethod (uiThread = true)
    public void loadResource(int playerID, String resource, final JSCallback callback) {
        ZegoMediaPlayer player = mediaPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            player.loadResource(resource, new IZegoMediaPlayerLoadResourceCallback() {
                @Override
                public void onLoadResourceCallback(int i) {
                    if (callback != null) {
                        callback.invoke(i);
                    }
                }
            });
        }
    }

    @JSMethod (uiThread = false)
    public void stopMediaPlayer(int playerID) {
        ZegoMediaPlayer player = mediaPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            player.stop();
        }
    }

    @JSMethod (uiThread = false)
    public void pauseMediaPlayer(int playerID) {
        ZegoMediaPlayer player = mediaPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            player.pause();
        }
    }

    @JSMethod (uiThread = false)
    public void resumeMediaPlayer(int playerID) {
        ZegoMediaPlayer player = mediaPlayerDict.get(Integer.toString(playerID));
        if (player != null) {
            player.resume();
        }
    }

    @JSMethod (uiThread = false)
    public void sendCustomCommand(String roomID, String command, JSONArray toUserList, final JSCallback callback) {
        ArrayList<ZegoUser> userListArray = new ArrayList<ZegoUser>();
        for (Object userOBjMap : toUserList) {
            JSONObject userMap = (JSONObject) JSONObject.toJSON(userOBjMap);
            ZegoUser user = new ZegoUser(userMap.getString("userID"), userMap.getString("userName"));
            userListArray.add(user);
        }
        ZegoExpressEngine.getEngine().sendCustomCommand(roomID, command, userListArray, new IZegoIMSendCustomCommandCallback() {
            @Override
            public void onIMSendCustomCommandResult(int i) {
                if (callback != null) {
                    callback.invoke(i);
                }
            }
        });
    }

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

    @JSMethod (uiThread = false)
    public boolean getCameraAndAudioPermissionResult() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (ContextCompat.checkSelfPermission(mWXSDKInstance.getContext(), "android.permission.CAMERA") != PackageManager.PERMISSION_GRANTED
                    || ContextCompat.checkSelfPermission(mWXSDKInstance.getContext(), "android.permission.RECORD_AUDIO") != PackageManager.PERMISSION_GRANTED) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }

    private final int REQUEST_CODE_ADDRESS = 100;

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        switch (requestCode) {
            case REQUEST_CODE_ADDRESS:
                if (grantResults[0] == PackageManager.PERMISSION_GRANTED && grantResults[1] ==PackageManager.PERMISSION_GRANTED) {
                    // Permission Granted 授予权限
                    //处理授权之后逻辑

                } else {
                    // Permission Denied 权限被拒绝
                }

                break;
            default:
                break;
        }
    }
}

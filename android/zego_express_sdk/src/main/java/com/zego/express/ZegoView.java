package com.zego.express;

import android.content.Context;
import android.support.annotation.NonNull;
import android.util.Log;
import android.view.TextureView;

import com.taobao.weex.utils.WXLogUtils;

import java.util.Map;

import im.zego.zegoexpress.ZegoExpressEngine;
import im.zego.zegoexpress.constants.ZegoPublishChannel;
import im.zego.zegoexpress.constants.ZegoViewMode;
import im.zego.zegoexpress.entity.ZegoCanvas;
import io.dcloud.feature.uniapp.UniSDKInstance;
import io.dcloud.feature.uniapp.dom.AbsAttr;
import io.dcloud.feature.uniapp.ui.action.AbsComponentData;
import io.dcloud.feature.uniapp.ui.component.AbsVContainer;
import io.dcloud.feature.uniapp.ui.component.UniComponent;
import io.dcloud.feature.uniapp.ui.component.UniComponentProp;

public class ZegoView extends UniComponent<TextureView> {

    ZegoExpressEngine engine;

    String streamID;
    Boolean isPreviewMode = false;
    Integer channel = 0;

    int viewMode = 0;

    public ZegoView(UniSDKInstance instance, AbsVContainer parent, AbsComponentData basicComponentData) {
        super(instance, parent, basicComponentData);
        engine =  ZegoExpressEngine.getEngine();
        AbsAttr attrs = basicComponentData.getAttrs();
        if (attrs.get("isPreviewMode") != null) {
            isPreviewMode = Boolean.parseBoolean(attrs.get("isPreviewMode").toString());
        }
        if (attrs.get("streamID") != null) {
            streamID = attrs.get("streamID").toString();
        }
        if (attrs.get("viewMode") != null) {
            viewMode = Integer.parseInt(attrs.get("viewMode").toString());
        }
        if (attrs.get("channel") != null) {
            viewMode = Integer.parseInt(attrs.get("channel").toString());
        }
    }

    @Override
    protected TextureView initComponentHostView(@NonNull Context context) {
        return new TextureView(context);
    }

    @Override
    protected void onHostViewInitialized(TextureView host) {
        super.onHostViewInitialized(host);
        ZegoCanvas canvas = new ZegoCanvas(getHostView());

        canvas.viewMode = ZegoViewMode.getZegoViewMode(this.viewMode);
        if (isPreviewMode) {
            ZegoExpressUniAppEngine.previewViewMap.put(channel.toString(), canvas);
            engine.startPreview(canvas);
        } else {
            if (streamID == null) {
                WXLogUtils.e("error: please offer legal stream ID");
                return;
            }
            ZegoPlayStreamStore store = ZegoExpressUniAppEngine.playViewMap.get(streamID);
            if (store == null) {
                store = new ZegoPlayStreamStore();
            }
            store.canvas = canvas;
            ZegoExpressUniAppEngine.playViewMap.put(streamID, store);
            engine.startPlayingStream(streamID, canvas);
        }
    }


    @Override
    public void destroy() {
        super.destroy();
        if (ZegoExpressEngine.getEngine() != null) {
            if (isPreviewMode) {
                engine.stopPreview(ZegoPublishChannel.getZegoPublishChannel(channel));
                ZegoExpressUniAppEngine.previewViewMap.remove(channel.toString());
            } else {
                engine.stopPlayingStream(streamID);
                ZegoExpressUniAppEngine.playViewMap.remove(streamID);
            }

        }
    }

    @UniComponentProp(name = "viewMode")
    public void setViewMode(int viewMode) {
        this.viewMode = viewMode;
    }

    @UniComponentProp(name = "streamID")
    public void setStreamID(String streamIDNew) {
        this.streamID = streamID;
    }

    @UniComponentProp(name = "isPreviewMode")
    public void setIsPreviewMode(Boolean isPreviewModeNew) {
        this.isPreviewMode = isPreviewModeNew;
    }

    @UniComponentProp(name = "channel")
    public void setIsPreviewMode(int channel) {
        this.channel = channel;
    }

    @Override
    public void updateAttrs(Map<String, Object> attrs) {
        super.updateAttrs(attrs);
        if (attrs.get("isPreviewMode") != null) {
            boolean isPreviewModeNew = Boolean.parseBoolean(attrs.get("isPreviewMode").toString());
            if (isPreviewModeNew != this.isPreviewMode) {
                ZegoCanvas canvas = new ZegoCanvas(this.getHostView());
                canvas.viewMode = ZegoViewMode.getZegoViewMode(viewMode);
                if (isPreviewModeNew) {
                    ZegoExpressEngine.getEngine().stopPlayingStream(streamID);
                    ZegoExpressEngine.getEngine().startPreview(canvas);
                } else {
                    ZegoExpressEngine.getEngine().stopPreview();
                    ZegoExpressEngine.getEngine().startPlayingStream(streamID, canvas);
                }
            }
        }

        if (attrs.get("streamID") != null) {
            String streamIDNew = attrs.get("streamID").toString();
            if (!(streamIDNew.equals(streamID))) {
                if (!isPreviewMode) {
                    ZegoCanvas canvas = new ZegoCanvas(this.getHostView());
                    canvas.viewMode = ZegoViewMode.getZegoViewMode(viewMode);
                    ZegoExpressEngine.getEngine().startPlayingStream(streamIDNew, canvas);
                } else {
                    System.out.println("error: streamID is invalid in preview mode");
                }
            }
        }
    }

    @Override
    protected void onCreate() {
        super.onCreate();
    }

}

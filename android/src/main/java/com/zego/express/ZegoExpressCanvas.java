package com.zego.express;

import android.content.Context;
import android.support.annotation.NonNull;
import android.util.Log;
import android.view.TextureView;

import java.util.Map;

import im.zego.zegoexpress.ZegoExpressEngine;
import im.zego.zegoexpress.constants.ZegoViewMode;
import im.zego.zegoexpress.entity.ZegoCanvas;
import io.dcloud.feature.uniapp.UniSDKInstance;
import io.dcloud.feature.uniapp.dom.AbsAttr;
import io.dcloud.feature.uniapp.ui.action.AbsComponentData;
import io.dcloud.feature.uniapp.ui.component.AbsVContainer;
import io.dcloud.feature.uniapp.ui.component.UniComponent;
import io.dcloud.feature.uniapp.ui.component.UniComponentProp;

public class ZegoExpressCanvas extends UniComponent<TextureView> {

    ZegoExpressEngine engine;

    String streamID;
    Boolean isPreviewMode = false;
    int viewMode = 0;

    public ZegoExpressCanvas(UniSDKInstance instance, AbsVContainer parent, AbsComponentData basicComponentData) {
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
    }

    @Override
    protected TextureView initComponentHostView(@NonNull Context context) {
        return new TextureView(getInstance().getContext());
    }

    @Override
    protected void onHostViewInitialized(TextureView host) {
        super.onHostViewInitialized(host);
        ZegoCanvas canvas = new ZegoCanvas(getHostView());
        canvas.viewMode = ZegoViewMode.getZegoViewMode(this.viewMode);
        if (isPreviewMode) {
            engine.startPreview(canvas);
        } else {
            if (streamID == null) {
                System.out.println("error: please offer legal stream ID");
                return;
            }
            engine.startPlayingStream(streamID, canvas);
        }
    }


    @Override
    public void destroy() {
        super.destroy();
        if (ZegoExpressEngine.getEngine() != null) {
            engine.stopPreview();
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

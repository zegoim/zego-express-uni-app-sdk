package com.zego.express;

import android.content.Context;
import android.support.annotation.NonNull;
import android.util.Log;
import android.view.SurfaceView;
import android.view.TextureView;
import android.view.View;
import android.widget.FrameLayout;

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

public class ZegoPlayView extends UniComponent<View> {

    private Integer canvasType = 0;
    private Integer viewMode = 0;
    private String streamID = "";
    private TextureView canvasView = null;

    public ZegoPlayView(UniSDKInstance instance, AbsVContainer parent, AbsComponentData componentData) {
        super(instance, parent, componentData);
        AbsAttr attrs = componentData.getAttrs();
        if (attrs.get("viewMode") != null) {
            viewMode = Integer.parseInt(attrs.get("viewMode").toString());
        }
        if (attrs.get("canvasType") != null) {
            canvasType = Integer.parseInt(attrs.get("canvasType").toString());
        }
        if (attrs.get("streamID") != null) {
            streamID = attrs.get("streamID").toString();
        }
    }

    @Override
    protected View initComponentHostView(@NonNull Context context) {
        if (canvasType == 0) {
            return new  SurfaceView(getInstance().getContext());
        } else {
            FrameLayout layout = new FrameLayout(context.getApplicationContext());
            canvasView = new TextureView(context.getApplicationContext());
            layout.addView(canvasView);
            return layout;
        }
    }

    @Override
    protected void onHostViewInitialized(View host) {
        super.onHostViewInitialized(host);
        View canvasView = this.canvasView;
        if (canvasType == 0) {
            canvasView = getHostView();
        }
        ZegoCanvas canvas = new ZegoCanvas(canvasView);
        canvas.viewMode = ZegoViewMode.getZegoViewMode(viewMode);

        ZegoPlayStreamStore store = ZegoExpressUniAppEngine.playViewMap.get(streamID);
        if (store == null) {
            store = new ZegoPlayStreamStore();
        }
        store.canvas = canvas;

        if (store.isPlaying) {
            ZegoExpressEngine.getEngine().startPlayingStream(streamID, store.canvas, store.config);
        }
        ZegoExpressUniAppEngine.playViewMap.put(streamID, store);
    }

    @Override
    public void destroy() {
        super.destroy();
        if (ZegoExpressEngine.getEngine() != null) {
            ZegoExpressEngine.getEngine().stopPlayingStream(streamID);
            ZegoExpressUniAppEngine.playViewMap.remove(streamID);
        }
    }

    @UniComponentProp(name = "viewMode")
    public void setViewMode(Integer viewMode) {
        ZegoPlayStreamStore store = ZegoExpressUniAppEngine.playViewMap.get(streamID);
        store.canvas.viewMode = ZegoViewMode.getZegoViewMode(viewMode);
        ZegoExpressUniAppEngine.playViewMap.put(streamID, store);
        this.viewMode = viewMode;
    }

    @UniComponentProp(name = "streamID")
    public void setStreamID(String streamID) {
        ZegoPlayStreamStore store = ZegoExpressUniAppEngine.playViewMap.get(this.streamID);
        ZegoExpressUniAppEngine.playViewMap.remove(this.streamID);
        ZegoExpressUniAppEngine.playViewMap.put(streamID, store);

        if (store.isPlaying) {
            ZegoExpressEngine.getEngine().startPlayingStream(streamID, store.canvas, store.config);
        }
        this.streamID = streamID;
    }

    @Override
    public void updateAttrs(Map<String, Object> attrs) {
        super.updateAttrs(attrs);
    }

    @Override
    protected void onCreate() {
        super.onCreate();
    }
}

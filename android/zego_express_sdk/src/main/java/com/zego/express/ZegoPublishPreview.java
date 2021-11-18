package com.zego.express;

import android.content.Context;
import androidx.annotation.NonNull;
import android.util.Log;
import android.view.SurfaceView;
import android.view.TextureView;
import android.view.View;
import android.widget.FrameLayout;

import java.util.Map;

import im.zego.zegoexpress.ZegoExpressEngine;
import im.zego.zegoexpress.constants.ZegoPublishChannel;
import im.zego.zegoexpress.constants.ZegoViewMode;
import im.zego.zegoexpress.entity.ZegoCanvas;
import im.zego.zegoexpress.internal.ZegoExpressEngineInternalImpl;
import io.dcloud.feature.uniapp.UniSDKInstance;
import io.dcloud.feature.uniapp.dom.AbsAttr;
import io.dcloud.feature.uniapp.ui.action.AbsComponentData;
import io.dcloud.feature.uniapp.ui.component.AbsVContainer;
import io.dcloud.feature.uniapp.ui.component.UniComponent;
import io.dcloud.feature.uniapp.ui.component.UniComponentProp;

public class ZegoPublishPreview extends UniComponent<View> {

    private Integer canvasType = 0;
    private Integer viewMode = 0;
    private Integer channel = 0;
    private TextureView canvasView = null;

    public ZegoPublishPreview(UniSDKInstance instance, AbsVContainer parent, AbsComponentData componentData) {
        super(instance, parent, componentData);
        AbsAttr attrs = componentData.getAttrs();
        if (attrs.get("viewMode") != null) {
            viewMode = Integer.parseInt(attrs.get("viewMode").toString());
        }
        if (attrs.get("channel") != null) {
            channel = Integer.parseInt(attrs.get("channel").toString());
        }
        if (attrs.get("canvasType") != null) {
            canvasType = Integer.parseInt(attrs.get("canvasType").toString());
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
        ZegoExpressUniAppEngine.previewViewMap.put(channel.toString(), canvas);
    }

    @Override
    public void destroy() {
        super.destroy();
        if (ZegoExpressEngine.getEngine() != null) {
            ZegoExpressEngine.getEngine().stopPreview(ZegoPublishChannel.getZegoPublishChannel(channel));
            ZegoExpressUniAppEngine.previewViewMap.remove(channel.toString());
        }
    }

    @UniComponentProp(name = "viewMode")
    public void setViewMode(Integer viewMode) {
        ZegoCanvas canvas = ZegoExpressUniAppEngine.previewViewMap.get(channel.toString());
        canvas.viewMode = ZegoViewMode.getZegoViewMode(viewMode);
        ZegoExpressUniAppEngine.previewViewMap.put(channel.toString(), canvas);
        this.viewMode = viewMode;
    }

    @UniComponentProp(name = "channel")
    public void setChannel(Integer channel) {
        ZegoCanvas canvas = ZegoExpressUniAppEngine.previewViewMap.get(this.channel.toString());
        ZegoExpressUniAppEngine.previewViewMap.remove(this.channel.toString());
        ZegoExpressUniAppEngine.previewViewMap.put(channel.toString(), canvas);
        this.channel = channel;
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

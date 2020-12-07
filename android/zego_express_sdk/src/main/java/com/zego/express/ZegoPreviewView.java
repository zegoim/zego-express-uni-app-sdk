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

public class ZegoPreviewView extends UniComponent<TextureView> {
    ZegoExpressEngine engine;

    Integer channel = 0;

    int viewMode = 0;

    public ZegoPreviewView(UniSDKInstance instance, AbsVContainer parent, AbsComponentData basicComponentData) {
        super(instance, parent, basicComponentData);
        engine =  ZegoExpressEngine.getEngine();
        AbsAttr attrs = basicComponentData.getAttrs();
        if (attrs.get("viewMode") != null) {
            viewMode = Integer.parseInt(attrs.get("viewMode").toString());
        }
        if (attrs.get("channel") != null) {
            viewMode = Integer.parseInt(attrs.get("channel").toString());
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
        ZegoExpressUniAppEngine.previewViewMap.put(channel.toString(), canvas);
        engine.startPreview(canvas);
    }


    @Override
    public void destroy() {
        super.destroy();
        if (ZegoExpressEngine.getEngine() != null) {
            engine.stopPreview(ZegoPublishChannel.getZegoPublishChannel(channel));
            ZegoExpressUniAppEngine.previewViewMap.remove(channel.toString());
        }
    }

    @UniComponentProp(name = "viewMode")
    public void setViewMode(int viewMode) {
        this.viewMode = viewMode;
    }

    @UniComponentProp(name = "channel")
    public void setIsPreviewMode(int channel) {
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

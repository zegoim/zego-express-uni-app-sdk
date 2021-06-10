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
import im.zego.zegoexpress.ZegoMediaPlayer;
import im.zego.zegoexpress.constants.ZegoViewMode;
import im.zego.zegoexpress.entity.ZegoCanvas;
import io.dcloud.feature.uniapp.UniSDKInstance;
import io.dcloud.feature.uniapp.dom.AbsAttr;
import io.dcloud.feature.uniapp.ui.action.AbsComponentData;
import io.dcloud.feature.uniapp.ui.component.AbsVContainer;
import io.dcloud.feature.uniapp.ui.component.UniComponent;
import io.dcloud.feature.uniapp.ui.component.UniComponentProp;

public class ZegoMediaPlayerView extends UniComponent<View> {

    private Integer playerID = 0;
    private Integer canvasType = 0;
    private TextureView canvasView = null;

    public ZegoMediaPlayerView(UniSDKInstance instance, AbsVContainer parent, AbsComponentData componentData) {
        super(instance, parent, componentData);
        AbsAttr attrs = componentData.getAttrs();
        if (attrs.get("playerID") != null) {
            playerID = Integer.parseInt(attrs.get("playerID").toString());
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
        ZegoExpressUniAppEngine.mediaPlayerViewMap.put(playerID.toString(), canvas);
    }

    @Override
    public void destroy() {
        super.destroy();
        ZegoExpressUniAppEngine.mediaPlayerViewMap.remove(playerID.toString());
    }

    @UniComponentProp(name = "playerID")
    public void setPlayerID(Integer playerID) {
        ZegoCanvas canvas = ZegoExpressUniAppEngine.mediaPlayerViewMap.get(this.playerID.toString());
        ZegoExpressUniAppEngine.mediaPlayerViewMap.remove(this.playerID.toString());
        ZegoExpressUniAppEngine.mediaPlayerViewMap.put(playerID.toString(), canvas);
        this.playerID = playerID;
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

## 前言

由于音视频行业发展迅速，不少中小企业都想从中快速迭代产品上线试水，uni-app 是一个非常快速且合适的跨平台前端应用框架。

在此之前，即构科技(ZEGO) 推出 uni-app 平台的 Express Video SDK 用以满足客户的需求，但对外提供的 JavaScript 接口对客户非常不友好，增加客户出错的机会，因此我们对接口进行全面的 TypeScript 重构，有完备的类型约束，且都支持 async/await，使接口更加清晰易用。


## 准备工作
---
* ZEGO 开发者账户（通过 ZEGO 官网注册）
* HBuilderX 3.0.5 及以上
* iOS 9.0 及以上
* Android 4.1 及以上
* iOS/Android 真机(或支持音视频的模拟器)


## 快速接入
---
#### 申请 ZEGO AppID

登录 ZEGO 官网 注册账号，根据自身实际业务需求选择场景，获取 AppID 与 AppSign，用于初始化引擎。


#### 创建 uni-app 项目

使用 uni-app 官方IDE HBuilder，创建 uni-app 类型项目。


#### 获取「ZegoExpressEngine」uniapp SDK，并引入工程

在uniapp插件市场或 ZEGO 官网获取插件，并将插件引入工程


#### 下载「js封装层」代码，并引入工程

下载地址 (http://storage.zego.im/express/video/uniapp/zego-express-video-uniapp.zip)
将以上「js封装层」引入到uniapp项目


## 基础使用
---
#### 初始化引擎

```javascript
import ZegoExpressEngine from 'zego-express-video-uniapp/lib/ZegoExpressEngine';

import {
    ZegoScenario
} from 'zego-express-video-uniapp/lib/impl/ZegoExpressDefines'

ZegoExpressEngine.createEngine(AppID, AppSign, false, ZegoScenario.General);
```

#### 登入房间

```javascript
ZegoExpressEngine.instance().loginRoom(t"room1", { userID: "user_id", userName: "user_name" });
```

#### 开启音视频通话

在成功登入房间后，可调用 `startPreview` 开启音视频：
```javascript
<template>
  <zego-local-view></zego-local-view>
</template>
 
······

// 需要在登入房间之后才能开启音视频通话
ZegoExpressEngine.instance().startPreview();
```

#### 将本地视频画面推向云服务

```javascript
// 推入的streamID由用户设置
let publishStreamID = '123456'
ZegoExpressEngine.instance().startPublishingStream(publishStreamID);
```

#### 拉取其他用户音视频

登入房间后主动监听 `roomStreamUpdate`，在收到其他用户推出的音视频流，即可拉取：
```javascript
<template>
  <zego-remote-view :streamID="playStreamID" ></zego-remote-view>
</template>

······
// 监听 roomStreamUpdate
ZegoExpressEngine.instance().on('roomStreamUpdate', (roomID, updateType, streamList) => {
    this.playStreamID = streamList[0].streamID;
});

······
// 拉取StreamID的音视频
ZegoExpressEngine.instance().startPlayingStream(this.playStreamID); 
```

#### 退出房间
```javascript
// 退出房间
ZegoExpressEngine.instance().logoutRoom('room1');
```

#### 销毁引擎

```javascript
// 退出房间
ZegoExpressEngine.destroyEngine();
```

#### 注意事项

开启音视频通话需要在uniapp工程中的manifest.json申请麦克风和相机权限配置。

使用视频功能时，页面必须使用.nvue文件构建，因为uniapp的.vue页面在原生端（iOS、android）是用 webview 构建的，不能支持component类型的插件
详情可参考：https://nativesupport.dcloud.net.cn/NativePlugin/course/ios


## 结语
---
ZegoExpressUniAppSDK 更多功能请参考 ZEGO 官方文档和示例源码: https://doc-zh.zego.im/article/7775
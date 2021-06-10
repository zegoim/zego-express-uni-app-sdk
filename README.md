# ZegoExpressUniAppSDK

即构科技 (ZEGO) 极速音视频 uni-app SDK 是一个基于 [ZegoExpressEngine](https://doc-zh.zego.im/zh/693.html) 原生 Android / iOS SDK 的 uni-app Wrapper，提供视频直播以及实时音视频服务。仅需几行代码，30分钟即可轻松接入。

了解更多解决方案：[https://www.zego.im](https://www.zego.im)
# 使用方法

## 申请 ZEGO AppID

登录 [ZEGO 官网](https://www.zego.im) 注册账号，根据自身实际业务需求选择场景，获取 AppID 与 AppSign，用于初始化 SDK。

## 创建uniapp项目
使用uniapp官方IDE HBuilder，创建uni-app类型的项目

## 获取「ZegoExpressEngine」uniapp SDK，并引入工程

在uniapp市场获取本插件，并将插件引入工程

## 下载「js封装层」代码，并引入工程
下载地址

[zego-express-video-uniapp](http://zego-public.oss-cn-shanghai.aliyuncs.com/express/video/uniapp/zego-express-video-uniapp.zip)

将以上「js封装层」引入到uniapp项目中

 ## 基础使用（音频）

#### 初始化 SDK

```javascript
import ZegoExpressEngine from 'zego-express-video-uniapp/ZegoExpressEngine';

import {
    ZegoScenario
} from 'zego-express-video-uniapp/impl/ZegoExpressDefines'

var instance = ZegoExpressEngine.createEngine(AppID, AppSign, false, ZegoScenario.General);
```

#### 关闭视频功能

```javascript
//不启用摄像头
instance.enableCamera(false);
//关闭视频流
instance.mutePublishStreamVideo(true)
```

#### 注册通知事件

```javascript
instance.on('roomStateUpdate', result => {
  console.log('From Native roomStateUpdate:' + result);
  if(result['state'] == 0) { //房间断开

  } else if(result['state'] == 1) { //房间连接中

  } else if(result['state'] == 2) { //房间连接成功

  }
});
instance.on('engineStateUpdate', result => {
  if(result == 0) { //'引擎启动'

  } else if(result['state'] == 1) { //'引擎停止'

  }
});
instance.on('roomStreamUpdate', result => {
  var updateType = result['updateType'];
  if (updateType === 0) { //房间内有新增流
    this.streamList = result['streamList'];
    //通常来说，当收到房间内流新增的消息时，可以立即拉流播放音频
    var instance = ZegoExpressEngine.getInstance();
    instance.startPlayingStream(this.streamList[0].streamID)
  } else if (updateType === 1) { //房间内有流被移除

  }
});

instance.on('roomUserUpdate', result => {
  var updateType = result['updateType'];
  if (updateType === 0) { //房间内有用户新增

  } else if (updateType === 1) { //房间内有用户被移除

  }
});
```

#### 登录

```
var instance = ZegoExpressEngine.getInstance();
instance.loginRoom(this.roomID, { userID: this.userID, userName: this.userName });
```

#### 推流

```javascript
var instance = ZegoExpressEngine.getInstance();
var publishStreamID = '123456'
instance.startPublishingStream(publishStreamID); //推流（推流的streamID由用户设置），需要在登录成功之后才执行推流

```
#### 拉流

```javascript
instance.startPlayingStream(streamID); //拉流的streamID来自于事件'roomStreamUpdate'获取的stream中的streamID
```



## 基础使用（视频）

#### 拉流

如果启用视频功能，拉流播放的时候需保证 `<template>` 标签内有相应的 `<zego-remote-view>` 标签，该标签内需绑定相应流的streamID，此标签会在原生端生成对应的view，展示拉流的画面
使用示例：

```HTML
<template>
  <zego-remote-view v-if="engine" :streamID="playStreamID" style="height: 403.84rpx;flex: 1">
</template>

js部分:
var instance = ZegoExpressEngine.getInstance();
instance.startPlayingStream(stream.streamID);
```

#### 预览
预览的时候需保证 `<template>` 标签内有相应的 `<zego-local-view>` 标签，该标签内可绑定相应的channel(该参数非必填)，channel的概念参考接口[startPreview](https://doc-zh.zego.im/zh/api?doc=Express_Video_SDK_API~ObjectiveC~class~zego-express-engine#start-preview-channel)

此标签会在原生端生成对应的view，展示拉流的画面
使用示例：

```HTML
<template>
  <zego-local-view v-if="engine" style="height: 403.84rpx;flex: 1;"></zego-local-view>
</template>

js部分:
var instance = ZegoExpressEngine.getInstance();
instance.startPreview();
```

特别提示：

使用视频功能时，页面必须使用.nvue文件构建，因为uniapp的.vue页面在原生端（iOS、android）是用 webview 构建的，不能支持component类型的插件

详情可参考：https://nativesupport.dcloud.net.cn/NativePlugin/course/ios

#### 推流
```javascript
var instance = ZegoExpressEngine.getInstance();
var publishStreamID = '123456'
instance.startPublishingStream(publishStreamID);
```

## 运行

本插件是 uniapp 原生插件，需要使用 uniapp 云打包制作自定义调试基座 ，才能保证正常跑通。
具体可参考 uniapp 官方教程 [uni原生插件使用教程](https://nativesupport.dcloud.net.cn/NativePlugin/use/use)


## 更多功能

1、参考示例源码

2、参考ZegoExpressEngine 原生iOS版使用文档 https://doc-zh.zego.im/zh/5413.html

## 示例源码使用

示例源码下载地址

[ZegoExpressExample-UniApp](http://zego-public.oss-cn-shanghai.aliyuncs.com/express/example/uniapp/ZegoExpressExample-UniApp.zip)

1. 将Demo导入HBuilderX，修改manifest.json下的AppID(uniapp的AppID)
2. 修改Demo下./zego-express-video-uniapp/KeyCenter.js 内的AppID、AppSign     (从ZEGO官网获取的)
3. 导入「ZegoExpressEngine」uniapp SDK
4. 使用uniapp本地打包/云打包，制定自定义基座
5. 运行
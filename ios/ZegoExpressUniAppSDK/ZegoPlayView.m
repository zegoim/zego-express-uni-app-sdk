//
//  ZegoPlayView.m
//  ZegoExpressUniAppSDK
//
//  Created by zego on 2021/6/3.
//

#import "ZegoPlayView.h"
#import "WeexSDK.h"
#import <ZegoExpressEngine/ZegoExpressEngine.h>
#import "ZegoExpressUniAppViewStore.h"

@interface ZegoPlayView ()

@property (assign, nonatomic) ZegoViewMode viewMode;
@property (copy, nonatomic) NSString *streamID;


@end

@implementation ZegoPlayView

- (void)onCreateComponentWithRef:(NSString *)ref type:(NSString *)type styles:(NSDictionary *)styles attributes:(NSDictionary *)attributes events:(NSArray *)events uniInstance:(DCUniSDKInstance *)uniInstance {
    if (attributes[@"viewMode"]) {
        _viewMode = [WXConvert NSUInteger: attributes[@"viewMode"]];
    }
    if (attributes[@"streamID"]) {
        _streamID = [WXConvert NSString: attributes[@"streamID"]];
    }
}

- (void)viewDidLoad {
    ZegoCanvas *canvas = [ZegoCanvas canvasWithView:self.view];
    canvas.viewMode = self.viewMode;
    
    ZegoPlayStreamStore *store = [ZegoExpressUniAppViewStore.sharedInstance.playViewDict objectForKey:self.streamID];
    if (!store) {
        store = [[ZegoPlayStreamStore alloc] init];
    }
    store.canvas = canvas;
    if (store.isPlaying) {
        [ZegoExpressEngine.sharedEngine startPlayingStream:self.streamID canvas:store.canvas config:store.config];
    }
    [ZegoExpressUniAppViewStore.sharedInstance.playViewDict setObject:store forKey:self.streamID];
    
    if (!canvas) {
        WXLogError(@"请提供有效的view用来预览画面");
        return;
    }
}

- (void)viewDidUnload {
//    if (ZegoExpressEngine.sharedEngine) {
//        [ZegoExpressEngine.sharedEngine stopPlayingStream:self.streamID];
//    }
    [ZegoExpressUniAppViewStore.sharedInstance.playViewDict removeObjectForKey:self.streamID];
}

/// 前端更新属性回调方法
/// @param attributes 更新的属性
- (void)updateAttributes:(NSDictionary *)attributes {
    if (attributes[@"viewMode"]) {
        ZegoViewMode viewMode = [WXConvert NSUInteger: attributes[@"viewMode"]];
        ZegoPlayStreamStore *store = [ZegoExpressUniAppViewStore.sharedInstance.playViewDict objectForKey:self.streamID];
        store.canvas.viewMode = viewMode;
        [[ZegoExpressUniAppViewStore sharedInstance].playViewDict setObject:store forKey:self.streamID];
        self.viewMode = viewMode;
    }
    if (attributes[@"streamID"]) {
        NSString *streamID = [WXConvert NSString:attributes[@"streamID"]];
        ZegoPlayStreamStore *store = [ZegoExpressUniAppViewStore.sharedInstance.playViewDict objectForKey:self.streamID];
        [[ZegoExpressUniAppViewStore sharedInstance].playViewDict removeObjectForKey:self.streamID];
        [[ZegoExpressUniAppViewStore sharedInstance].playViewDict setObject:store forKey:streamID];
        
        if (store.isPlaying) {
            [ZegoExpressEngine.sharedEngine startPlayingStream:streamID canvas:store.canvas config:store.config];
        }
        
        self.streamID = streamID;
    }
}

@end

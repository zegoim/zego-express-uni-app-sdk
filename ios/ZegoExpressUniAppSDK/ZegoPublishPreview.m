//
//  ZegoPublishPreview.m
//  ZegoExpressUniAppSDK
//
//  Created by zego on 2021/6/3.
//

#import "ZegoPublishPreview.h"
#import "WeexSDK.h"
#import <ZegoExpressEngine/ZegoExpressEngine.h>
#import "ZegoExpressUniAppViewStore.h"

@interface ZegoPublishPreview ()

@property (assign, nonatomic) ZegoViewMode viewMode;
@property (assign, nonatomic) ZegoPublishChannel channel;


@end

@implementation ZegoPublishPreview

- (void)onCreateComponentWithRef:(NSString *)ref type:(NSString *)type styles:(NSDictionary *)styles attributes:(NSDictionary *)attributes events:(NSArray *)events uniInstance:(DCUniSDKInstance *)uniInstance {
    if (attributes[@"viewMode"]) {
        _viewMode = [WXConvert NSUInteger: attributes[@"viewMode"]];
    }
    if (attributes[@"channel"]) {
        _channel = [WXConvert NSUInteger: attributes[@"channel"]];
    }
}

- (void)viewDidLoad {
    ZegoCanvas *canvas = [ZegoCanvas canvasWithView:self.view];
    canvas.viewMode = self.viewMode;
    
    [[ZegoExpressUniAppViewStore sharedInstance].previewViewDict setObject:canvas forKey:@(self.channel).stringValue];
    if (!canvas) {
        WXLogError(@"请提供有效的view用来预览画面");
        return;
    }
    
}

- (void)viewDidUnload {
    [[ZegoExpressUniAppViewStore sharedInstance].previewViewDict removeObjectForKey:@(self.channel).stringValue];
//    if (ZegoExpressEngine.sharedEngine) {
//        [[ZegoExpressEngine sharedEngine] stopPreview:self.channel];
//    }
}

/// 前端更新属性回调方法
/// @param attributes 更新的属性
- (void)updateAttributes:(NSDictionary *)attributes {
    if (attributes[@"viewMode"]) {
        ZegoViewMode viewMode = [WXConvert NSUInteger: attributes[@"viewMode"]];
        ZegoCanvas *canvas = [ZegoExpressUniAppViewStore.sharedInstance.previewViewDict objectForKey:@(self.channel).stringValue];
        canvas.viewMode = viewMode;
        [[ZegoExpressUniAppViewStore sharedInstance].previewViewDict setObject:canvas forKey:@(self.channel).stringValue];
        self.viewMode = viewMode;
    }
    if (attributes[@"channel"]) {
        ZegoPublishChannel channel = [WXConvert NSUInteger: attributes[@"channel"]];
        ZegoCanvas *canvas = [ZegoExpressUniAppViewStore.sharedInstance.previewViewDict objectForKey:@(self.channel).stringValue];
        [[ZegoExpressUniAppViewStore sharedInstance].previewViewDict removeObjectForKey:@(self.channel).stringValue];
        [[ZegoExpressUniAppViewStore sharedInstance].previewViewDict setObject:canvas forKey:@(channel).stringValue];
        self.channel = channel;
    }
}

@end

//
//  ZegoMediaPlayerView.m
//  ZegoExpressUniAppSDK
//
//  Created by zego on 2021/6/6.
//

#import "ZegoMediaPlayerView.h"
#import "WeexSDK.h"
#import <ZegoExpressEngine/ZegoExpressEngine.h>
#import "ZegoExpressUniAppViewStore.h"

@interface ZegoMediaPlayerView ()

@property (assign, nonatomic) NSInteger playerID;

@end

@implementation ZegoMediaPlayerView

- (void)onCreateComponentWithRef:(NSString *)ref type:(NSString *)type styles:(NSDictionary *)styles attributes:(NSDictionary *)attributes events:(NSArray *)events uniInstance:(DCUniSDKInstance *)uniInstance {
    if (attributes[@"playerID"]) {
        _playerID = [WXConvert NSInteger: attributes[@"playerID"]];
    }
}

- (void)viewDidLoad {
    ZegoCanvas *canvas = [ZegoCanvas canvasWithView:self.view];
    
    [[ZegoExpressUniAppViewStore sharedInstance].mediaPlayerViewDict setObject:canvas forKey:@(self.playerID).stringValue];
    if (!canvas) {
        WXLogError(@"请提供有效的view用来预览画面");
        return;
    }
}

- (void)viewDidUnload {
    [ZegoExpressUniAppViewStore.sharedInstance.mediaPlayerViewDict removeObjectForKey:@(self.playerID).stringValue];
}

/// 前端更新属性回调方法
/// @param attributes 更新的属性
- (void)updateAttributes:(NSDictionary *)attributes {
    if (attributes[@"playerID"]) {
        NSInteger playerID = [WXConvert NSInteger:attributes[@"playerID"]];
        ZegoCanvas *canvas = [ZegoExpressUniAppViewStore.sharedInstance.mediaPlayerViewDict objectForKey:@(self.playerID).stringValue];
        [[ZegoExpressUniAppViewStore sharedInstance].mediaPlayerViewDict removeObjectForKey:@(self.playerID).stringValue];
        [[ZegoExpressUniAppViewStore sharedInstance].mediaPlayerViewDict setObject:canvas forKey:@(playerID).stringValue];
        self.playerID = playerID;
    }
}

@end

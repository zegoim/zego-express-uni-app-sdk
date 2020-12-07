//
//  ZegoPreviewView.m
//  ZegoExpressUniAppSDK
//
//  Created by joey on 2020/12/7.
//

#import "ZegoPreviewView.h"
#import <ZegoExpressEngine/ZegoExpressEngine.h>
#import "WeexSDK.h"
#import "ZegoExpressUniAppViewStore.h"

@interface ZegoPreviewView ()

@property (strong, nonatomic) ZegoCanvas *canvas;
@property (assign, nonatomic) ZegoViewMode viewMode;
@property (assign, nonatomic) ZegoPublishChannel channel;

@end

@implementation ZegoPreviewView

- (UIView *)loadView {
    return [UIView new];
}

- (instancetype)initWithRef:(NSString *)ref type:(NSString *)type styles:(NSDictionary *)styles attributes:(NSDictionary *)attributes events:(NSArray *)events weexInstance:(WXSDKInstance *)weexInstance {
    if(self = [super initWithRef:ref type:type styles:styles attributes:attributes events:events weexInstance:weexInstance]) {
        if (attributes[@"viewMode"]) {
            _viewMode = [WXConvert NSUInteger: attributes[@"viewMode"]];
        }
        if (attributes[@"channel"]) {
            _channel = [WXConvert NSUInteger: attributes[@"channel"]];
        }
        
    }
    return self;
}


- (void)viewDidLoad {
    ZegoCanvas *canvas = [ZegoCanvas canvasWithView:self.view];
    canvas.viewMode = ZegoViewModeAspectFill;
    
    [[ZegoExpressUniAppViewStore sharedInstance].previewViewDict setObject:canvas forKey:@(self.channel).stringValue];

    if (!canvas) {
        WXLogError(@"请提供有效的view用来预览画面");
        return;
    }
    [[ZegoExpressEngine sharedEngine] startPreview:canvas channel:_channel];
    
}

- (void)viewDidUnload {
    [[ZegoExpressUniAppViewStore sharedInstance].previewViewDict removeObjectForKey:@(self.channel).stringValue];
    [[ZegoExpressEngine sharedEngine] stopPreview:self.channel];
}

/// 前端更新属性回调方法
/// @param attributes 更新的属性
- (void)updateAttributes:(NSDictionary *)attributes {
    if (attributes[@"viewMode"]) {
        self.viewMode = [WXConvert NSUInteger: attributes[@"viewMode"]];
    }
    if (attributes[@"channel"]) {
        _channel = [WXConvert NSUInteger: attributes[@"channel"]];
    }
}

@end

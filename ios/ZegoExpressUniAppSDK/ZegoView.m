//
//  ZegoView.m
//  ZegoExpressUniAppSDK
//
//  Created by zego on 2020/11/11.
//

#import "ZegoView.h"
#import <ZegoExpressEngine/ZegoExpressEngine.h>
#import "WeexSDK.h"
#import "ZegoExpressUniAppViewStore.h"

@interface ZegoView ()

@property (strong, nonatomic) ZegoCanvas *canvas;
@property (strong, nonatomic) UITextView *logTextView;
@property (assign, nonatomic) BOOL isPreviewMode;
@property (copy, nonatomic) NSString *streamID;
@property (assign, nonatomic) ZegoViewMode viewMode;
@property (assign, nonatomic) ZegoPublishChannel channel;


@end

@implementation ZegoView

- (UIView *)loadView {
    return [UIView new];
}

- (instancetype)initWithRef:(NSString *)ref type:(NSString *)type styles:(NSDictionary *)styles attributes:(NSDictionary *)attributes events:(NSArray *)events weexInstance:(WXSDKInstance *)weexInstance {
    if(self = [super initWithRef:ref type:type styles:styles attributes:attributes events:events weexInstance:weexInstance]) {
        if (attributes[@"viewMode"]) {
            _viewMode = [WXConvert NSUInteger: attributes[@"viewMode"]];
        }
        if (attributes[@"isPreviewMode"]) {
            _isPreviewMode = [WXConvert BOOL: attributes[@"isPreviewMode"]];
            if (attributes[@"channel"]) {
                _channel = [WXConvert NSUInteger: attributes[@"channel"]];
            }
        } else {
            if (attributes[@"streamID"]) {
                _streamID = [WXConvert NSString: attributes[@"streamID"]];
            }
        }
        
    }
    return self;
}


- (void)viewDidLoad {
    ZegoCanvas *canvas = [ZegoCanvas canvasWithView:self.view];
    canvas.viewMode = ZegoViewModeAspectFill;
    
    if (_isPreviewMode) {
        [[ZegoExpressUniAppViewStore sharedInstance].previewViewDict setObject:canvas forKey:@(self.channel).stringValue];

        if (!canvas) {
            WXLogError(@"请提供有效的view用来预览画面");
            return;
        }
        [[ZegoExpressEngine sharedEngine] startPreview:canvas channel:_channel];
    } else {
        if (!self.streamID) {
            WXLogError(@"请设置有效的streamID");
        } else {
            [[ZegoExpressUniAppViewStore sharedInstance].playViewDict setObject:canvas forKey:self.streamID];
            [[ZegoExpressEngine sharedEngine] startPlayingStream:self.streamID canvas:canvas];
        }
    }
    
}

- (void)viewDidUnload {
    if (self.isPreviewMode) {
        [[ZegoExpressUniAppViewStore sharedInstance].previewViewDict removeObjectForKey:@(self.channel).stringValue];
        [[ZegoExpressEngine sharedEngine] stopPreview:self.channel];
    } else {
        [[ZegoExpressUniAppViewStore sharedInstance].playViewDict removeObjectForKey:self.streamID];
        [[ZegoExpressEngine sharedEngine] stopPlayingStream:self.streamID];
    }
}

/// 前端更新属性回调方法
/// @param attributes 更新的属性
- (void)updateAttributes:(NSDictionary *)attributes {
    if (attributes[@"viewMode"]) {
        self.viewMode = [WXConvert NSUInteger: attributes[@"viewMode"]];
    }
    
    if (attributes[@"isPreviewMode"]) {
        BOOL isPreviewModeNew = [WXConvert BOOL: attributes[@"isPreviewMode"]];
//        if (isPreviewModeNew != self.isPreviewMode) {
//            ZegoCanvas *canvas = [ZegoCanvas canvasWithView:self.view];
//            canvas.viewMode = self.viewMode;
//            if (isPreviewModeNew) {
//                [[ZegoExpressEngine sharedEngine] stopPlayingStream:self.streamID];
//                [[ZegoExpressEngine sharedEngine] startPreview:canvas];
//            } else {
//                [[ZegoExpressEngine sharedEngine] stopPreview];
//                [[ZegoExpressEngine sharedEngine] startPlayingStream:self.streamID canvas:canvas];
//            }
//        }
        self.isPreviewMode = isPreviewModeNew;
        
        if (attributes[@"channel"]) {
            _channel = [WXConvert NSUInteger: attributes[@"channel"]];
        }
    }
    if (attributes[@"streamID"]) {
        NSString *streamIDNew = [WXConvert NSString: attributes[@"streamID"]];
//        if (![streamIDNew isEqualToString:self.streamID]) {
//            if (!self.isPreviewMode) {
//                ZegoCanvas *canvas = [ZegoCanvas canvasWithView:self.view];
//                canvas.viewMode = self.viewMode;
//                [[ZegoExpressEngine sharedEngine] startPlayingStream:streamIDNew canvas:canvas];
//            } else {
//                NSLog(@"error: streamID is invalid in preview mode");
//            }
//        }
        self.streamID = streamIDNew;
    }
}

@end

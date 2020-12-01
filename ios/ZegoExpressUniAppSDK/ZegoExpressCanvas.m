//
//  ZegoExpressCanvas.m
//  ZegoExpressUniAppSDK
//
//  Created by zego on 2020/11/11.
//

#import "ZegoExpressCanvas.h"
#import <ZegoExpressEngine/ZegoExpressEngine.h>
#import "WeexSDK.h"

@interface ZegoExpressCanvas ()

@property (strong, nonatomic) ZegoCanvas *canvas;
@property (strong, nonatomic) UITextView *logTextView;
@property (assign, nonatomic) BOOL isPreviewMode;
@property (copy, nonatomic) NSString *streamID;
@property (assign, nonatomic) ZegoViewMode viewMode;

@end

@implementation ZegoExpressCanvas

- (UIView *)loadView {
    return [UIView new];
}

- (instancetype)initWithRef:(NSString *)ref type:(NSString *)type styles:(NSDictionary *)styles attributes:(NSDictionary *)attributes events:(NSArray *)events weexInstance:(WXSDKInstance *)weexInstance {
    if(self = [super initWithRef:ref type:type styles:styles attributes:attributes events:events weexInstance:weexInstance]) {
        if (attributes[@"viewMode"]) {
            _viewMode = [WXConvert NSInteger: attributes[@"viewMode"]];
        }
        if (attributes[@"isPreviewMode"]) {
            _isPreviewMode = [WXConvert BOOL: attributes[@"isPreviewMode"]];
        }
        if (attributes[@"streamID"]) {
            _streamID = [WXConvert NSString: attributes[@"streamID"]];
        }
    }
    return self;
}


- (void)viewDidLoad {
    self.view.backgroundColor = [UIColor colorWithRed:0.6 green:0.2 blue:0.4 alpha:0.8];
    ZegoCanvas *previewCanvas = [ZegoCanvas canvasWithView:self.view];
    previewCanvas.viewMode = ZegoViewModeAspectFill;
    
    if (_isPreviewMode) {
        [[ZegoExpressEngine sharedEngine] startPreview:previewCanvas];
    } else {
        if (!self.streamID) {
            NSLog(@"error: please offer legal stream ID");
        } else {
            [[ZegoExpressEngine sharedEngine] startPlayingStream:self.streamID canvas:previewCanvas];
        }
    }
    
}

- (void)viewWillUnload {
    if (self.isPreviewMode) {
        [[ZegoExpressEngine sharedEngine] stopPreview];
    } else {
        [[ZegoExpressEngine sharedEngine] stopPlayingStream:self.streamID];
    }
}

/// 前端更新属性回调方法
/// @param attributes 更新的属性
- (void)updateAttributes:(NSDictionary *)attributes {
    if (attributes[@"viewMode"]) {
        self.viewMode = [WXConvert BOOL: attributes[@"viewMode"]];
    }
    
    if (attributes[@"isPreviewMode"]) {
        BOOL isPreviewModeNew = [WXConvert BOOL: attributes[@"isPreviewMode"]];
        if (isPreviewModeNew != self.isPreviewMode) {
            ZegoCanvas *canvas = [ZegoCanvas canvasWithView:self.view];
            canvas.viewMode = self.viewMode;
            if (isPreviewModeNew) {
                [[ZegoExpressEngine sharedEngine] stopPlayingStream:self.streamID];
                [[ZegoExpressEngine sharedEngine] startPreview:canvas];
            } else {
                [[ZegoExpressEngine sharedEngine] stopPreview];
                [[ZegoExpressEngine sharedEngine] startPlayingStream:self.streamID canvas:canvas];
            }
        }
        self.isPreviewMode = isPreviewModeNew;
    }
    if (attributes[@"streamID"]) {
        NSString *streamIDNew = [WXConvert NSString: attributes[@"streamID"]];
        if (![streamIDNew isEqualToString:self.streamID]) {
            if (!self.isPreviewMode) {
                ZegoCanvas *canvas = [ZegoCanvas canvasWithView:self.view];
                canvas.viewMode = self.viewMode;
                [[ZegoExpressEngine sharedEngine] startPlayingStream:streamIDNew canvas:canvas];
            } else {
                NSLog(@"error: streamID is invalid in preview mode");
            }
        }
        self.streamID = streamIDNew;
    }
}

WX_EXPORT_METHOD(@selector(startPreview:))

- (void)startPreview:(NSDictionary *)options {
    // Instantiate a ZegoCanvas for local preview
    ZegoCanvas *previewCanvas = [ZegoCanvas canvasWithView:self.view];
    previewCanvas.viewMode = self.viewMode;
    
    // Start preview
    [[ZegoExpressEngine sharedEngine] startPreview:previewCanvas];
     
}

WX_EXPORT_METHOD(@selector(startPlay:))
- (void)startPlay:(NSDictionary *)options {
    NSLog(@"%@", options);
    // Start playing
    ZegoCanvas *playCanvas = [ZegoCanvas canvasWithView:self.view];
    playCanvas.viewMode = self.viewMode;
    self.canvas = playCanvas;
//
    [[ZegoExpressEngine sharedEngine] startPlayingStream:_streamID canvas:playCanvas];
    
}

@end

//
//  ZegoLog.m
//  ZegoExpressUniAppSDK
//
//  Created by zego on 2021/9/16.
//

#import "ZegoLog.h"
#import <objc/message.h>

static Class engineClass;
static SEL logSelector;
static const char *moduleName = "UniApp";

@implementation ZegoLog

+ (void)logInfo:(NSString *)format, ... NS_FORMAT_FUNCTION(1,2) {
    va_list args;
    va_start(args, format);
    [ZegoLog logWithLevel:0 format:format args:args];
    va_end(args);
}

+ (void)logError:(NSString *)format, ... NS_FORMAT_FUNCTION(1,2) {
    va_list args;
    va_start(args, format);
    [ZegoLog logWithLevel:1 format:format args:args];
    va_end(args);
}

+ (void)logWithLevel:(unsigned int)level format:(NSString *)format args:(va_list)args {
    if (!format) return;

    if (!engineClass || !logSelector) {
        engineClass = NSClassFromString(@"ZegoExpressEngine");
        logSelector = NSSelectorFromString(@"logNotice:module:");
    }

    NSString *message = [[NSString alloc] initWithFormat:format arguments:args];
    ((void (*)(id, SEL, const char *, const char *))objc_msgSend)(engineClass, logSelector, [message UTF8String], moduleName);

    if (level == 1) {
        NSLog(@"[ZEGO] [%s] [ERROR] %@", moduleName, message);
    } else {
        NSLog(@"[ZEGO] [%s] %@", moduleName, message);
    }
}

@end

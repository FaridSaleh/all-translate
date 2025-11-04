#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RNSpeechLocales, NSObject)

RCT_EXTERN_METHOD(getSupportedLocales:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end



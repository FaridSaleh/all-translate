import Foundation
import Speech

@objc(RNSpeechLocales)
class RNSpeechLocales: NSObject {
  @objc(getSupportedLocales:rejecter:)
  func getSupportedLocales(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
    let identifiers = Array(SFSpeechRecognizer.supportedLocales()).map { $0.identifier }
    resolve(identifiers)
  }
}



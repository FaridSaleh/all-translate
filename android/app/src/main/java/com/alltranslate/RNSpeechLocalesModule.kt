package com.alltranslate

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.speech.RecognizerIntent
import com.facebook.react.bridge.*

class RNSpeechLocalesModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "RNSpeechLocales"

  @ReactMethod
  fun getSupportedLocales(promise: Promise) {
    try {
      val ctx = reactApplicationContext
      val filter = IntentFilter(RecognizerIntent.ACTION_GET_LANGUAGE_DETAILS)
      val receiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
          try {
            val langs = intent?.getStringArrayListExtra(RecognizerIntent.EXTRA_SUPPORTED_LANGUAGES)
              ?: arrayListOf<String>()
            promise.resolve(Arguments.fromList(langs))
          } catch (e: Exception) {
            promise.reject("LOCALES_ERROR", e)
          } finally {
            try { ctx.unregisterReceiver(this) } catch (_: Exception) {}
          }
        }
      }
      ctx.registerReceiver(receiver, filter)
      ctx.sendBroadcast(Intent(RecognizerIntent.ACTION_GET_LANGUAGE_DETAILS))
    } catch (e: Exception) {
      promise.reject("LOCALES_ERROR", e)
    }
  }
}



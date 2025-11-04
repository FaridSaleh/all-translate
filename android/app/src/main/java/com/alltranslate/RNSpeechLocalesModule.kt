package com.alltranslate

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.content.pm.PackageManager
import com.facebook.react.bridge.*
import android.os.Handler
import android.os.Looper

class RNSpeechLocalesModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "RNSpeechLocales"

  @ReactMethod
  fun getSupportedLocales(promise: Promise) {
    try {
      val ctx = reactApplicationContext

      var resolved = false
      val mainHandler = Handler(Looper.getMainLooper())
      val timeout = Runnable {
        if (!resolved) {
          resolved = true
          promise.resolve(Arguments.fromList(emptyList<String>()))
        }
      }

      // Fallback timeout in case no receiver responds
      mainHandler.postDelayed(timeout, 2500)

      val orderedReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, resultIntent: Intent?) {
          if (resolved) return
          resolved = true
          mainHandler.removeCallbacks(timeout)
          try {
            val langs = resultIntent?.getStringArrayListExtra(RecognizerIntent.EXTRA_SUPPORTED_LANGUAGES)
              ?: arrayListOf<String>()
            promise.resolve(Arguments.fromList(langs))
          } catch (e: Exception) {
            promise.reject("LOCALES_ERROR", e)
          }
        }
      }

      val intent = Intent(RecognizerIntent.ACTION_GET_LANGUAGE_DETAILS)
      // Use ordered broadcast so we can receive the result directly
      ctx.sendOrderedBroadcast(
        intent,
        null,
        orderedReceiver,
        null,
        -1,
        null,
        null
      )
    } catch (e: Exception) {
      promise.reject("LOCALES_ERROR", e)
    }
  }

  @ReactMethod
  fun getDiagnostics(promise: Promise) {
    try {
      val ctx = reactApplicationContext
      val recognitionAvailable = SpeechRecognizer.isRecognitionAvailable(ctx)
      val pm: PackageManager = ctx.packageManager
      val resolveList = pm.queryIntentActivities(Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH), 0)
      val engines = resolveList.map { it.activityInfo.packageName }

      val map = Arguments.createMap()
      map.putBoolean("recognitionAvailable", recognitionAvailable)
      map.putArray("engines", Arguments.fromList(engines))
      promise.resolve(map)
    } catch (e: Exception) {
      promise.reject("DIAGNOSTICS_ERROR", e)
    }
  }
}



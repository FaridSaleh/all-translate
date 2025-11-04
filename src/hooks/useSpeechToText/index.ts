import { useEffect, useState } from 'react'
import { Platform, PermissionsAndroid } from 'react-native'
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice'
import { getSpeechSupportedLocales, getAndroidSpeechDiagnostics } from '../../native/SpeechLocales'

interface UseSpeechToTextDto {
  isListening: boolean
  isAvailable: boolean
  result: string
  setResult: (result: string) => void
  error: string | null
  startListening: (language: string) => Promise<void>
  stopListening: () => Promise<void>
  reset: () => void
  transcriptAvailabilityCheck: (language: string) => void
  isTranscriptAvailable: boolean
}

const useSpeechToText = (): UseSpeechToTextDto => {
  const [isListening, setIsListening] = useState(false)
  const [isAvailable, setIsAvailable] = useState(false)
  const [isTranscriptAvailable, setIsTranscriptAvailable] = useState(false)
  const [result, setResult] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [supportedLocales, setSupportedLocales] = useState<string[]>([])

  const requestMicrophonePermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true
    try {
      const alreadyGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      )
      if (alreadyGranted) return true

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'This app needs access to your microphone to use speech recognition.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      )
      return granted === PermissionsAndroid.RESULTS.GRANTED
    } catch (err) {
      return false
    }
  }

  useEffect(() => {
    Voice.onSpeechStart = () => {
      setIsListening(true)
      setError(null)
    }

    Voice.onSpeechEnd = () => {
      setIsTranscriptAvailable(true)
      setIsListening(false)
    }

    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      if (e.value && e.value[0]) {
        setResult(e.value[0])
      }
    }

    Voice.onSpeechError = (e: SpeechErrorEvent) => {
      setIsTranscriptAvailable(true)
      setError(e.error?.message || 'Speech recognition error')
      setIsListening(false)
    }

    Voice.isAvailable().then(available => setIsAvailable(!!available))
    getSpeechSupportedLocales().then(list => setSupportedLocales(list.map(l => l.toLowerCase())))
    if (Platform.OS === 'android') {
      getAndroidSpeechDiagnostics().then(diag => {
        if (diag) {
          console.log('Android SR diagnostics:', diag)
        }
      })
    }

    return () => {
      Voice.destroy().then(Voice.removeAllListeners)
    }
  }, [])

  const startListening = async (language: string) => {
    try {
      setError(null)
      setResult('')

      const granted = await requestMicrophonePermission()
      if (!granted) {
        setError('Microphone permission is required for speech recognition')
        return
      }

      const locale = language && language.includes('-') ? language : `${language}-US`
      await Voice.start(locale)
    } catch (err: any) {
      console.log('Voice.start error:', err?.message || err)
      setError(err?.message || 'Failed to start speech recognition')
    }
  }

  const stopListening = async () => {
    try {
      await Voice.stop()
    } catch (err) {
      setError('Failed to stop speech recognition')
    }
  }

  const reset = () => {
    setResult('')
    setError(null)
  }

  const transcriptAvailabilityCheck = async (language: string) => {
    if (Platform.OS === 'android') {
      const granted = await requestMicrophonePermission()
      if (!granted) {
        setIsTranscriptAvailable(false)
        setIsListening(false)
        return
      }
    }
    const langLower = (language || '').toLowerCase()
    const baseLang = langLower.split('-')[0]
    const locales = supportedLocales
    console.log('🚀 ~ transcriptAvailabilityCheck ~ supportedLocales:', supportedLocales)

    let isSupported = locales.some(
      l => l === langLower || l === baseLang || l.startsWith(`${baseLang}-`),
    )

    // Android fallback: if locales list is empty but recognizer exists, probe once
    if (!isSupported && Platform.OS === 'android' && locales.length === 0) {
      try {
        const probeLocale = langLower.includes('-') ? langLower : `${baseLang}-US`
        await Voice.start(probeLocale)
        await Voice.stop()
        isSupported = true
      } catch (_e) {
        isSupported = false
      }
    }

    setIsTranscriptAvailable(isSupported)
    setIsListening(false)
  }

  async function debugSpeech() {
    try {
      const [available, services] = await Promise.all([
        Voice.isAvailable(),
        Voice.getSpeechRecognitionServices(),
      ])
      console.log('Voice.isAvailable():', available)
      console.log('Voice.getSpeechRecognitionServices():', services)
    } catch (e: any) {
      console.log('Voice debug error message:', e?.message)
      console.log('Voice debug error code:', e?.code)
      console.log('Voice debug error full:', String(e))
    }
  }

  debugSpeech()

  return {
    isListening,
    isAvailable,
    result,
    setResult,
    error,
    startListening,
    stopListening,
    reset,
    transcriptAvailabilityCheck,
    isTranscriptAvailable,
  }
}

export default useSpeechToText

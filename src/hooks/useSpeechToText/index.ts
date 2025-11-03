import { useEffect, useState } from 'react'
import { Platform, PermissionsAndroid } from 'react-native'
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice'
// import { SUPPORTED_LANGUAGES } from './consts'

interface UseSpeechToTextDto {
  isListening: boolean
  isAvailable: boolean
  result: string
  setResult: (result: string) => void
  error: string | null
  startListening: (language: string) => Promise<void>
  stopListening: () => Promise<void>
  reset: () => void
  languageAvailabilityCheck: (language: string) => void
  isLanguageAvailable: boolean
}

const useSpeechToText = (): UseSpeechToTextDto => {
  const [isListening, setIsListening] = useState(false)
  const [isAvailable, setIsAvailable] = useState(false)
  const [isLanguageAvailable, setIsLanguageAvailable] = useState(false)
  const [result, setResult] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const requestMicrophonePermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      return true
    }

    try {
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
      console.log('Voice.onSpeechStart')
      setIsListening(true)
      setError(null)
    }

    Voice.onSpeechEnd = () => {
      setIsLanguageAvailable(true)
      console.log('Voice.onSpeechEnd')
      setIsListening(false)
    }

    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      console.log('Voice.onSpeechResults')
      if (e.value && e.value[0]) {
        setResult(e.value[0])
      }
    }

    Voice.onSpeechError = (e: SpeechErrorEvent) => {
      setIsLanguageAvailable(true)
      console.log('Voice.onSpeechError')
      setError(e.error?.message || 'Speech recognition error')
      setIsListening(false)
    }

    Voice.isAvailable().then(available => setIsAvailable(!!available))

    return () => {
      Voice.destroy().then(Voice.removeAllListeners)
    }
  }, [])

  const startListening = async (language: string) => {
    try {
      setError(null)
      setResult('')

      if (!isAvailable) {
        const granted = await requestMicrophonePermission()
        if (!granted) {
          setError('Microphone permission is required for speech recognition')
          return
        }
      }

      await Voice.start(language)
    } catch (err) {
      setError('Failed to start speech recognition')
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

  const languageAvailabilityCheck = async (language: string) => {
    // if (SUPPORTED_LANGUAGES.includes(language)) {
    //   return true
    // }
    // return false

    setIsLanguageAvailable(false)
    await Voice.start(language)
    await Voice.stop()
    setIsListening(false)
  }

  return {
    isListening,
    isAvailable,
    result,
    setResult,
    error,
    startListening,
    stopListening,
    reset,
    languageAvailabilityCheck,
    isLanguageAvailable,
  }
}

export default useSpeechToText

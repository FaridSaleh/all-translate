import { useEffect, useState } from 'react'
import { Platform, PermissionsAndroid } from 'react-native'
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice'

interface UseSpeechToTextDto {
  isListening: boolean
  isAvailable: boolean
  results: string[]
  error: string | null
  startListening: (language: string) => Promise<void>
  stopListening: () => Promise<void>
  reset: () => void
  isLanguageAvailable: (language: string) => Promise<boolean>
}

const useSpeechToText = (): UseSpeechToTextDto => {
  const [isListening, setIsListening] = useState(false)
  const [isAvailable, setIsAvailable] = useState(false)
  const [results, setResults] = useState<string[]>([])
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
      setIsListening(true)
      setError(null)
    }

    Voice.onSpeechEnd = () => {
      setIsListening(false)
    }

    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      if (e.value) {
        setResults(e.value)
      }
    }

    Voice.onSpeechError = (e: SpeechErrorEvent) => {
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
      setResults([])

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
    setResults([])
    setError(null)
  }

  const isLanguageAvailable = async (language: string): Promise<boolean> => {
    try {
      await Voice.start(language)
      await Voice.stop()
      return true
    } catch {
      return false
    }
  }

  return {
    isListening,
    isAvailable,
    results,
    error,
    startListening,
    stopListening,
    reset,
    isLanguageAvailable,
  }
}

export default useSpeechToText

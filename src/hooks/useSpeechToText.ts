import { useEffect, useState } from 'react'
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

  const isLanguageAvailable = async (language: string) => {
    // return await Voice.isLanguageAvailable(language)
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

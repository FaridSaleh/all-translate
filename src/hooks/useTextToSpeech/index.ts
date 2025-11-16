import { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import Tts from 'react-native-tts'

interface VoiceType {
  id: string
  name: string
  language: string
  quality?: number
  latency?: number
  networkConnectionRequired?: boolean
  notInstalled?: boolean
}

interface UseTextToSpeechDto {
  isSpeaking: boolean
  isAvailable: boolean
  error: string | null
  speak: (text: string, language?: string) => Promise<void>
  stop: () => Promise<void>
  checkLanguageSupport: (language: string) => Promise<boolean>
}

const useTextToSpeech = (): UseTextToSpeechDto => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isAvailable, setIsAvailable] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      Tts.setDefaultRate(0.5)
    }
    Tts.setDefaultPitch(1.0)

    Tts.addEventListener('tts-start', () => {
      setIsSpeaking(true)
      setError(null)
    })

    Tts.addEventListener('tts-finish', () => {
      setIsSpeaking(false)
    })

    Tts.addEventListener('tts-cancel', () => {
      setIsSpeaking(false)
    })

    Tts.getInitStatus().then(() => {
      setIsAvailable(true)
    })

    return () => {
      Tts.stop().catch(() => {
        // Silently handle errors during cleanup
      })
    }
  }, [])

  const speak = async (text: string, language?: string): Promise<void> => {
    try {
      setError(null)

      if (!text || text.trim().length === 0) {
        setError('Text is empty')
        return
      }

      if (language) {
        const voices = await Tts.voices()
        const languageCode = language.split('-')[0]

        const matchingVoice = voices.find((voice: VoiceType) =>
          voice.language.startsWith(languageCode),
        )

        if (matchingVoice) {
          await Tts.setDefaultLanguage(matchingVoice.language)
        } else {
          try {
            await Tts.setDefaultLanguage(language)
          } catch (err) {
            console.warn(`Language ${language} not available, using default`)
          }
        }
      }

      await Tts.speak(text)
    } catch (err: any) {
      setError(err?.message || 'Failed to speak text')
      setIsSpeaking(false)
    }
  }

  const stop = async (): Promise<void> => {
    try {
      await Tts.stop()
      setIsSpeaking(false)
    } catch (err: any) {
      setError(err?.message || 'Failed to stop speech')
    }
  }

  const checkLanguageSupport = async (language: string): Promise<boolean> => {
    try {
      const voices = await Tts.voices()
      if (voices.length === 0) {
        return false
      }

      return voices.some((voice: VoiceType) => voice.language.startsWith(language))
    } catch (err) {
      console.error('Error checking language support:', err)
      return false
    }
  }

  return {
    isSpeaking,
    isAvailable,
    error,
    speak,
    stop,
    checkLanguageSupport,
  }
}

export default useTextToSpeech

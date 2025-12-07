import { useEffect, useState, useRef } from 'react'
import { Platform } from 'react-native'
import RNFS from 'react-native-fs'
import { useSound } from 'react-native-nitro-sound'
import Tts from 'react-native-tts'
import { UseTextToSpeechDto, VoiceType } from './type'

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }

  // Simple base64 encoding
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  let result = ''
  let i = 0

  while (i < binary.length) {
    const a = binary.charCodeAt(i++)
    const b = i < binary.length ? binary.charCodeAt(i++) : 0
    const c = i < binary.length ? binary.charCodeAt(i++) : 0

    // eslint-disable-next-line no-bitwise
    const bitmap = (a << 16) | (b << 8) | c

    // eslint-disable-next-line no-bitwise
    result += chars.charAt((bitmap >> 18) & 63)
    // eslint-disable-next-line no-bitwise
    result += chars.charAt((bitmap >> 12) & 63)
    // eslint-disable-next-line no-bitwise
    result += i - 2 < binary.length ? chars.charAt((bitmap >> 6) & 63) : '='
    // eslint-disable-next-line no-bitwise
    result += i - 1 < binary.length ? chars.charAt(bitmap & 63) : '='
  }

  return result
}

const useTextToSpeech = (): UseTextToSpeechDto => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isAvailable, setIsAvailable] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const currentAudioFileRef = useRef<string | null>(null)

  const audioPlayer = useSound({
    onPlaybackEnd: () => {
      if (currentAudioFileRef.current) {
        RNFS.unlink(currentAudioFileRef.current).catch(() => {
          // Silently handle cleanup errors
        })
        currentAudioFileRef.current = null
      }
      setIsSpeaking(false)
    },
  })

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      Tts.setDefaultRate(0.5)
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
    } else {
      // On iOS, mark the hook as available but do not touch the native TTS module.
      setIsAvailable(true)
    }

    return () => {
      if (Platform.OS !== 'ios') {
        Tts.stop().catch(() => {
          // Silently handle errors during cleanup
        })
      }
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

  const playAudioFromArrayBuffer = async (audioData: ArrayBuffer): Promise<void> => {
    try {
      setError(null)
      setIsSpeaking(true)

      if (!audioData || audioData.byteLength === 0) {
        setError('Audio data is empty')
        setIsSpeaking(false)
        return
      }

      const base64 = arrayBufferToBase64(audioData)

      const tempDir = Platform.OS === 'ios' ? RNFS.TemporaryDirectoryPath : RNFS.CachesDirectoryPath
      const fileName = `audio_${Date.now()}.mp3`
      const filePath = `${tempDir}/${fileName}`
      await RNFS.writeFile(filePath, base64, 'base64')
      currentAudioFileRef.current = filePath
      await audioPlayer.startPlayer(filePath)
    } catch (err: any) {
      setError(err?.message || 'Failed to play audio')
      setIsSpeaking(false)
      if (currentAudioFileRef.current) {
        RNFS.unlink(currentAudioFileRef.current).catch(() => {})
        currentAudioFileRef.current = null
      }
    }
  }

  return {
    isSpeaking,
    isAvailable,
    error,
    speak,
    stop,
    checkLanguageSupport,
    playAudioFromArrayBuffer,
  }
}

export default useTextToSpeech

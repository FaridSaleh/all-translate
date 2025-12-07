export interface UseTextToSpeechDto {
  isSpeaking: boolean
  isAvailable: boolean
  error: string | null
  speak: (text: string, language?: string) => Promise<void>
  stop: () => Promise<void>
  checkLanguageSupport: (language: string) => Promise<boolean>
  playAudioFromArrayBuffer: (audioData: ArrayBuffer) => Promise<void>
}

export interface VoiceType {
  id: string
  name: string
  language: string
  quality?: number
  latency?: number
  networkConnectionRequired?: boolean
  notInstalled?: boolean
}

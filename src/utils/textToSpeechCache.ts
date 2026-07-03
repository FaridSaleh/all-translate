export type TextToSpeechCacheKey = {
  translatedText: string
  targetLang: string
}

type CacheEntry = TextToSpeechCacheKey & {
  audio: ArrayBuffer
}

const normalizeText = (text: string) => text.trim()

export class TextToSpeechCache {
  private latest: CacheEntry | null = null

  get({ translatedText, targetLang }: TextToSpeechCacheKey): ArrayBuffer | null {
    if (!this.latest) {
      return null
    }

    const isMatch =
      normalizeText(translatedText) === normalizeText(this.latest.translatedText) &&
      targetLang === this.latest.targetLang

    if (!isMatch) {
      return null
    }

    return this.latest.audio.slice(0)
  }

  set({ translatedText, targetLang }: TextToSpeechCacheKey, audio: ArrayBuffer) {
    this.latest = {
      translatedText: normalizeText(translatedText),
      targetLang,
      audio: audio.slice(0),
    }
  }
}

export const textToSpeechCache = new TextToSpeechCache()
export const conversationTextToSpeechCache = new TextToSpeechCache()

export type TranslationCacheKey = {
  transcribedText: string
  sourceLang: string
  targetLang: string
}

type CacheEntry = {
  sourceText: string
  sourceLang: string
  targetLang: string
  translatedText: string
}

const normalizeText = (text: string) => text.trim()

class TranslationCache {
  private latest: CacheEntry | null = null

  get({ transcribedText, sourceLang, targetLang }: TranslationCacheKey): string | null {
    if (!this.latest) {
      return null
    }

    const text = normalizeText(transcribedText)
    const { sourceText, sourceLang: cachedSource, targetLang: cachedTarget, translatedText } =
      this.latest

    const isForwardMatch =
      text === normalizeText(sourceText) &&
      targetLang === cachedTarget &&
      (sourceLang === cachedSource || sourceLang === 'detect')

    if (isForwardMatch) {
      return translatedText
    }

    const isReverseMatch =
      text === normalizeText(translatedText) &&
      sourceLang === cachedTarget &&
      targetLang === cachedSource

    if (isReverseMatch) {
      return sourceText
    }

    return null
  }

  set(entry: CacheEntry) {
    this.latest = {
      sourceText: normalizeText(entry.sourceText),
      sourceLang: entry.sourceLang,
      targetLang: entry.targetLang,
      translatedText: normalizeText(entry.translatedText),
    }
  }
}

export const translationCache = new TranslationCache()

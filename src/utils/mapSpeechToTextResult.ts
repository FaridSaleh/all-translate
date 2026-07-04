import { PostSpeechToTextDto } from '@/apis/translate/speechToText'

export function mapSpeechToTextResult(
  data: Pick<PostSpeechToTextDto, 'transcribedText' | 'translatedText' | 'sourceLang'>,
  uiSourceLang: string,
): { sourceText: string; targetText: string } {
  const { transcribedText, translatedText, sourceLang: detectedLang } = data

  if (uiSourceLang === 'detect' || detectedLang === uiSourceLang) {
    return { sourceText: transcribedText, targetText: translatedText }
  }

  return { sourceText: translatedText, targetText: transcribedText }
}

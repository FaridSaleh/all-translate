import { TextRecognitionScript } from '@react-native-ml-kit/text-recognition'

const CHINESE_LANGUAGE_IDS = new Set(['zh', 'zh-cn', 'zh-tw', 'zh-hans', 'zh-hant'])
const JAPANESE_LANGUAGE_IDS = new Set(['ja'])
const KOREAN_LANGUAGE_IDS = new Set(['ko'])
const DEVANAGARI_LANGUAGE_IDS = new Set(['hi', 'mr', 'ne', 'sa'])

const getTextRecognitionScript = (languageId: string): TextRecognitionScript => {
  const normalizedLanguageId = languageId.toLowerCase()

  if (CHINESE_LANGUAGE_IDS.has(normalizedLanguageId) || normalizedLanguageId.startsWith('zh')) {
    return TextRecognitionScript.CHINESE
  }

  if (JAPANESE_LANGUAGE_IDS.has(normalizedLanguageId)) {
    return TextRecognitionScript.JAPANESE
  }

  if (KOREAN_LANGUAGE_IDS.has(normalizedLanguageId)) {
    return TextRecognitionScript.KOREAN
  }

  if (DEVANAGARI_LANGUAGE_IDS.has(normalizedLanguageId)) {
    return TextRecognitionScript.DEVANAGARI
  }

  return TextRecognitionScript.LATIN
}

export default getTextRecognitionScript

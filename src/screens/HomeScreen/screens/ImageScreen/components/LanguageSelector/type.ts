import { LanguageType } from '@/screens/HomeScreen/type'

export default interface LanguageSelectorProps {
  sourceLanguage: LanguageType
  targetLanguage: LanguageType
  onSourcePress: () => void
  onTargetPress: () => void
  onSwapPress: () => void
}

import { LanguageType } from '../../type'

export default interface TargetLanguageSectionProps {
  language: LanguageType
  setOpenLanguageModal: (value: 'source' | 'target' | false) => void
  isListening: boolean
  isTranscriptAvailable: boolean
  setIsVoiceUnavailableOpen: (value: boolean) => void
  handleSwapLanguages: () => void
}

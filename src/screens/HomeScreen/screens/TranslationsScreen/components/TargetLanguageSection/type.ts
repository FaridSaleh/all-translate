import { LanguageType } from '../../type'

export default interface TargetLanguageSectionProps {
  language: LanguageType
  setOpenLanguageModal: (value: 'source' | 'target' | false) => void
  textValue: string
  isListening: boolean
  isTranscriptAvailable: boolean
  handleSwapLanguages: () => void
  onSpeak: () => void
  checkTtsLanguageSupport: (language: string) => Promise<boolean>
  showTextToSpeechIcon: boolean
}

import { LanguageType } from '../../type'

export default interface SourceLanguageSectionProps {
  setOpenLanguageModal: (value: 'source' | 'target' | false) => void
  language: LanguageType
  handleStartListening: () => void
  handleStopListening: () => void
  isListening: boolean
  inputValue: string
  setInputValue: (value: string) => void
  isTranscriptAvailable: boolean
  setIsVoiceUnavailableOpen: (value: boolean) => void
}

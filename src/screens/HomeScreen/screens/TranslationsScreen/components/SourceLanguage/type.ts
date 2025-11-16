import { LanguageType } from '../../type'

export default interface SourceLanguageProps {
  setOpenLanguageModal: (value: 'source' | 'target' | false) => void
  language: LanguageType
  handleStartListening: () => void
  handleStopListening: () => void
  isListening: boolean
  inputValue: string
  setInputValue: (value: string) => void
  isTranscriptAvailable: boolean
  showTextToSpeechIcon: boolean
}

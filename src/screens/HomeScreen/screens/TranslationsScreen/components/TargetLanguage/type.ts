import { LanguageType } from '../../type'

export default interface TargetLanguageProps {
  language: LanguageType
  setOpenLanguageModal: (value: 'source' | 'target' | false) => void
  textValue: string
  isListening: boolean
  isTranscriptAvailable: boolean
  handleSwapLanguages: () => void
  showTextToSpeechIcon: boolean
}

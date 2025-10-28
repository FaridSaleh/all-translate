import { LanguageType } from '../../type'

export default interface LanguageSectionProps {
  type: 'source' | 'target'
  setOpenLanguageModal: (value: 'source' | 'target' | false) => void
  language: LanguageType
  handleStartListening: () => void
  handleStopListening: () => void
  isListening: boolean
  inputValue: string
  setInputValue: (value: string) => void
}

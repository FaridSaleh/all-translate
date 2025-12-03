import { LanguageType } from '@/screens/HomeScreen/type'

export default interface TargetLanguageProps {
  setOpenLanguageModal: (value: 'source' | 'target' | false) => void
  language: LanguageType
  inputValue: string
  setInputValue: (value: string) => void
  showTextToSpeechIcon: boolean
  isListening: boolean
}

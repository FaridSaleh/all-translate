import { LanguageType } from '@/screens/HomeScreen/type'

export default interface SourceLanguageProps {
  setOpenLanguageModal: (value: 'source' | 'target' | false) => void
  language: LanguageType
  inputValue: string
  setInputValue: (value: string) => void
  showTextToSpeechIcon: boolean
}

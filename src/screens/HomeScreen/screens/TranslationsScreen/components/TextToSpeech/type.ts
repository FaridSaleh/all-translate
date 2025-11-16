import { LanguageType } from '../../type'

export default interface TextToSpeechProps {
  type: 'source' | 'target'
  show: boolean
  textValue: string
  targetLanguage: LanguageType
}

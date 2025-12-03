import { LanguageType } from '../../type'

export default interface LanguageBottomSheetProps {
  open: 'source' | 'target' | false
  setOpen: (value: 'source' | 'target' | false) => void
  sourceLanguage: LanguageType
  setSourceLanguage: (value: LanguageType) => void
  targetLanguage: LanguageType
  setTargetLanguage: (value: LanguageType) => void
}

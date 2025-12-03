import { Pressable, Text, TextInput, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import TextToSpeech from '../TextToSpeech'
import SourceLanguageProps from './type'
import { ChevronUpAndDownIcon } from '@/assets'

const SourceLanguage = ({
  language,
  setOpenLanguageModal,
  inputValue,
  setInputValue,
  showTextToSpeechIcon,
  isListening,
}: SourceLanguageProps) => {
  const { t, i18n } = useTranslation()

  const handleInputChange = (text: string) => {
    setInputValue(text)
  }

  const microphonePlaceholder = i18n.exists(
    `MultiLanguageTexts.microphone_placeholder.${language.id}`,
  )
    ? t(`MultiLanguageTexts.microphone_placeholder.${language.id}`)
    : t('MultiLanguageTexts.microphone_placeholder.en')

  const listeningPlaceholder = i18n.exists(
    `MultiLanguageTexts.listening_placeholder.${language.id}`,
  )
    ? t(`MultiLanguageTexts.listening_placeholder.${language.id}`)
    : t('MultiLanguageTexts.listening_placeholder.en')

  return (
    <>
      <View className="min-h-[90px] gap-[16px]">
        <View className="flex-row items-center justify-between">
          <Pressable
            className="flex-row items-center gap-2"
            onPress={() => setOpenLanguageModal('source')}
          >
            <Text className="text-[14px] font-medium text-text-primary">{language.name}</Text>
            <ChevronUpAndDownIcon width={9} height={13} color="#000" />
          </Pressable>
          <View className="flex-row items-center">
            <TextToSpeech
              type="source"
              show={showTextToSpeechIcon}
              textValue={inputValue}
              targetLanguage={language}
            />
          </View>
        </View>
        <TextInput
          className="text-[17px] font-bold text-text-primary bg-[transparent]"
          placeholder={isListening ? listeningPlaceholder : microphonePlaceholder}
          placeholderTextColor="#9CA3AF"
          value={inputValue}
          multiline
          onChangeText={handleInputChange}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>
    </>
  )
}

export default SourceLanguage

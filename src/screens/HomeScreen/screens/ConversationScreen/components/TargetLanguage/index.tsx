import { Pressable, Text, TextInput, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import TextToSpeech from '../TextToSpeech'
import TargetLanguageProps from './type'
import { ChevronUpAndDownIcon } from '@/assets'

const TargetLanguage = ({
  language,
  setOpenLanguageModal,
  inputValue,
  setInputValue,
  showTextToSpeechIcon,
}: TargetLanguageProps) => {
  const { t, i18n } = useTranslation()

  const handleInputChange = (text: string) => {
    setInputValue(text)
  }

  const microphonePlaceholder = i18n.exists(
    `MultiLanguageTexts.microphone_placeholder.${language.id}`,
  )
    ? t(`MultiLanguageTexts.microphone_placeholder.${language.id}`)
    : t('MultiLanguageTexts.microphone_placeholder.en')

  return (
    <>
      <View className="min-h-[90px] gap-[16px]">
        <View className="flex-row items-center justify-between">
          <Pressable
            className="flex-row items-center gap-2"
            onPress={() => setOpenLanguageModal('target')}
          >
            <Text className="text-[14px] font-medium text-hover-link">{language.name}</Text>
            <ChevronUpAndDownIcon width={9} height={13} color="#1E40AF" />
          </Pressable>
          <View className="flex-row items-center">
            <TextToSpeech
              type="target"
              show={showTextToSpeechIcon}
              textValue={inputValue}
              targetLanguage={language}
            />
          </View>
        </View>
        <TextInput
          className="text-[17px] font-bold text-primary-main bg-[transparent]"
          placeholder={microphonePlaceholder}
          placeholderTextColor="#C2D4FA"
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

export default TargetLanguage

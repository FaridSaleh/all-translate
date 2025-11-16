import { Pressable, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import SpeechToText from '../SpeechToText'
import TextToSpeech from '../TextToSpeech'
import TargetLanguageProps from './type'
import { ChevronUpAndDownIcon } from '@/assets'

const TargetLanguage = ({
  language,
  setOpenLanguageModal,
  textValue,
  isListening,
  isTranscriptAvailable,
  handleSwapLanguages,
  showTextToSpeechIcon,
}: TargetLanguageProps) => {
  const { t, i18n } = useTranslation()

  const textPlaceholder = i18n.exists(`MultiLanguageTexts.text_placeholder.${language.id}`)
    ? t(`MultiLanguageTexts.text_placeholder.${language.id}`)
    : t('MultiLanguageTexts.text_placeholder.en')

  const listeningPlaceholder = i18n.exists(
    `MultiLanguageTexts.listening_placeholder.${language.id}`,
  )
    ? t(`MultiLanguageTexts.listening_placeholder.${language.id}`)
    : t('MultiLanguageTexts.listening_placeholder.en')

  return (
    <View className="min-h-[160px] gap-[16px]">
      <View className="flex-row items-center justify-between">
        <Pressable
          className="flex-row items-center gap-2"
          onPress={() => setOpenLanguageModal('target')}
        >
          <Text className="text-[14px] font-medium text-hover-link">{language.name}</Text>
          <ChevronUpAndDownIcon width={9} height={13} color="#1E40AF" />
        </Pressable>

        <View className="flex-row items-center">
          <SpeechToText
            type="target"
            show={!showTextToSpeechIcon}
            onPress={handleSwapLanguages}
            isListening={isListening}
            isTranscriptAvailable={isTranscriptAvailable}
            languageName={language.name}
          />

          <TextToSpeech
            type="target"
            show={showTextToSpeechIcon}
            textValue={textValue}
            targetLanguage={language}
          />
        </View>
      </View>

      <View className="flex-row items-start justify-between gap-2">
        <View className="flex-1">
          {textValue.length > 0 ? (
            <Text className="text-[17px] font-bold text-primary-main">{textValue}</Text>
          ) : (
            <Text className="text-[17px] font-bold text-[#C2D4FA]">
              {isListening ? listeningPlaceholder : textPlaceholder}
            </Text>
          )}
        </View>
      </View>
    </View>
  )
}

export default TargetLanguage

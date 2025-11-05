import { useState } from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import { useTranslation } from 'react-i18next'
import VoiceUnavailableBottomSheet from '../VoiceUnavailableBottomSheet'
import SourceLanguageSectionProps from './type'
import { ChevronUpAndDownIcon, InfoIcon, MicrophoneIcon, PasteIcon } from '@/assets'

const SourceLanguageSection = ({
  language,
  setOpenLanguageModal,
  handleStartListening,
  handleStopListening,
  isListening,
  inputValue,
  setInputValue,
  isTranscriptAvailable,
}: SourceLanguageSectionProps) => {
  const { t, i18n } = useTranslation()
  const [isVoiceUnavailableOpen, setIsVoiceUnavailableOpen] = useState(false)

  const handleInputChange = (text: string) => {
    setInputValue(text)
    if (isListening) {
      handleStopListening()
    }
  }

  const fetchClipboardText = async () => {
    const text = await Clipboard.getString()
    handleInputChange(text)
  }

  const textPlaceholder = i18n.exists(`MultiLanguageTexts.text_placeholder.${language.id}`)
    ? t(`MultiLanguageTexts.text_placeholder.${language.id}`)
    : t('MultiLanguageTexts.text_placeholder.en')

  const listeningPlaceholder = i18n.exists(
    `MultiLanguageTexts.listening_placeholder.${language.id}`,
  )
    ? t(`MultiLanguageTexts.listening_placeholder.${language.id}`)
    : t('MultiLanguageTexts.listening_placeholder.en')

  return (
    <>
      <View className="min-h-[160px] gap-[16px]">
        <View className="flex-row items-center justify-between">
          <Pressable
            className="flex-row items-center gap-2"
            onPress={() => setOpenLanguageModal('source')}
          >
            <Text className="text-[14px] font-medium text-text-primary">{language.name}</Text>
            <ChevronUpAndDownIcon width={9} height={13} color="#000" />
          </Pressable>
          <Pressable
            disabled={!isTranscriptAvailable}
            className="flex-row items-center"
            onPress={handleStartListening}
          >
            <MicrophoneIcon
              width={20}
              opacity={isListening ? 0 : 1}
              height={20}
              color={!isTranscriptAvailable ? '#9CA3AF' : '#000000'}
            />
            {!isTranscriptAvailable && (
              <Pressable onPress={() => setIsVoiceUnavailableOpen(true)}>
                <InfoIcon width={23} height={23} color="#9CA3AF" />
              </Pressable>
            )}
          </Pressable>
        </View>
        <TextInput
          className="text-[17px] font-bold text-text-primary bg-[transparent]"
          placeholder={isListening ? listeningPlaceholder : textPlaceholder}
          placeholderTextColor="#9CA3AF"
          value={inputValue}
          multiline
          onChangeText={handleInputChange}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <Pressable className="flex-row gap-[12px] items-center" onPress={fetchClipboardText}>
          <PasteIcon width={12} height={12} color="#4B5563" />
          <Text className="text-[12px] font-regular text-text-secondary">
            {t('TranslationsScreen.paste')}
          </Text>
        </Pressable>
      </View>

      <VoiceUnavailableBottomSheet
        open={isVoiceUnavailableOpen}
        setOpen={setIsVoiceUnavailableOpen}
        languageName={language.name}
      />
    </>
  )
}

export default SourceLanguageSection

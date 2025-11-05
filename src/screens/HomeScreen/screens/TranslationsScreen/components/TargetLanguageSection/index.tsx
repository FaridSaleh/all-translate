import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import VoiceUnavailableBottomSheet from '../VoiceUnavailableBottomSheet'
import TargetLanguageSectionProps from './type'
import { ChevronUpAndDownIcon, InfoIcon, MicrophoneIcon } from '@/assets'

const TargetLanguageSection = ({
  language,
  setOpenLanguageModal,
  isListening,
  isTranscriptAvailable,
  handleSwapLanguages,
}: TargetLanguageSectionProps) => {
  const { t } = useTranslation()
  const [isVoiceUnavailableOpen, setIsVoiceUnavailableOpen] = useState(false)

  return (
    <>
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
            <Pressable onPress={handleSwapLanguages}>
              <MicrophoneIcon
                width={20}
                opacity={isListening ? 0 : 1}
                height={20}
                color={!isTranscriptAvailable ? '#9CA3AF' : '#1E40AF'}
              />
            </Pressable>
            {!isTranscriptAvailable && (
              <Pressable onPress={() => setIsVoiceUnavailableOpen(true)}>
                <InfoIcon width={23} height={23} color="#9CA3AF" />
              </Pressable>
            )}
          </View>
        </View>
        <Pressable onPress={handleSwapLanguages}>
          <Text className="text-[17px] font-bold text-[#C2D4FA]">
            {isListening
              ? t('TranslationsScreen.english_listening_placeholder')
              : t('TranslationsScreen.english_text_placeholder')}
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

export default TargetLanguageSection

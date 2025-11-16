import { useEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import VoiceUnavailableBottomSheet from '../VoiceUnavailableBottomSheet'
import TargetLanguageSectionProps from './type'
import { ChevronUpAndDownIcon, InfoIcon, MicrophoneIcon, SpeakerIcon } from '@/assets'

const TargetLanguageSection = ({
  language,
  setOpenLanguageModal,
  textValue,
  isListening,
  isTranscriptAvailable,
  handleSwapLanguages,
  onSpeak,
  checkTtsLanguageSupport,
  showTextToSpeechIcon,
}: TargetLanguageSectionProps) => {
  const { t, i18n } = useTranslation()
  const [isVoiceUnavailableOpen, setIsVoiceUnavailableOpen] = useState(false)
  const [isTtsAvailable, setIsTtsAvailable] = useState(false)

  const textPlaceholder = i18n.exists(`MultiLanguageTexts.text_placeholder.${language.id}`)
    ? t(`MultiLanguageTexts.text_placeholder.${language.id}`)
    : t('MultiLanguageTexts.text_placeholder.en')

  const listeningPlaceholder = i18n.exists(
    `MultiLanguageTexts.listening_placeholder.${language.id}`,
  )
    ? t(`MultiLanguageTexts.listening_placeholder.${language.id}`)
    : t('MultiLanguageTexts.listening_placeholder.en')

  useEffect(() => {
    const checkTtsSupport = async () => {
      const available = await checkTtsLanguageSupport(language.id)
      setIsTtsAvailable(available)
    }
    checkTtsSupport()
  }, [language.id, checkTtsLanguageSupport])

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
            <Pressable
              className={`${!showTextToSpeechIcon ? 'opacity-100' : 'opacity-0'}`}
              disabled={showTextToSpeechIcon}
              onPress={handleSwapLanguages}
            >
              <MicrophoneIcon
                width={20}
                opacity={isListening ? 0 : 1}
                height={20}
                color={!isTranscriptAvailable ? '#9CA3AF' : '#1E40AF'}
              />
            </Pressable>
            <Pressable
              className={`${showTextToSpeechIcon ? 'opacity-100' : 'opacity-0'}`}
              disabled={!showTextToSpeechIcon}
              onPress={onSpeak}
            >
              <SpeakerIcon width={20} height={20} color={!isTtsAvailable ? '#9CA3AF' : '#1E40AF'} />
            </Pressable>
            {!isTranscriptAvailable && (
              <Pressable onPress={() => setIsVoiceUnavailableOpen(true)}>
                <InfoIcon width={23} height={23} color="#9CA3AF" />
              </Pressable>
            )}
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

      <VoiceUnavailableBottomSheet
        open={isVoiceUnavailableOpen}
        setOpen={setIsVoiceUnavailableOpen}
        languageName={language.name}
      />
    </>
  )
}

export default TargetLanguageSection

import { useEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import GradientLayout from '../../components/GradientLayout'
import LanguageBottomSheet from '../../components/LanguageBottomSheet'
import OptionalUpdateModal from '../../components/OptionalUpdateModal'
import SourceLanguageSection from './components/SourceLanguageSection'
import TargetLanguageSection from './components/TargetLanguageSection'
import { LanguageType } from './type'
import { useSpeechToTextRequest } from '@/apis/translate/speechToText'
import { useTextToTextRequest } from '@/apis/translate/textToText'
import { SwapIcon } from '@/assets'
import useAudioRecorder from '@/hooks/useAudioRecorder'
import useSpeechToText from '@/hooks/useSpeechToText'
import useConfigurationStore from '@/store/configuration'

const TranslationsScreen = () => {
  const { t } = useTranslation()
  const [isOptionalUpdateOpen, setIsOptionalUpdateOpen] = useState(false)
  const [openLanguageModal, setOpenLanguageModal] = useState<'source' | 'target' | false>(false)
  const [sourceLanguage, setSourceLanguage] = useState<LanguageType>({
    id: 'detect',
    name: 'Detect Language',
  })
  const [targetLanguage, setTargetLanguage] = useState<LanguageType>({ id: 'es', name: 'Spanish' })
  const [targetText, setTargetText] = useState('')

  const { hasOptionalUpdate, hasPremiumFeature } = useConfigurationStore()
  const {
    isListening,
    result: sourceText,
    setResult: setSourceText,
    startListening,
    stopListening,
    transcriptAvailabilityCheck,
    // isTranscriptAvailable,
  } = useSpeechToText()

  const {
    isRecording,
    startRecording,
    stopRecording,
    reset: resetAudioRecorder,
  } = useAudioRecorder()

  const { mutate: translateText } = useTextToTextRequest()
  const { mutate: transcriptSpeech } = useSpeechToTextRequest()

  const isCurrentlyListening = isListening || isRecording

  const handleTranslateText = async () => {
    translateText(
      {
        transcribedText: sourceText,
        sourceLang: sourceLanguage.id,
        targetLang: targetLanguage.id,
      },
      {
        onSuccess(data) {
          setTargetText(data.translatedText)
        },
      },
    )
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsOptionalUpdateOpen(hasOptionalUpdate)
    }, 3000)

    return () => clearTimeout(timeout)
  }, [])

  // useEffect(() => {
  //   setSourceText('')
  //   const checkLanguageAvailability = async () => {
  //     await transcriptAvailabilityCheck(sourceLanguage.id)
  //   }
  //   checkLanguageAvailability()
  // }, [sourceLanguage.id])

  const handleStartListening = async () => {
    if (!hasPremiumFeature && !transcriptAvailabilityCheck(sourceLanguage.id)) {
      return
    } else if (hasPremiumFeature) {
      await startRecording()
    } else {
      await startListening(sourceLanguage.id)
    }
  }

  const handleStopListening = async () => {
    if (!hasPremiumFeature && !transcriptAvailabilityCheck(sourceLanguage.id)) {
      return
    } else if (hasPremiumFeature) {
      const path = await stopRecording()
      if (path) {
        const file = new FormData()
        file.append('audio', {
          uri: path,
          name: path.split('/').pop() || 'recording.m4a',
        })

        transcriptSpeech(
          {
            sourceLang: sourceLanguage.id === 'detect' ? undefined : sourceLanguage.id,
            targetLang: targetLanguage.id,
            file,
          },
          {
            onSuccess(data) {
              setSourceText(data.transcribedText)
              setTargetText(data.translatedText)
            },
          },
        )
      }
    } else {
      await stopListening()
    }
  }

  const handleSwapLanguages = () => {
    const temp = sourceLanguage
    setSourceLanguage(targetLanguage)
    setTargetLanguage(temp)
    clearTexts()
  }

  const clearTexts = () => {
    setSourceText('')
    setTargetText('')
    if (hasPremiumFeature) {
      resetAudioRecorder()
    }
  }

  return (
    <>
      <GradientLayout>
        <View className="flex-1 p-6">
          <View className="flex-1">
            <View className="bg-bg-card rounded-2xl p-4">
              <SourceLanguageSection
                language={sourceLanguage}
                setOpenLanguageModal={setOpenLanguageModal}
                handleStartListening={handleStartListening}
                handleStopListening={handleStopListening}
                isListening={isCurrentlyListening}
                inputValue={sourceText}
                setInputValue={setSourceText}
                // isTranscriptAvailable={isTranscriptAvailable}
                isTranscriptAvailable={transcriptAvailabilityCheck(sourceLanguage.id)}
                hasPremiumFeature={hasPremiumFeature}
              />

              <View className="flex-row items-center">
                <View className="flex-1 border-t border-bg-buttonDisabled" />
                <Pressable
                  className="w-[30px] h-[30px] bg-bg-base rounded-full items-center justify-center"
                  onPress={handleSwapLanguages}
                >
                  <SwapIcon width={15} height={12} color="#1D4ED8" />
                </Pressable>
                <View className="flex-1 border-t border-bg-buttonDisabled" />
              </View>

              <TargetLanguageSection
                language={targetLanguage}
                setOpenLanguageModal={setOpenLanguageModal}
                textValue={targetText}
                isListening={isCurrentlyListening}
                isTranscriptAvailable={transcriptAvailabilityCheck(targetLanguage.id)}
                handleSwapLanguages={handleSwapLanguages}
              />

              {sourceText.length > 0 && (
                <>
                  <View className="flex-1 border-t border-bg-buttonDisabled mb-[18px]" />
                  <View className="flex-row items-center justify-between">
                    <Pressable
                      className="h-[31px] justify-center rounded-[6px] p-[6px]"
                      onPress={clearTexts}
                    >
                      <Text className="text-[16px] font-regular text-primary-main text-center">
                        {t('TranslationsScreen.clear')}
                      </Text>
                    </Pressable>
                    <Pressable
                      className="h-[31px] justify-center bg-primary-main rounded-[6px] p-[6px]"
                      onPress={handleTranslateText}
                    >
                      <Text className="text-[16px] font-semibold text-text-onPrimary text-center">
                        {t('TranslationsScreen.translate')}
                      </Text>
                    </Pressable>
                  </View>
                </>
              )}
            </View>
          </View>

          <View className="pb-20 items-center h-20">
            {isCurrentlyListening && (
              <Pressable
                className="w-[55px] h-[55px] justify-center items-center bg-primary-main rounded-full"
                onPress={handleStopListening}
              >
                <View className="w-[21px] h-[21px] bg-text-onPrimary rounded-sm" />
              </Pressable>
            )}
          </View>
        </View>
      </GradientLayout>

      <OptionalUpdateModal
        isOptionalUpdateOpen={isOptionalUpdateOpen}
        setIsOptionalUpdateOpen={setIsOptionalUpdateOpen}
      />

      <LanguageBottomSheet
        open={openLanguageModal}
        setOpen={setOpenLanguageModal}
        sourceLanguage={sourceLanguage}
        setSourceLanguage={setSourceLanguage}
        targetLanguage={targetLanguage}
        setTargetLanguage={setTargetLanguage}
      />
    </>
  )
}

export default TranslationsScreen

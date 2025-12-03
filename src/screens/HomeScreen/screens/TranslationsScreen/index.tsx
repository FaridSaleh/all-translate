import { useEffect, useState } from 'react'
import { InteractionManager, Pressable, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import GradientLayout from '../../components/GradientLayout'
import LanguageBottomSheet from '../../components/LanguageBottomSheet'
import OptionalUpdateModal from '../../components/OptionalUpdateModal'
import { LanguageType } from '../../type'
import SourceLanguage from './components/SourceLanguage'
import TargetLanguage from './components/TargetLanguage'
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
  const [isSwapping, setIsSwapping] = useState(false)

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
    if (isSwapping) return
    setIsSwapping(true)

    const temp = sourceLanguage
    setSourceLanguage(targetLanguage)
    setTargetLanguage(temp)
    clearTexts()

    InteractionManager.runAfterInteractions(() => setIsSwapping(false))
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
              <SourceLanguage
                language={sourceLanguage}
                setOpenLanguageModal={setOpenLanguageModal}
                handleStartListening={handleStartListening}
                handleStopListening={handleStopListening}
                isListening={isCurrentlyListening}
                inputValue={sourceText}
                setInputValue={setSourceText}
                isTranscriptAvailable={transcriptAvailabilityCheck(sourceLanguage.id)}
                showTextToSpeechIcon={sourceText.length > 0 && targetText.length > 0}
              />

              <View className="flex-row items-center mx-[10px] mb-[16px]">
                <View className="flex-1 border-t border-bg-buttonDisabled" />
                <Pressable
                  className="w-[30px] h-[30px] bg-bg-base rounded-full items-center justify-center"
                  onPress={isSwapping ? undefined : handleSwapLanguages}
                  disabled={isSwapping}
                >
                  <SwapIcon width={15} height={12} color="#1D4ED8" />
                </Pressable>
                <View className="flex-1 border-t border-bg-buttonDisabled" />
              </View>

              <TargetLanguage
                language={targetLanguage}
                setOpenLanguageModal={setOpenLanguageModal}
                textValue={targetText}
                isListening={isCurrentlyListening}
                isTranscriptAvailable={transcriptAvailabilityCheck(targetLanguage.id)}
                handleSwapLanguages={handleSwapLanguages}
                showTextToSpeechIcon={sourceText.length > 0 && targetText.length > 0}
              />

              <View
                className={`flex-1 border-t border-bg-buttonDisabled mb-[18px] ${sourceText.length > 0 && !isCurrentlyListening ? 'opacity-100' : 'opacity-0'}`}
              />
              <View className="flex-row items-center justify-between">
                <Pressable
                  className={`h-[31px] justify-center rounded-[6px] p-[6px] ${sourceText.length > 0 && !isCurrentlyListening ? 'opacity-100' : 'opacity-0'}`}
                  onPress={clearTexts}
                >
                  <Text className="text-[16px] font-regular text-primary-main text-center">
                    {t('TranslationsScreen.clear')}
                  </Text>
                </Pressable>
                <Pressable
                  className={`h-[31px] justify-center bg-primary-main rounded-[6px] p-[6px] ${sourceText.length > 0 && !isCurrentlyListening ? 'opacity-100' : 'opacity-0'}`}
                  onPress={handleTranslateText}
                >
                  <Text className="text-[16px] font-semibold text-text-onPrimary text-center">
                    {t('TranslationsScreen.translate')}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          <View className="pb-[40px] items-center h-[60px]">
            <Pressable
              className={`w-[55px] h-[55px] justify-center items-center bg-primary-main rounded-full ${isCurrentlyListening ? 'opacity-100' : 'opacity-0'}`}
              onPress={handleStopListening}
            >
              <View className="w-[21px] h-[21px] bg-text-onPrimary rounded-sm" />
            </Pressable>
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

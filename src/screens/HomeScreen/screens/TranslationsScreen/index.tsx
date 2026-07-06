import { useEffect, useRef, useState } from 'react'
import { InteractionManager, Keyboard, Platform, ScrollView, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import GradientLayout from '../../components/GradientLayout'
import LanguageBottomSheet from '../../components/LanguageBottomSheet'
import OptionalUpdateModal from '../../components/OptionalUpdateModal'
import { LanguageType } from '../../type'
import SourceLanguage, { SourceLanguageRef } from './components/SourceLanguage'
import TargetLanguage from './components/TargetLanguage'
import { useSpeechToTextRequest } from '@/apis/translate/speechToText'
import { useTextToTextRequest } from '@/apis/translate/textToText'
import { KeyboardDismissIcon, SwapIcon } from '@/assets'
import { RipplePressable } from '@/components'
import useAudioRecorder from '@/hooks/useAudioRecorder'
import useSpeechToText from '@/hooks/useSpeechToText'
import useConfigurationStore from '@/store/configuration'
import { mapSpeechToTextResult } from '@/utils/mapSpeechToTextResult'

const scrollContentStyle = { flexGrow: 1 }

const KEYBOARD_ACCESSORY_GAP = 16

const TranslationsScreen = () => {
  const { t } = useTranslation()
  const sourceLanguageInputRef = useRef<SourceLanguageRef>(null)
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

  const { mutate: translateText, isPending: isTranslating } = useTextToTextRequest()
  const { mutate: transcriptSpeech } = useSpeechToTextRequest()

  const isCurrentlyListening = isListening || isRecording
  const [isSwapping, setIsSwapping] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const isDetectLanguageSelected = sourceLanguage.id === 'detect'
  const isSwapDisabled = isDetectLanguageSelected || isSwapping
  const isKeyboardVisible = keyboardHeight > 0
  const showActionButtons = sourceText.length > 0 && !isCurrentlyListening
  const pinActionButtonsAboveKeyboard = showActionButtons && isKeyboardVisible
  const keyboardAccessoryBottom = isKeyboardVisible ? keyboardHeight + KEYBOARD_ACCESSORY_GAP : 0

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'

    const showSubscription = Keyboard.addListener(showEvent, event => {
      setKeyboardHeight(event.endCoordinates.height)
    })
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0)
    })

    return () => {
      showSubscription.remove()
      hideSubscription.remove()
    }
  }, [])

  const handleDismissKeyboard = () => {
    Keyboard.dismiss()
  }

  const handleTranslateText = () => {
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
        onSettled: () => {
          Keyboard.dismiss()
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
            file,
            targetLang: targetLanguage.id,
            sourceLang: sourceLanguage.id === 'detect' ? undefined : sourceLanguage.id,
            autoDetect: sourceLanguage.id === 'detect',
          },
          {
            onSuccess(data) {
              const mapped = mapSpeechToTextResult(data, sourceLanguage.id)
              setSourceText(mapped.sourceText)
              setTargetText(mapped.targetText)
            },
          },
        )
      }
    } else {
      await stopListening()
    }
  }

  const handleSwapLanguages = () => {
    if (isSwapDisabled) return
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

  const renderKeyboardDismissButton = () => (
    <RipplePressable
      borderless
      className="w-[36px] h-[36px] bg-bg-base rounded-full items-center justify-center overflow-hidden"
      onPress={handleDismissKeyboard}
    >
      <KeyboardDismissIcon width={28} height={20} color="#1D4ED8" />
    </RipplePressable>
  )

  const renderActionButtons = (withKeyboardDismiss = false) => (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-3">
        {withKeyboardDismiss && renderKeyboardDismissButton()}
        <RipplePressable
          className="justify-center rounded-[6px] p-[6px] overflow-hidden"
          onPress={clearTexts}
        >
          <Text className="text-[16px] font-regular text-primary-main text-center">
            {t('TranslationsScreen.clear')}
          </Text>
        </RipplePressable>
      </View>
      <RipplePressable
        rippleColor="rgba(255, 255, 255, 0.3)"
        className={`justify-center bg-primary-main rounded-[6px] p-[6px] overflow-hidden ${isTranslating ? 'opacity-50' : ''}`}
        onPress={handleTranslateText}
        disabled={isTranslating}
      >
        <Text className="text-[16px] font-semibold text-text-onPrimary text-center py-[4px] px-[12px]">
          {t('TranslationsScreen.translate')}
        </Text>
      </RipplePressable>
    </View>
  )

  return (
    <>
      <GradientLayout>
        <View className="flex-1 p-6">
          <ScrollView
            className="flex-1"
            contentContainerStyle={scrollContentStyle}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
          >
            <View className="bg-bg-card rounded-2xl p-4">
              <SourceLanguage
                ref={sourceLanguageInputRef}
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
                <RipplePressable
                  borderless
                  className={`w-[44px] h-[44px] bg-bg-base rounded-full items-center justify-center overflow-hidden ${isDetectLanguageSelected ? 'opacity-50' : ''}`}
                  onPress={isSwapDisabled ? undefined : handleSwapLanguages}
                  disabled={isSwapDisabled}
                >
                  <SwapIcon
                    width={15}
                    height={12}
                    color={isDetectLanguageSelected ? '#9CA3AF' : '#1D4ED8'}
                  />
                </RipplePressable>
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
                isTranslating={isTranslating}
              />

              {!pinActionButtonsAboveKeyboard && (
                <>
                  <View
                    className={`flex-1 border-t border-bg-buttonDisabled mb-[18px] ${showActionButtons ? 'opacity-100' : 'opacity-0'}`}
                  />
                  <View className={showActionButtons ? 'opacity-100' : 'opacity-0'}>
                    {renderActionButtons()}
                  </View>
                </>
              )}
            </View>
          </ScrollView>

          {pinActionButtonsAboveKeyboard && (
            <View
              className="absolute left-6 right-6 z-10 px-4 pt-3 pb-3 bg-bg-card rounded-2xl border-t border-bg-buttonDisabled"
              style={{ bottom: keyboardAccessoryBottom }}
              pointerEvents="box-none"
            >
              {renderActionButtons(true)}
            </View>
          )}

          {isKeyboardVisible && !showActionButtons && (
            <View className="absolute left-6 z-10" style={{ bottom: keyboardAccessoryBottom }}>
              {renderKeyboardDismissButton()}
            </View>
          )}

          <View
            className={`pb-[40px] items-center h-[60px] ${isKeyboardVisible ? 'opacity-0' : ''}`}
            pointerEvents={isKeyboardVisible ? 'none' : 'auto'}
          >
            <RipplePressable
              rippleColor="rgba(255, 255, 255, 0.3)"
              className={`w-[55px] h-[55px] justify-center items-center bg-primary-main rounded-full overflow-hidden ${isCurrentlyListening ? 'opacity-100' : 'opacity-0'}`}
              onPress={handleStopListening}
            >
              <View className="w-[21px] h-[21px] bg-text-onPrimary rounded-sm" />
            </RipplePressable>
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

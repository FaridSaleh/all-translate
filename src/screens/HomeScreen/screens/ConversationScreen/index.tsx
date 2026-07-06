import { useEffect, useState } from 'react'
import { Keyboard, Platform, ScrollView, View } from 'react-native'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import GradientLayout from '../../components/GradientLayout'
import LanguageBottomSheet from '../../components/LanguageBottomSheet'
import { LanguageType } from '../../type'
import ConversationBottomSheet from './components/ConversationBottomSheet'
import SourceLanguage from './components/SourceLanguage'
import TargetLanguage from './components/TargetLanguage'
import { useSpeechToTextRequest } from '@/apis/translate/speechToText'
import { MicrophoneIcon, KeyboardDismissIcon } from '@/assets'
import { RipplePressable } from '@/components'
import useAudioRecorder from '@/hooks/useAudioRecorder'
import useConfigurationStore from '@/store/configuration'
import { mapSpeechToTextResult } from '@/utils/mapSpeechToTextResult'

const scrollContentStyle = { flexGrow: 1 }

const ConversationScreen = () => {
  const tabBarHeight = useBottomTabBarHeight()
  const [isConversationModalOpen, setIsConversationModalOpen] = useState(false)
  const [openLanguageModal, setOpenLanguageModal] = useState<'source' | 'target' | false>(false)
  const [sourceLanguage, setSourceLanguage] = useState<LanguageType>({
    id: 'en',
    name: 'English',
  })
  const [targetLanguage, setTargetLanguage] = useState<LanguageType>({ id: 'es', name: 'Spanish' })
  const [sourceText, setSourceText] = useState('')
  const [targetText, setTargetText] = useState('')

  const { hasPremiumFeature } = useConfigurationStore()
  const { isRecording, startRecording, stopRecording } = useAudioRecorder()

  const { mutate: transcriptSpeech } = useSpeechToTextRequest()
  const [keyboardHeight, setKeyboardHeight] = useState(0)

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

  const isKeyboardVisible = keyboardHeight > 0

  const micButtonContainerStyle = isKeyboardVisible
    ? { paddingBottom: 16, marginBottom: keyboardHeight }
    : { paddingBottom: 16, marginBottom: tabBarHeight }

  const scrollContentContainerStyle = [
    scrollContentStyle,
    keyboardHeight > 0 ? { paddingBottom: 16 } : null,
  ]

  const handleDismissKeyboard = () => {
    Keyboard.dismiss()
  }

  useEffect(() => {
    if (!hasPremiumFeature) {
      // setIsConversationModalOpen(true)
    }
  }, [hasPremiumFeature])

  const handleStartListening = async () => {
    await startRecording()
  }

  const handleStopListening = async () => {
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
          sourceLang: sourceLanguage.id,
          autoDetect: true,
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
  }

  return (
    <>
      <GradientLayout>
        <View className="flex-1 p-6">
          <ScrollView
            className="flex-1"
            contentContainerStyle={scrollContentContainerStyle}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
          >
            <View className="bg-bg-card rounded-2xl p-4">
              <SourceLanguage
                language={sourceLanguage}
                setOpenLanguageModal={setOpenLanguageModal}
                inputValue={sourceText}
                setInputValue={setSourceText}
                showTextToSpeechIcon={sourceText.length > 0 && targetText.length > 0}
                isListening={isRecording}
              />

              <View className="flex-1 border-t border-bg-buttonDisabled mx-[10px] mb-[19px]" />

              <TargetLanguage
                language={targetLanguage}
                setOpenLanguageModal={setOpenLanguageModal}
                inputValue={targetText}
                setInputValue={setTargetText}
                showTextToSpeechIcon={sourceText.length > 0 && targetText.length > 0}
                isListening={isRecording}
              />
            </View>

            <View className="mt-4 ml-4" pointerEvents={isKeyboardVisible ? 'auto' : 'none'}>
              <RipplePressable
                borderless
                className={`w-[36px] h-[36px] bg-bg-base rounded-full items-center justify-center overflow-hidden ${isKeyboardVisible ? 'opacity-100' : 'opacity-0'}`}
                onPress={handleDismissKeyboard}
              >
                <KeyboardDismissIcon width={28} height={20} color="#1D4ED8" />
              </RipplePressable>
            </View>
          </ScrollView>

          <View className="items-center h-[60px]" style={micButtonContainerStyle}>
            <RipplePressable
              rippleColor="rgba(255, 255, 255, 0.3)"
              className={`w-[55px] h-[55px] justify-center items-center bg-primary-main rounded-full overflow-hidden ${!isRecording ? 'opacity-100' : 'opacity-0'}`}
              onPress={handleStartListening}
            >
              <MicrophoneIcon width={32} height={32} color="#FFFFFF" />
            </RipplePressable>

            <RipplePressable
              rippleColor="rgba(255, 255, 255, 0.3)"
              className={`relative top-[-55px] w-[55px] h-[55px] justify-center items-center bg-primary-main rounded-full overflow-hidden ${isRecording ? 'opacity-100' : 'opacity-0'}`}
              onPress={handleStopListening}
            >
              <View className="w-[21px] h-[21px] bg-text-onPrimary rounded-sm" />
            </RipplePressable>
          </View>
        </View>
      </GradientLayout>

      <LanguageBottomSheet
        open={openLanguageModal}
        setOpen={setOpenLanguageModal}
        sourceLanguage={sourceLanguage}
        setSourceLanguage={setSourceLanguage}
        targetLanguage={targetLanguage}
        setTargetLanguage={setTargetLanguage}
      />

      <ConversationBottomSheet
        open={isConversationModalOpen}
        setOpen={setIsConversationModalOpen}
      />
    </>
  )
}

export default ConversationScreen

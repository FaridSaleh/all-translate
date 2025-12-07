import { useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'
import GradientLayout from '../../components/GradientLayout'
import LanguageBottomSheet from '../../components/LanguageBottomSheet'
import { LanguageType } from '../../type'
import ConversationBottomSheet from './components/ConversationBottomSheet'
import SourceLanguage from './components/SourceLanguage'
import TargetLanguage from './components/TargetLanguage'
import { useSpeechToTextRequest } from '@/apis/translate/speechToText'
import { MicrophoneIcon } from '@/assets'
import useAudioRecorder from '@/hooks/useAudioRecorder'
import useConfigurationStore from '@/store/configuration'

const ConversationScreen = () => {
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
            if (data.sourceLang === sourceLanguage.id) {
              setSourceText(data.transcribedText)
              setTargetText(data.translatedText)
            } else {
              setTargetText(data.transcribedText)
              setSourceText(data.translatedText)
            }
          },
        },
      )
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
          </View>

          <View className="pb-[40px] items-center h-[60px]">
            <Pressable
              className={`w-[55px] h-[55px] justify-center items-center bg-primary-main rounded-full ${!isRecording ? 'opacity-100' : 'opacity-0'}`}
              onPress={handleStartListening}
            >
              <MicrophoneIcon width={32} height={32} color="#FFFFFF" />
            </Pressable>

            <Pressable
              className={`relative top-[-55px] w-[55px] h-[55px] justify-center items-center bg-primary-main rounded-full ${isRecording ? 'opacity-100' : 'opacity-0'}`}
              onPress={handleStopListening}
            >
              <View className="w-[21px] h-[21px] bg-text-onPrimary rounded-sm" />
            </Pressable>
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

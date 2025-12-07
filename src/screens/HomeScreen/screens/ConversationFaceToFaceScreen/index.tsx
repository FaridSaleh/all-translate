import { useState } from 'react'
import { Pressable, View } from 'react-native'
import LanguageBottomSheet from '../../components/LanguageBottomSheet'
import { LanguageType } from '../../type'
import SourceLanguage from '../ConversationScreen/components/SourceLanguage'
import TargetLanguage from '../ConversationScreen/components/TargetLanguage'
import { useSpeechToTextRequest } from '@/apis/translate/speechToText'
import { MicrophoneIcon } from '@/assets'
import useAudioRecorder from '@/hooks/useAudioRecorder'
import GradientLayout from '@/screens/HomeScreen/components/GradientLayout'

const ConversationFaceToFaceScreen = () => {
  const [openLanguageModal, setOpenLanguageModal] = useState<'source' | 'target' | false>(false)
  const [sourceLanguage, setSourceLanguage] = useState<LanguageType>({
    id: 'en',
    name: 'English',
  })
  const [targetLanguage, setTargetLanguage] = useState<LanguageType>({ id: 'es', name: 'Spanish' })
  const [sourceText, setSourceText] = useState('')
  const [targetText, setTargetText] = useState('')

  const { isRecording, startRecording, stopRecording } = useAudioRecorder()

  const { mutate: transcriptSpeech } = useSpeechToTextRequest()

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
            setSourceText(data.transcribedText)
            setTargetText(data.translatedText)
          },
        },
      )
    }
  }

  return (
    <>
      <GradientLayout>
        <View className="flex-1 p-6 justify-center items-center mb-[105px]">
          <View className="w-full bg-bg-card rounded-2xl p-4 rotate-180">
            <TargetLanguage
              language={targetLanguage}
              setOpenLanguageModal={setOpenLanguageModal}
              inputValue={targetText}
              setInputValue={setTargetText}
              showTextToSpeechIcon={sourceText.length > 0 && targetText.length > 0}
              isListening={isRecording}
            />
          </View>

          <View className="pb-[40px] items-center h-[60px] my-[16px]">
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

          <View className="w-full bg-bg-card rounded-2xl p-4">
            <SourceLanguage
              language={sourceLanguage}
              setOpenLanguageModal={setOpenLanguageModal}
              inputValue={sourceText}
              setInputValue={setSourceText}
              showTextToSpeechIcon={sourceText.length > 0 && targetText.length > 0}
              isListening={isRecording}
            />
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
    </>
  )
}

export default ConversationFaceToFaceScreen

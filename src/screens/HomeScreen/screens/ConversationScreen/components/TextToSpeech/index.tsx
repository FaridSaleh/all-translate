import { View } from 'react-native'
import TextToSpeechProps from './type'
import { useConversationTextToSpeechRequest } from '@/apis/translate/textToSpeech'
import { SpeakerIcon } from '@/assets'
import { RipplePressable } from '@/components'
import useTextToSpeech from '@/hooks/useTextToSpeech'

const TextToSpeech = ({ type, show, textValue, targetLanguage }: TextToSpeechProps) => {
  const { mutate: speakTextToSpeech } = useConversationTextToSpeechRequest()

  const { isSpeaking, stop: stopSpeaking, playAudioFromArrayBuffer } = useTextToSpeech()

  const handleSpeakTargetText = async () => {
    if (isSpeaking) {
      await stopSpeaking()
      return
    }

    if (!textValue || textValue.trim().length === 0) {
      return
    }

    speakTextToSpeech(
      {
        translatedText: textValue,
        targetLang: targetLanguage.id,
      },
      {
        onSuccess: async data => {
          if (data instanceof ArrayBuffer && data.byteLength > 0) {
            await playAudioFromArrayBuffer(data)
          } else {
            console.log('Unexpected data type or empty data:', data)
          }
        },
        onError(error) {
          console.log(error)
        },
      },
    )
  }

  return (
    <View className="flex-row items-center">
      <RipplePressable
        borderless
        className={`h-[44px] items-center justify-center ${show ? 'opacity-100 w-[44px]' : 'opacity-0 w-0'}`}
        disabled={!show}
        onPress={handleSpeakTargetText}
      >
        <SpeakerIcon width={20} height={20} color={type === 'source' ? '#000000' : '#1E40AF'} />
      </RipplePressable>
    </View>
  )
}

export default TextToSpeech

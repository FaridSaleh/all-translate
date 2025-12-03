import { Pressable, View } from 'react-native'
import TextToSpeechProps from './type'
import { useTextToSpeechRequest } from '@/apis/translate/textToSpeech'
import { SpeakerIcon } from '@/assets'
import useTextToSpeech from '@/hooks/useTextToSpeech'

const TextToSpeech = ({ type, show, textValue, targetLanguage }: TextToSpeechProps) => {
  const { mutate: speakTextToSpeech } = useTextToSpeechRequest()

  const { playAudioFromArrayBuffer } = useTextToSpeech()

  const handleSpeakTargetText = async () => {
    if (!textValue || textValue.trim().length === 0) {
      return
    } else {
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
  }

  return (
    <View className="flex-row items-center">
      <Pressable
        className={`${show ? 'opacity-100' : 'opacity-0 w-0'}`}
        disabled={!show}
        onPress={handleSpeakTargetText}
      >
        <SpeakerIcon width={20} height={20} color={type === 'source' ? '#000000' : '#1E40AF'} />
      </Pressable>
    </View>
  )
}

export default TextToSpeech

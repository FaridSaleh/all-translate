import { useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'
import VoiceUnavailableBottomSheet from '../VoiceUnavailableBottomSheet'
import TextToSpeechProps from './type'
import { useTextToSpeechRequest } from '@/apis/translate/textToSpeech'
import { InfoIcon, SpeakerIcon } from '@/assets'
import useTextToSpeech from '@/hooks/useTextToSpeech'
import useConfigurationStore from '@/store/configuration'

const TextToSpeech = ({ type, show, textValue, targetLanguage }: TextToSpeechProps) => {
  const [isTtsAvailable, setIsTtsAvailable] = useState(false)
  const [isVoiceUnavailableOpen, setIsVoiceUnavailableOpen] = useState(false)

  const { hasPremiumFeature } = useConfigurationStore()

  const { mutate: speakTextToSpeech } = useTextToSpeechRequest()

  const {
    isSpeaking,
    speak: speakText,
    stop: stopSpeaking,
    checkLanguageSupport: checkTtsLanguageSupport,
  } = useTextToSpeech()

  useEffect(() => {
    const checkTtsSupport = async () => {
      const available = await checkTtsLanguageSupport(targetLanguage.id)
      setIsTtsAvailable(available)
    }
    checkTtsSupport()
  }, [targetLanguage.id, checkTtsLanguageSupport])

  const handleSpeakTargetText = async () => {
    if (isSpeaking) {
      await stopSpeaking()
      return
    }

    if (!isTextToSpeechAvailable || !textValue || textValue.trim().length === 0) {
      return
    } else if (hasPremiumFeature) {
      speakTextToSpeech(
        {
          translatedText: textValue,
          targetLang: targetLanguage.id,
        },
        {
          onSuccess(data) {
            console.log('Audio data received!')
            console.log('Type:', typeof data)
            console.log('Is ArrayBuffer:', data instanceof ArrayBuffer)
            console.log('Byte length:', data?.byteLength || 0)

            if (data instanceof ArrayBuffer && data.byteLength > 0) {
              // Verify we have audio data
              const bytes = new Uint8Array(data)
              console.log('First 10 bytes:', Array.from(bytes.slice(0, 10)))
              console.log('Audio data is ready to play!')

              // TODO: Play the audio using the ArrayBuffer
              // You'll need to save it to a file and play it, or use a library that supports ArrayBuffer
            } else {
              console.log('Unexpected data type or empty data:', data)
            }
          },
          onError(error) {
            console.log(error)
          },
        },
      )
    } else {
      await speakText(textValue, targetLanguage.id)
    }
  }

  const isTextToSpeechAvailable = isTtsAvailable || hasPremiumFeature

  return (
    <>
      <View className="flex-row items-center">
        <Pressable
          className={`${show ? 'opacity-100' : 'opacity-0 w-0'}`}
          disabled={!show}
          onPress={handleSpeakTargetText}
        >
          <SpeakerIcon
            width={20}
            height={20}
            color={!isTextToSpeechAvailable ? '#9CA3AF' : type === 'source' ? '#000000' : '#1E40AF'}
          />
        </Pressable>

        <Pressable
          className={`${!isTextToSpeechAvailable && show ? 'opacity-100' : 'opacity-0 w-0'}`}
          onPress={() => setIsVoiceUnavailableOpen(true)}
        >
          <InfoIcon width={23} height={23} color="#9CA3AF" />
        </Pressable>
      </View>

      <VoiceUnavailableBottomSheet
        open={isVoiceUnavailableOpen}
        setOpen={setIsVoiceUnavailableOpen}
        languageName={targetLanguage.name}
      />
    </>
  )
}

export default TextToSpeech

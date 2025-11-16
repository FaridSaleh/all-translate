import { useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'
import VoiceUnavailableBottomSheet from '../VoiceUnavailableBottomSheet'
import TextToSpeechProps from './type'
import { InfoIcon, SpeakerIcon } from '@/assets'
import useTextToSpeech from '@/hooks/useTextToSpeech'

const TextToSpeech = ({ type, show, textValue, targetLanguage }: TextToSpeechProps) => {
  const [isTtsAvailable, setIsTtsAvailable] = useState(false)
  const [isVoiceUnavailableOpen, setIsVoiceUnavailableOpen] = useState(false)

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
    if (textValue && textValue.trim().length > 0) {
      if (isSpeaking) {
        await stopSpeaking()
      } else {
        await speakText(textValue, targetLanguage.id)
      }
    }
  }

  return (
    <>
      <View className="flex-row items-center">
        <Pressable
          className={`${show ? 'opacity-100' : 'opacity-0 w-0'}`}
          disabled={!show || !isTtsAvailable}
          onPress={handleSpeakTargetText}
        >
          <SpeakerIcon
            width={20}
            height={20}
            color={!isTtsAvailable ? '#9CA3AF' : type === 'source' ? '#000000' : '#1E40AF'}
          />
        </Pressable>

        <Pressable
          className={`${!isTtsAvailable && show ? 'opacity-100' : 'opacity-0 w-0'}`}
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

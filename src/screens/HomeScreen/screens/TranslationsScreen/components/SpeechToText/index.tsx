import { useState } from 'react'
import { View } from 'react-native'
import SpeechToTextBottomSheet from '../SpeechToTextBottomSheet'
import SpeechToTextProps from './type'
import { InfoIcon, MicrophoneIcon } from '@/assets'
import { RipplePressable } from '@/components'
import useConfigurationStore from '@/store/configuration'

const SpeechToText = ({
  type,
  show,
  onPress,
  isListening,
  isTranscriptAvailable,
  languageName,
}: SpeechToTextProps) => {
  const [isVoiceUnavailableOpen, setIsVoiceUnavailableOpen] = useState(false)

  const { hasPremiumFeature } = useConfigurationStore()

  const isSpeechToTextAvailable = isTranscriptAvailable || hasPremiumFeature

  return (
    <>
      <View className="flex-row items-center">
        <RipplePressable
          borderless
          className={`${show ? 'opacity-100' : 'opacity-0'}`}
          disabled={!show}
          onPress={onPress}
        >
          <MicrophoneIcon
            width={20}
            opacity={isListening ? 0 : 1}
            height={20}
            color={!isSpeechToTextAvailable ? '#9CA3AF' : type === 'source' ? '#000000' : '#1E40AF'}
          />
        </RipplePressable>
        <RipplePressable
          borderless
          className={`${!isSpeechToTextAvailable && show ? 'opacity-100' : 'opacity-0 w-0'}`}
          onPress={() => setIsVoiceUnavailableOpen(true)}
        >
          <InfoIcon width={23} height={23} color="#9CA3AF" />
        </RipplePressable>
      </View>

      <SpeechToTextBottomSheet
        open={isVoiceUnavailableOpen}
        setOpen={setIsVoiceUnavailableOpen}
        languageName={languageName}
      />
    </>
  )
}

export default SpeechToText

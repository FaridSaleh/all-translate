import { useEffect, useState } from 'react'
import { Alert, Pressable, Text, View } from 'react-native'
import GradientLayout from '../../components/GradientLayout'
import LanguageBottomSheet from '../../components/LanguageBottomSheet'
import OptionalUpdateModal from '../../components/OptionalUpdateModal'
import { ChevronUpAndDownIcon, MicrophoneIcon } from '@/assets'
import useSpeechToText from '@/hooks/useSpeechToText'
import useConfigurationStore from '@/store/configuration'

const TranslationsScreen = () => {
  const { hasOptionalUpdate } = useConfigurationStore()
  const [isOptionalUpdateOpen, setIsOptionalUpdateOpen] = useState(false)
  const [sourceLanguage, setSourceLanguage] = useState('Detect Language')
  const [targetLanguage, setTargetLanguage] = useState('Spanish')
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false)

  const { isListening, isAvailable, results, startListening, stopListening } = useSpeechToText()

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsOptionalUpdateOpen(hasOptionalUpdate)
    }, 3000)

    return () => clearTimeout(timeout)
  }, [])

  const handlePress = async () => {
    if (!isAvailable) {
      Alert.alert('Error', 'Speech recognition is not available on this device')
      return
    }

    if (isListening) {
      await stopListening()
    } else {
      await startListening('en-US')
    }
  }

  return (
    <>
      <GradientLayout>
        <View className="flex-1 p-6">
          <View className="bg-bg-card rounded-2xl p-4">
            <View className="flex-row items-center justify-between">
              <Pressable
                className="flex-row items-center gap-2"
                onPress={() => setIsLanguageModalOpen(true)}
              >
                <Text className="text-[14px] font-medium text-text-primary">{sourceLanguage}</Text>
                <ChevronUpAndDownIcon width={9} height={13} />
              </Pressable>
              <MicrophoneIcon width={20} height={20} color="#000000" />
            </View>
          </View>
          {/* <View className="items-center">
            <Pressable
              onPress={handlePress}
              disabled={!isAvailable}
              className={`w-16 h-16 rounded-full items-center justify-center ${
                isListening ? 'bg-red-500' : 'bg-blue-500'
              } ${!isAvailable ? 'opacity-50' : ''}`}
            >
              <MicrophoneIcon width={24} height={24} fill={isListening ? 'white' : 'white'} />
            </Pressable>

            <Text className="text-sm text-gray-600 mt-2">
              {isListening ? 'Listening...' : 'Tap to speak'}
            </Text>

            {results.length > 0 && (
              <View className="mt-4 p-3 bg-gray-100 rounded-lg max-w-xs">
                <Text className="text-sm text-gray-800">{results[0]}</Text>
              </View>
            )}
          </View> */}
        </View>
      </GradientLayout>

      <OptionalUpdateModal
        isOptionalUpdateOpen={isOptionalUpdateOpen}
        setIsOptionalUpdateOpen={setIsOptionalUpdateOpen}
      />

      <LanguageBottomSheet isOpen={isLanguageModalOpen} setIsOpen={setIsLanguageModalOpen} />
    </>
  )
}

export default TranslationsScreen

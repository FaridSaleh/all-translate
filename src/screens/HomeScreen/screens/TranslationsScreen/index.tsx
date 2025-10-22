import { useEffect, useState } from 'react'
import { Alert, Pressable, Text, View } from 'react-native'
import GradientLayout from '../../components/GradientLayout'
import LanguageBottomSheet from '../../components/LanguageBottomSheet'
import OptionalUpdateModal from '../../components/OptionalUpdateModal'
import { LanguageType } from './type'
import { ChevronUpAndDownIcon, MicrophoneIcon } from '@/assets'
import useSpeechToText from '@/hooks/useSpeechToText'
import useConfigurationStore from '@/store/configuration'

const TranslationsScreen = () => {
  const [isOptionalUpdateOpen, setIsOptionalUpdateOpen] = useState(false)
  const [openLanguageModal, setOpenLanguageModal] = useState<'source' | 'target' | false>(false)
  const [sourceLanguage, setSourceLanguage] = useState<LanguageType>({
    id: 'detect',
    name: 'Detect Language',
  })
  const [targetLanguage, setTargetLanguage] = useState<LanguageType>({ id: 'es', name: 'Spanish' })

  const { hasOptionalUpdate } = useConfigurationStore()
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
      await startListening(sourceLanguage.id)
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
                onPress={() => setOpenLanguageModal('source')}
              >
                <Text className="text-[14px] font-medium text-text-primary">
                  {sourceLanguage.name}
                </Text>
                <ChevronUpAndDownIcon width={9} height={13} />
              </Pressable>
              <Pressable onPress={handlePress}>
                <MicrophoneIcon width={20} height={20} fill={isListening ? '#000000' : '#000000'} />
              </Pressable>
            </View>
          </View>
          <View className="items-center">
            <Text className="text-sm text-gray-600 mt-2">
              {isListening ? 'Listening...' : 'Tap to speak'}
            </Text>

            {results.length > 0 && (
              <View className="mt-4 p-3 bg-gray-100 rounded-lg max-w-xs">
                <Text className="text-sm text-gray-800">{results[0]}</Text>
              </View>
            )}
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

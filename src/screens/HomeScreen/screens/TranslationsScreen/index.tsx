import { useEffect, useState } from 'react'
import { Alert, Pressable, Text, TextInput, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import GradientLayout from '../../components/GradientLayout'
import LanguageBottomSheet from '../../components/LanguageBottomSheet'
import OptionalUpdateModal from '../../components/OptionalUpdateModal'
import { LanguageType } from './type'
import { ChevronUpAndDownIcon, MicrophoneIcon } from '@/assets'
import useSpeechToText from '@/hooks/useSpeechToText'
import useConfigurationStore from '@/store/configuration'

const TranslationsScreen = () => {
  const { t } = useTranslation()
  const [isOptionalUpdateOpen, setIsOptionalUpdateOpen] = useState(false)
  const [openLanguageModal, setOpenLanguageModal] = useState<'source' | 'target' | false>(false)
  const [sourceLanguage, setSourceLanguage] = useState<LanguageType>({
    id: 'detect',
    name: 'Detect Language',
  })
  const [targetLanguage, setTargetLanguage] = useState<LanguageType>({ id: 'es', name: 'Spanish' })

  const { hasOptionalUpdate } = useConfigurationStore()
  const {
    isListening,
    result: sourceText,
    setResult: setSourceText,
    startListening,
    stopListening,
    isLanguageAvailable,
  } = useSpeechToText()

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsOptionalUpdateOpen(hasOptionalUpdate)
    }, 3000)

    return () => clearTimeout(timeout)
  }, [])

  const handleStartListening = async () => {
    if (!isLanguageAvailable(sourceLanguage.id)) {
      Alert.alert('Language not supported')
      return
    }

    await startListening(sourceLanguage.id)
  }

  const handleStopListening = async () => {
    await stopListening()
  }

  return (
    <>
      <GradientLayout>
        <View className="flex-1 p-6">
          <View className="flex-1">
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
                <Pressable onPress={handleStartListening}>
                  {!isListening && <MicrophoneIcon width={20} height={20} color="#000000" />}
                </Pressable>
              </View>
              <TextInput
                className="my-[16px] text-[17px] font-bold text-text-primary bg-[transparent]"
                placeholder={t('TranslationsScreen.english_text_placeholder')}
                placeholderTextColor="#9CA3AF"
                value={sourceText}
                onChangeText={text => {
                  setSourceText(text)
                  if (isListening) {
                    stopListening()
                  }
                }}
                autoCorrect={false}
                autoCapitalize="none"
              />
            </View>
            <View className="items-center">
              <Text className="text-sm text-gray-600 mt-2">
                {isListening ? 'Listening...' : 'Tap to speak'}
              </Text>
            </View>
          </View>
          {isListening && (
            <View className="pb-20 items-center">
              <Pressable
                className="w-[55px] h-[55px] justify-center items-center bg-primary-main rounded-full"
                onPress={handleStopListening}
              >
                <View className="w-[21px] h-[21px] bg-text-onPrimary rounded-sm" />
              </Pressable>
            </View>
          )}
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

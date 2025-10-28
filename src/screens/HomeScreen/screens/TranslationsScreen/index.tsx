import { useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'
import GradientLayout from '../../components/GradientLayout'
import LanguageBottomSheet from '../../components/LanguageBottomSheet'
import OptionalUpdateModal from '../../components/OptionalUpdateModal'
import LanguageSection from './components/LanguageSection'
import VoiceUnavailableBottomSheet from './components/VoiceUnavailableBottomSheet'
import { LanguageType } from './type'
import { SwapIcon } from '@/assets'
import useSpeechToText from '@/hooks/useSpeechToText'
import useConfigurationStore from '@/store/configuration'

const TranslationsScreen = () => {
  const [isOptionalUpdateOpen, setIsOptionalUpdateOpen] = useState(false)
  const [openLanguageModal, setOpenLanguageModal] = useState<'source' | 'target' | false>(false)
  const [isVoiceUnavailableOpen, setIsVoiceUnavailableOpen] = useState(false)
  const [targetLanguage, setTargetLanguage] = useState<LanguageType>({ id: 'es', name: 'Spanish' })
  const [sourceLanguage, setSourceLanguage] = useState<LanguageType>({
    id: 'detect',
    name: 'Detect Language',
  })

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
      setIsVoiceUnavailableOpen(true)
      return
    }

    await startListening(sourceLanguage.id)
  }

  const handleStopListening = async () => {
    await stopListening()
  }

  const handleSwapLanguages = () => {
    const temp = sourceLanguage
    setSourceLanguage(targetLanguage)
    setTargetLanguage(temp)
    setSourceText('')
  }

  return (
    <>
      <GradientLayout>
        <View className="flex-1 p-6">
          <View className="flex-1">
            <View className="bg-bg-card rounded-2xl p-4">
              <LanguageSection
                type="source"
                language={sourceLanguage}
                setOpenLanguageModal={setOpenLanguageModal}
                handleStartListening={handleStartListening}
                handleStopListening={handleStopListening}
                isListening={isListening}
                inputValue={sourceText}
                setInputValue={setSourceText}
              />
              <View className="flex-row items-center">
                <View className="flex-1 border-t border-bg-buttonDisabled" />
                <Pressable
                  className="w-[30px] h-[30px] bg-bg-base rounded-full items-center justify-center"
                  onPress={handleSwapLanguages}
                >
                  <SwapIcon width={15} height={12} color="#1D4ED8" />
                </Pressable>
                <View className="flex-1 border-t border-bg-buttonDisabled" />
              </View>
              <LanguageSection
                type="target"
                language={targetLanguage}
                setOpenLanguageModal={setOpenLanguageModal}
                handleStartListening={handleStartListening}
                handleStopListening={handleStopListening}
                isListening={isListening}
                inputValue={sourceText}
                setInputValue={setSourceText}
              />
            </View>
          </View>
          <View className="pb-20 items-center h-20">
            {isListening && (
              <Pressable
                className="w-[55px] h-[55px] justify-center items-center bg-primary-main rounded-full"
                onPress={handleStopListening}
              >
                <View className="w-[21px] h-[21px] bg-text-onPrimary rounded-sm" />
              </Pressable>
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

      <VoiceUnavailableBottomSheet
        open={isVoiceUnavailableOpen}
        setOpen={setIsVoiceUnavailableOpen}
        languageName={sourceLanguage.name}
      />
    </>
  )
}

export default TranslationsScreen

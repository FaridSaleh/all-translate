import { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import GradientLayout from '../../components/GradientLayout'
import OptionalUpdateModal from '../../components/OptionalUpdateModal'
import useConfigurationStore from '@/store/configuration'

const TranslationsScreen = () => {
  const { hasOptionalUpdate } = useConfigurationStore()
  const [isOptionalUpdateOpen, setIsOptionalUpdateOpen] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsOptionalUpdateOpen(hasOptionalUpdate)
    }, 3000)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <>
      <GradientLayout>
        <View className="flex-1 p-6">
          <Text className="text-[20px] font-bold text-text-primary">Translations Screen</Text>
        </View>
      </GradientLayout>
      <OptionalUpdateModal
        isOptionalUpdateOpen={isOptionalUpdateOpen}
        setIsOptionalUpdateOpen={setIsOptionalUpdateOpen}
      />
    </>
  )
}

export default TranslationsScreen

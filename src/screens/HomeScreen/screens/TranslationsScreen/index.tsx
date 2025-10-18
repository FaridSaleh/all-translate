import { Text, View } from 'react-native'
import GradientLayout from '../../components/GradientLayout'

const TranslationsScreen = () => {
  return (
    <GradientLayout>
      <View className="flex-1 p-6">
        <Text className="text-[20px] font-bold text-text-primary">Translations Screen</Text>
      </View>
    </GradientLayout>
  )
}

export default TranslationsScreen

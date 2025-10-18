import { Text, View } from 'react-native'
import GradientLayout from '../../components/GradientLayout'

const ImageScreen = () => {
  return (
    <GradientLayout>
      <View className="flex-1 items-center justify-center">
        <Text className="text-[20px] font-bold text-text-primary">Image Screen</Text>
      </View>
    </GradientLayout>
  )
}

export default ImageScreen

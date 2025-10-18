import { Text, View } from 'react-native'
import GradientLayout from '../../components/GradientLayout'

const ConversationScreen = () => {
  return (
    <GradientLayout>
      <View className="flex-1 items-center justify-center">
        <Text className="text-[20px] font-bold text-text-primary">Conversation Screen</Text>
      </View>
    </GradientLayout>
  )
}

export default ConversationScreen

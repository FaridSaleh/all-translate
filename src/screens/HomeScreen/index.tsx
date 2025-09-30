import React from 'react'
import { Text } from 'react-native'
import HomeScreenProps from './type'
import { SafeAreaView } from 'react-native-safe-area-context'

function HomeScreen({ navigation }: HomeScreenProps) {
  console.log('🚀 ~ HomeScreen ~ navigation:', navigation)

  return (
    <SafeAreaView className="flex-1">
      <Text className="text-[32px] font-bold text-text-primary">Home Screen</Text>
    </SafeAreaView>
  )
}

export default HomeScreen

import { StatusBar, Text, useColorScheme, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import LinearGradient from 'react-native-linear-gradient'
import './global.css'

function App() {
  const isDarkMode = useColorScheme() === 'dark'

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  )
}

function AppContent() {
  return (
    <LinearGradient
      colors={['#D2E5FF', '#F4F8FF', '#FFFFFF']}
      locations={[0, 0.6, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <View className="w-screen h-screen">
        <View className="flex-1 items-center justify-center">
          <Text className="text-[32px] font-bold text-text-primary">All Translate</Text>
        </View>
      </View>
    </LinearGradient>
  )
}

export default App

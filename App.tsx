import { StatusBar, useColorScheme, LogBox } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { QueryClientProvider } from '@tanstack/react-query'
import AppNavigator from '@/screens'
import '@/i18n'
import './global.css'
import queryClient from '@/utils/api/queryClient'

LogBox.ignoreAllLogs(true)

function App() {
  const isDarkMode = useColorScheme() === 'dark'

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView className="flex-1">
        <QueryClientProvider client={queryClient}>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <AppNavigator />
        </QueryClientProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
}

export default App

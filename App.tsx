import { StatusBar, useColorScheme, LogBox } from 'react-native'
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
      <QueryClientProvider client={queryClient}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppNavigator />
      </QueryClientProvider>
    </SafeAreaProvider>
  )
}

export default App

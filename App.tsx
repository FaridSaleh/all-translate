import { StatusBar, LogBox } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { QueryClientProvider } from '@tanstack/react-query'
import AppNavigator from '@/screens'
import '@/i18n'
import './global.css'
import queryClient from '@/utils/api/queryClient'

LogBox.ignoreAllLogs(true)

function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView className="flex-1">
        <QueryClientProvider client={queryClient}>
          <BottomSheetModalProvider>
            <StatusBar barStyle={'dark-content'} />
            <AppNavigator />
          </BottomSheetModalProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
}

export default App

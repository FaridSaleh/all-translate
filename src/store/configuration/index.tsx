import { createJSONStorage, persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ConfigurationDto } from '@/apis/configuration'
import { create } from '@/store'

interface ConfigurationStore {
  configuration: ConfigurationDto | null
  setConfiguration: (configuration: ConfigurationDto | null) => void
  nextSplashMessageId: number | null
  setNextSplashMessageId: (nextSplashMessageId: number | null) => void
}

const useConfigurationStore = create<ConfigurationStore>()(
  persist(
    set => ({
      configuration: null,
      setConfiguration: configuration => {
        set({ configuration })
      },
      nextSplashMessageId: null,
      setNextSplashMessageId: nextSplashMessageId => {
        set({ nextSplashMessageId })
      },
    }),
    { name: 'CONFIGURATIONS', storage: createJSONStorage(() => AsyncStorage) },
  ),
)

export default useConfigurationStore

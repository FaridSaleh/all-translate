import AsyncStorage from '@react-native-async-storage/async-storage'
import { createJSONStorage, persist } from 'zustand/middleware'
import { ConfigurationDto } from '@/apis/configuration'
import { create } from '@/store'

interface ConfigurationStore {
  configuration: ConfigurationDto | null
  setConfiguration: (configuration: ConfigurationDto | null) => void
  nextSplashMessageId: number | null
  setNextSplashMessageId: (nextSplashMessageId: number | null) => void
  hasOptionalUpdate: boolean
  setHasOptionalUpdate: (hasOptionalUpdate: boolean) => void
  hasPremiumFeature: boolean
}

const useConfigurationStore = create<ConfigurationStore>()(
  persist(
    (set, get) => ({
      configuration: null,
      setConfiguration: configuration => {
        set({ configuration })
      },
      nextSplashMessageId: null,
      setNextSplashMessageId: nextSplashMessageId => {
        set({ nextSplashMessageId })
      },
      hasOptionalUpdate: false,
      setHasOptionalUpdate: hasOptionalUpdate => {
        set({ hasOptionalUpdate })
      },
      hasPremiumFeature: get()?.configuration?.user?.tire === 'Premium',
    }),
    { name: 'CONFIGURATIONS', storage: createJSONStorage(() => AsyncStorage) },
  ),
)

export default useConfigurationStore

import { ConfigurationDto } from '@/apis/configuration'
import { create } from '@/store'

interface ConfigurationStore {
  configuration: ConfigurationDto | null
  setConfiguration: (configuration: ConfigurationDto | null) => void
}

const useConfigurationStore = create<ConfigurationStore>()(set => ({
  configuration: null,
  setConfiguration: configuration => {
    set({ configuration })
  },
}))

export default useConfigurationStore

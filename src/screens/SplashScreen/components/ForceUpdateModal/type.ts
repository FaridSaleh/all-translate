import { ConfigurationDto } from '@/apis/configuration'

export interface ForceUpdateModalProps {
  isForceUpdateOpen: boolean
  setIsForceUpdateOpen: (value: boolean) => void
  configuration?: ConfigurationDto | null
}

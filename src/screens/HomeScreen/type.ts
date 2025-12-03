import { ConfigurationDto } from '@/apis/configuration'

export type TabBarIconProps = React.ComponentType<{
  width: number
  height: number
  color?: string
}>

export type TabBarIconComponentProps = {
  color: string
  width: number
  height: number
}

export type LanguageType = ConfigurationDto['supportedLanguages'][0]

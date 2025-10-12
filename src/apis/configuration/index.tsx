import { useMutation } from '@tanstack/react-query'
import { UserTier } from '../common'
import { getRequest } from '@/utils/api'

export const GET_CONFIGURATION_URL = '/api/Configuration'

export interface ConfigurationDto {
  forceUpdate: boolean
  optionalUpdate: boolean
  reviews: boolean
  baseUrl: string
  forceUpdateTitle: string
  forceUpdateDescription: string
  forceUpdateLink: string
  forcePositiveTitle: string
  forceNegativeTitle: string
  optionalUpdateTitle: string
  optionalUpdateDescription: string
  optionalUpdateLink: string
  optionalPositiveTitle: string
  optionalNegativeTitle: string
  user: {
    id: string
    tire: UserTier
  }
  splashMessages: Array<{
    id: number
    message: string
  }>
}

export const getConfiguration = async () =>
  (
    await getRequest<ConfigurationDto>({
      config: {
        baseURL: 'https://coretranslate.com',
      },
      url: GET_CONFIGURATION_URL,
    })
  ).data

export function useConfiguration() {
  return useMutation({
    mutationFn: getConfiguration,
  })
}

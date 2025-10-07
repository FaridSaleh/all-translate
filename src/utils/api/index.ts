import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import useConfigurationStore from '@/store/configuration'
import { redirectToSplash, getCurrentRouteName } from '@/screens/helper'
import { Alert } from 'react-native'
import { buildUserAgent } from '@/utils/appInfo'
import { getTokenSecure } from '@/store/auth'
import { POST_GET_TOKEN_URL } from '@/apis/auth/getToken'
import { GET_CONFIGURATION_URL } from '@/apis/configuration'

export const api = axios.create({
  timeout: 15000,
})

api.interceptors.request.use(
  async config => {
    const token = await getTokenSecure()

    config.headers = config.headers ?? {}
    ;(config.headers as any)['X-User-Agent'] = buildUserAgent()
    if (token) {
      ;(config.headers as any).Authorization = `Bearer ${token.token}`
    }
    if (config.url && config.url !== POST_GET_TOKEN_URL && config.url !== GET_CONFIGURATION_URL) {
      config.baseURL = useConfigurationStore.getState().configuration?.baseUrl ?? config.baseURL
    }

    return config
  },
  (error: AxiosError) => Promise.reject(error),
)

api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const status = error.response?.status
    if (status === 401) {
      const currentRouteName = getCurrentRouteName()
      if (currentRouteName === 'Splash') {
        Alert.alert('Authentication error. Please try again.')
        return Promise.reject(error)
      }
      redirectToSplash()
    }
    return Promise.reject(error)
  },
)

export interface RequestProps {
  url: string
  payload?: any
  config?: AxiosRequestConfig
}

export const getRequest = async <T>({ url, config }: RequestProps) => {
  return api.get<T>(url, config)
}

export const postRequest = async <T>({ url, config, payload }: RequestProps) => {
  return api.post<T>(url, payload, config)
}

export const putRequest = async <T>({ url, config, payload }: RequestProps) => {
  return api.put<T>(url, payload, config)
}

export const patchRequest = async <T>({ url, config, payload }: RequestProps) => {
  return api.patch<T>(url, payload, config)
}

export const deleteRequest = async <T>({ url, config }: RequestProps) => {
  return api.delete<T>(url, config)
}

export default api

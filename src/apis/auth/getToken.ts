import { postRequest } from '@/utils/api'
import { useMutation } from '@tanstack/react-query'
import { UserTier } from '../common'

export const POST_GET_TOKEN_URL = '/api/Auth/getToken'

export interface GetTokenDto {
  expiresAt: string
  tier: UserTier
  token: string
  userId: string
}

export const postGetTokenRequest = async ({ userId }: { userId: string }) =>
  (
    await postRequest<GetTokenDto>({
      config: {
        baseURL: 'https://auth.coretranslate.com',
      },
      url: POST_GET_TOKEN_URL,
      payload: { userId },
    })
  ).data

export function useGetTokenRequest() {
  return useMutation({
    mutationFn: postGetTokenRequest,
  })
}

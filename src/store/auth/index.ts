import { GetTokenDto } from '@/apis/auth/getToken'
import EncryptedStorage from 'react-native-encrypted-storage'

const TOKEN_KEY = 'auth_token'

export async function setTokenSecure(token: GetTokenDto) {
  await EncryptedStorage.setItem(TOKEN_KEY, JSON.stringify(token))
}

export async function getTokenSecure(): Promise<GetTokenDto | null> {
  return JSON.parse((await EncryptedStorage.getItem(TOKEN_KEY)) ?? '{}')
}

export async function clearTokenSecure() {
  await EncryptedStorage.removeItem(TOKEN_KEY)
}

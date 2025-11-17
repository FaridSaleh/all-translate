import { useMutation } from '@tanstack/react-query'
import { postRequest } from '@/utils/api'

export const POST_TEXT_TO_SPEECH_URL = '/api/Translate/text-to-speech'

export interface PostTextToSpeechProps {
  translatedText: string
  targetLang: string
}

export interface PostTextToSpeechDto {
  audioUrl: string
}

export const postTextToSpeechRequest = async ({
  translatedText,
  targetLang,
}: PostTextToSpeechProps) => {
  const response = await postRequest<ArrayBuffer>({
    url: POST_TEXT_TO_SPEECH_URL,
    payload: { translatedText, targetLang },
    config: {
      responseType: 'arraybuffer',
    },
  })
  return response.data
}

export function useTextToSpeechRequest() {
  return useMutation({
    mutationFn: postTextToSpeechRequest,
  })
}

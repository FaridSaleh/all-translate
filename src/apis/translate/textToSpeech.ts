import { useMutation } from '@tanstack/react-query'
import { postRequest } from '@/utils/api'
import { textToSpeechCache } from '@/utils/textToSpeechCache'

export const POST_TEXT_TO_SPEECH_URL = '/api/Translate/text-to-speech'

export interface PostTextToSpeechProps {
  translatedText: string
  targetLang: string
}

export interface PostTextToSpeechDto {
  audioUrl: string
}

export const postTextToSpeechRequest = async (props: PostTextToSpeechProps) => {
  const cachedAudio = textToSpeechCache.get(props)

  if (cachedAudio) {
    return cachedAudio
  }

  const data = (
    await postRequest<ArrayBuffer>({
      url: POST_TEXT_TO_SPEECH_URL,
      payload: props,
      config: {
        responseType: 'arraybuffer',
      },
    })
  ).data

  textToSpeechCache.set(props, data)

  return data
}

export function useTextToSpeechRequest() {
  return useMutation({
    mutationFn: postTextToSpeechRequest,
  })
}

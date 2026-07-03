import { useMutation } from '@tanstack/react-query'
import { postRequest } from '@/utils/api'
import {
  conversationTextToSpeechCache,
  TextToSpeechCache,
  textToSpeechCache,
} from '@/utils/textToSpeechCache'

export const POST_TEXT_TO_SPEECH_URL = '/api/Translate/text-to-speech'

export interface PostTextToSpeechProps {
  translatedText: string
  targetLang: string
}

export interface PostTextToSpeechDto {
  audioUrl: string
}

const createPostTextToSpeechRequest = (cache: TextToSpeechCache) => {
  return async (props: PostTextToSpeechProps) => {
    const cachedAudio = cache.get(props)

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

    cache.set(props, data)

    return data
  }
}

export const postTextToSpeechRequest = createPostTextToSpeechRequest(textToSpeechCache)
export const postConversationTextToSpeechRequest = createPostTextToSpeechRequest(
  conversationTextToSpeechCache,
)

export function useTextToSpeechRequest() {
  return useMutation({
    mutationFn: postTextToSpeechRequest,
  })
}

export function useConversationTextToSpeechRequest() {
  return useMutation({
    mutationFn: postConversationTextToSpeechRequest,
  })
}

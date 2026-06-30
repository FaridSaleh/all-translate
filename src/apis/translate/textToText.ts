import { useMutation } from '@tanstack/react-query'
import { postRequest } from '@/utils/api'
import { translationCache } from '@/utils/translationCache'

export const POST_TEXT_TO_TEXT_URL = '/api/Translate/text-to-text'

export interface PostTextToTextProps {
  transcribedText: string
  sourceLang: string
  targetLang: string
}

export interface PostTextToTextDto {
  transcribedText: string
  sourceLang: string
  targetLang: string
  translatedText: string
}

export const postTextToTextRequest = async (props: PostTextToTextProps) => {
  const cachedTranslation = translationCache.get(props)

  if (cachedTranslation) {
    return {
      ...props,
      translatedText: cachedTranslation,
    }
  }

  const data = (
    await postRequest<PostTextToTextDto>({
      url: POST_TEXT_TO_TEXT_URL,
      payload: props,
    })
  ).data

  translationCache.set({
    sourceText: data.transcribedText,
    sourceLang: data.sourceLang,
    targetLang: data.targetLang,
    translatedText: data.translatedText,
  })

  return data
}

export function useTextToTextRequest() {
  return useMutation({
    mutationFn: postTextToTextRequest,
  })
}

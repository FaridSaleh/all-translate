import { useMutation } from '@tanstack/react-query'
import { postRequest } from '@/utils/api'

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

export const postTextToTextRequest = async ({
  transcribedText,
  sourceLang,
  targetLang,
}: PostTextToTextProps) =>
  (
    await postRequest<PostTextToTextDto>({
      url: POST_TEXT_TO_TEXT_URL,
      payload: { transcribedText, sourceLang, targetLang },
    })
  ).data

export function useTextToTextRequest() {
  return useMutation({
    mutationFn: postTextToTextRequest,
  })
}

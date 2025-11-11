import { useMutation } from '@tanstack/react-query'
import { postRequest } from '@/utils/api'

export const POST_SPEECH_TO_TEXT_URL = (targetLang: string, sourceLang?: string) =>
  `/api/Translate/speech-to-text?lang2=${targetLang}${sourceLang ? `&lang1=${sourceLang}` : ''}`

export interface PostSpeechToTextProps {
  sourceLang?: string
  targetLang: string
  file: FormData
}

export interface PostSpeechToTextDto {
  transcribedText: string
  translatedText: string
  lang1: string
  lang2: string
}

export const postSpeechToTextRequest = async ({
  sourceLang,
  targetLang,
  file,
}: PostSpeechToTextProps) =>
  (
    await postRequest<PostSpeechToTextDto>({
      url: POST_SPEECH_TO_TEXT_URL(targetLang, sourceLang),
      payload: file,
    })
  ).data

export function useSpeechToTextRequest() {
  return useMutation({
    mutationFn: postSpeechToTextRequest,
  })
}

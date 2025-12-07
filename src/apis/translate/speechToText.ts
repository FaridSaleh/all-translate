import { useMutation } from '@tanstack/react-query'
import { postRequest } from '@/utils/api'

export const POST_SPEECH_TO_TEXT_URL = '/api/Translate/speech-to-text'

export interface PostSpeechToTextProps {
  file: FormData
  targetLang: string
  sourceLang?: string
  autoDetect?: boolean
}

export interface PostSpeechToTextDto {
  transcribedText: string
  translatedText: string
  sourceLang: string
  targetLang: string
}

export const postSpeechToTextRequest = async ({
  file,
  targetLang,
  sourceLang,
  autoDetect,
}: PostSpeechToTextProps) => {
  file.append('targetLang', targetLang)
  if (sourceLang) {
    file.append('sourceLang', sourceLang)
  }
  if (autoDetect) {
    file.append('autoDetect', 'true')
  }

  return (
    await postRequest<PostSpeechToTextDto>({
      url: POST_SPEECH_TO_TEXT_URL,
      payload: file,
    })
  ).data
}

export function useSpeechToTextRequest() {
  return useMutation({
    mutationFn: postSpeechToTextRequest,
  })
}

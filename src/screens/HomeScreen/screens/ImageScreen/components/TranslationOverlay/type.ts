import { PostImageToTextDto } from '@/apis/translate/imageToText'

export default interface TranslationOverlayProps {
  result: PostImageToTextDto
  scale: number
}

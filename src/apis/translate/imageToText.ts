import { useMutation } from '@tanstack/react-query'
import { OcrRecognitionResult } from '@/types/imageOcr'
import { postRequest } from '@/utils/api'

export const POST_IMAGE_TO_TEXT_URL = '/api/Translate/image-to-text'

export interface ImageTranslateBox {
  x: number
  y: number
  width: number
  height: number
}

export interface ImageTranslateBlockRequest {
  sourceText: string
  box: ImageTranslateBox
  rotation: number
}

export interface PostImageToTextProps {
  sourceLang: string
  targetLang: string
  imageWidth: number
  imageHeight: number
  blocks: ImageTranslateBlockRequest[]
}

export interface ImageTranslateBlockResponse {
  sourceText: string
  translatedText: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  suggestedFontSize: number
  box?: ImageTranslateBox
}

export interface ImageTranslateBlockLayout {
  x: number
  y: number
  width: number
  height: number
  rotation: number
  translatedText: string
  suggestedFontSize: number
}

export const getImageTranslateBlockLayout = (
  block: ImageTranslateBlockResponse,
): ImageTranslateBlockLayout => ({
  x: block.box?.x ?? block.x,
  y: block.box?.y ?? block.y,
  width: block.box?.width ?? block.width,
  height: block.box?.height ?? block.height,
  rotation: block.rotation,
  translatedText: block.translatedText,
  suggestedFontSize: block.suggestedFontSize,
})

export interface PostImageToTextDto {
  imageWidth: number
  imageHeight: number
  sourceLang: string
  targetLang: string
  blocks: ImageTranslateBlockResponse[]
}

export const mapSourceLangForImageTranslate = (sourceLanguageId: string): string =>
  sourceLanguageId === 'detect' ? 'auto' : sourceLanguageId

export const mapOcrToImageTranslateRequest = (
  ocrResult: OcrRecognitionResult,
  sourceLanguageId: string,
  targetLanguageId: string,
): PostImageToTextProps => ({
  sourceLang: mapSourceLangForImageTranslate(sourceLanguageId),
  targetLang: targetLanguageId,
  imageWidth: ocrResult.imageWidth,
  imageHeight: ocrResult.imageHeight,
  blocks: ocrResult.blocks.map(block => ({
    sourceText: block.sourceText,
    box: {
      x: block.boundingBox.x,
      y: block.boundingBox.y,
      width: block.boundingBox.width,
      height: block.boundingBox.height,
    },
    rotation: Math.round(block.rotation),
  })),
})

const normalizeImageTranslateBlock = (
  block: ImageTranslateBlockResponse,
): ImageTranslateBlockResponse => {
  const layout = getImageTranslateBlockLayout(block)

  return {
    ...block,
    x: layout.x,
    y: layout.y,
    width: layout.width,
    height: layout.height,
  }
}

export const postImageToTextRequest = async (props: PostImageToTextProps) => {
  const data = (
    await postRequest<PostImageToTextDto>({
      url: POST_IMAGE_TO_TEXT_URL,
      payload: props,
    })
  ).data

  return {
    ...data,
    blocks: data.blocks.map(normalizeImageTranslateBlock),
  }
}

export function useImageToTextRequest() {
  return useMutation({
    mutationFn: postImageToTextRequest,
  })
}

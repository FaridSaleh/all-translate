import { useCallback } from 'react'
import { Image } from 'react-native'
import TextRecognition from '@react-native-ml-kit/text-recognition'
import { OcrRecognitionResult } from '@/types/imageOcr'
import getTextRecognitionScript from '@/utils/getTextRecognitionScript'
import mapOcrTextBlock from '@/utils/mapOcrTextBlock'
import normalizeImageUri from '@/utils/normalizeImageUri'
import UseImageOcrDto from './type'

const getImageSize = (uri: string): Promise<{ width: number; height: number }> =>
  new Promise((resolve, reject) => {
    Image.getSize(uri, (width, height) => resolve({ width, height }), reject)
  })

const useImageOcr = (): UseImageOcrDto => {
  const recognizeTextInImage = useCallback(
    async (imageUri: string, sourceLanguageId: string): Promise<OcrRecognitionResult | null> => {
      const script = getTextRecognitionScript(sourceLanguageId)
      const normalizedUri = normalizeImageUri(imageUri)

      let imageWidth = 0
      let imageHeight = 0

      try {
        const size = await getImageSize(normalizedUri)
        imageWidth = size.width
        imageHeight = size.height
      } catch (error) {
        console.error('[OCR] Failed to read image dimensions:', error)
      }

      try {
        const result = await TextRecognition.recognize(normalizedUri, script)
        const blocks = result.blocks.map(block => mapOcrTextBlock(block, imageWidth, imageHeight))
        const hasDiscoveredText = Boolean(result.text.trim()) && blocks.length > 0

        if (!hasDiscoveredText) {
          console.log('[OCR] No text discovered in image', {
            sourceLanguageId,
            script,
            imageUri: normalizedUri,
            imageWidth,
            imageHeight,
          })
          return null
        }

        const ocrResult: OcrRecognitionResult = {
          text: result.text,
          sourceLanguageId,
          script,
          imageWidth,
          imageHeight,
          blocks,
        }

        console.log('[OCR] Discovered text in image:', ocrResult)

        return ocrResult
      } catch (error) {
        console.error('[OCR] Text recognition failed:', error)
        return null
      }
    },
    [],
  )

  return {
    recognizeTextInImage,
  }
}

export default useImageOcr

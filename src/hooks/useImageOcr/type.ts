import { OcrRecognitionResult } from '@/types/imageOcr'

export default interface UseImageOcrDto {
  recognizeTextInImage: (
    imageUri: string,
    sourceLanguageId: string,
  ) => Promise<OcrRecognitionResult | null>
}

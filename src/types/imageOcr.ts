export interface OcrBoundingBox {
  x: number
  y: number
  width: number
  height: number
}

export interface OcrPoint {
  x: number
  y: number
}

export interface OcrTextBlock {
  text: string
  sourceText: string
  boundingBox: OcrBoundingBox
  cornerPoints: OcrPoint[]
  rotation: number
  imageWidth: number
  imageHeight: number
}

export interface OcrRecognitionResult {
  text: string
  sourceLanguageId: string
  script: string
  imageWidth: number
  imageHeight: number
  blocks: OcrTextBlock[]
}

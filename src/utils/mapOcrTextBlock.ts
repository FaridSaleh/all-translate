import { Frame, Point, TextBlock } from '@react-native-ml-kit/text-recognition'
import { OcrPoint, OcrTextBlock } from '@/types/imageOcr'

const getRotationFromCornerPoints = (cornerPoints: OcrPoint[]): number => {
  if (cornerPoints.length < 2) {
    return 0
  }

  const [start, end] = cornerPoints
  return (Math.atan2(end.y - start.y, end.x - start.x) * 180) / Math.PI
}

const mapCornerPoints = (cornerPoints?: readonly [Point, Point, Point, Point]): OcrPoint[] => {
  if (!cornerPoints) {
    return []
  }

  return cornerPoints.map(point => ({ x: point.x, y: point.y }))
}

const mapBoundingBox = (frame?: Frame) => {
  if (!frame) {
    return { x: 0, y: 0, width: 0, height: 0 }
  }

  return {
    x: frame.left,
    y: frame.top,
    width: frame.width,
    height: frame.height,
  }
}

const mapOcrTextBlock = (
  block: TextBlock,
  imageWidth: number,
  imageHeight: number,
): OcrTextBlock => {
  const cornerPoints = mapCornerPoints(block.cornerPoints)

  return {
    text: block.text,
    sourceText: block.text,
    boundingBox: mapBoundingBox(block.frame),
    cornerPoints,
    rotation: getRotationFromCornerPoints(cornerPoints),
    imageWidth,
    imageHeight,
  }
}

export default mapOcrTextBlock

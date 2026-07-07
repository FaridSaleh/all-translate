export interface ScaledImageLayout {
  scale: number
  displayWidth: number
  displayHeight: number
}

export const getScaledImageLayout = (
  viewWidth: number,
  viewHeight: number,
  imageWidth: number,
  imageHeight: number,
): ScaledImageLayout => {
  if (viewWidth <= 0 || viewHeight <= 0 || imageWidth <= 0 || imageHeight <= 0) {
    return { scale: 1, displayWidth: viewWidth, displayHeight: viewHeight }
  }

  const scale = Math.min(viewWidth / imageWidth, viewHeight / imageHeight)

  return {
    scale,
    displayWidth: imageWidth * scale,
    displayHeight: imageHeight * scale,
  }
}

export const normalizeRotation = (rotation: number): number =>
  ((Math.round(rotation) % 360) + 360) % 360

export const isPerpendicularRotation = (rotation: number): boolean => {
  const normalized = normalizeRotation(rotation)
  return normalized === 90 || normalized === 270
}

export const getRotatedTextLayoutSize = (
  width: number,
  height: number,
  rotation: number,
): { layoutWidth: number; layoutHeight: number } => {
  if (isPerpendicularRotation(rotation)) {
    return { layoutWidth: height, layoutHeight: width }
  }

  return { layoutWidth: width, layoutHeight: height }
}

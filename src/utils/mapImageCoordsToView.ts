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

export const mapImageCoordToScaledView = (value: number, scale: number): number => value * scale

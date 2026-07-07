const CHAR_WIDTH_RATIO = 0.6
const MAX_LINES = 4

export interface FillBoxFontSizeParams {
  text: string
  boxWidth: number
  boxHeight: number
}

export interface FillBoxFontSizeResult {
  fontSize: number
  lineCount: number
  lineHeight: number
}

export const getFillBoxFontSize = ({
  text,
  boxWidth,
  boxHeight,
}: FillBoxFontSizeParams): FillBoxFontSizeResult => {
  const trimmed = text.trim()

  if (!trimmed || boxWidth <= 0 || boxHeight <= 0) {
    return { fontSize: 1, lineCount: 1, lineHeight: 1 }
  }

  const charCount = trimmed.length
  let best = { fontSize: 0, lineCount: 1 }

  for (let lines = 1; lines <= MAX_LINES; lines += 1) {
    const fontSizeByHeight = boxHeight / lines
    const charsPerLine = Math.max(Math.ceil(charCount / lines), 1)
    const fontSizeByWidth = boxWidth / (charsPerLine * CHAR_WIDTH_RATIO)
    const fontSize = Math.min(fontSizeByHeight, fontSizeByWidth)

    if (fontSize > best.fontSize) {
      best = { fontSize, lineCount: lines }
    }
  }

  const fontSize = Math.max(1, best.fontSize)
  const lineHeight = boxHeight / best.lineCount

  return {
    fontSize,
    lineCount: best.lineCount,
    lineHeight,
  }
}

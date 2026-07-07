import { StyleSheet, Text, View } from 'react-native'
import TranslationOverlayProps from './type'
import { getImageTranslateBlockLayout } from '@/apis/translate/imageToText'
import { getFillBoxFontSize } from '@/utils/estimateOverlayFontSize'
import { getRotatedTextLayoutSize } from '@/utils/mapImageCoordsToView'

const TranslationOverlay = ({ result, scale }: TranslationOverlayProps) => {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {result.blocks.map((block, index) => {
        const { x, y, width, height, rotation, translatedText } =
          getImageTranslateBlockLayout(block)
        const boxWidth = width * scale
        const boxHeight = height * scale
        const { layoutWidth, layoutHeight } = getRotatedTextLayoutSize(
          boxWidth,
          boxHeight,
          rotation,
        )
        const { fontSize, lineCount, lineHeight } = getFillBoxFontSize({
          text: translatedText,
          boxWidth: layoutWidth,
          boxHeight: layoutHeight,
        })
        const hasRotation = Math.abs(rotation) >= 1

        return (
          <View
            key={`${translatedText}-${index}`}
            style={[
              styles.block,
              {
                left: x * scale,
                top: y * scale,
                width: boxWidth,
                height: boxHeight,
              },
            ]}
          >
            <View style={styles.textContainer}>
              <View
                style={[
                  styles.rotatedTextWrapper,
                  {
                    width: layoutWidth,
                    height: layoutHeight,
                  },
                  hasRotation && { transform: [{ rotate: `${rotation}deg` }] },
                ]}
              >
                <Text
                  style={[
                    styles.text,
                    {
                      fontSize,
                      lineHeight,
                    },
                  ]}
                  numberOfLines={lineCount}
                  adjustsFontSizeToFit
                  minimumFontScale={0.5}
                >
                  {translatedText}
                </Text>
              </View>
            </View>
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  block: {
    position: 'absolute',
    overflow: 'visible',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  textContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rotatedTextWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    width: '100%',
    height: '100%',
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
})

export default TranslationOverlay

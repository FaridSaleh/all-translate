import { StyleSheet, Text, View } from 'react-native'
import TranslationOverlayProps from './type'
import { getImageTranslateBlockLayout } from '@/apis/translate/imageToText'
import { getRotatedTextLayoutSize } from '@/utils/mapImageCoordsToView'

const TranslationOverlay = ({ result, scale }: TranslationOverlayProps) => {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {result.blocks.map((block, index) => {
        const { x, y, width, height, rotation, translatedText, suggestedFontSize } =
          getImageTranslateBlockLayout(block)
        const boxWidth = width * scale
        const boxHeight = height * scale
        const { layoutWidth, layoutHeight } = getRotatedTextLayoutSize(
          boxWidth,
          boxHeight,
          rotation,
        )
        const fontSize = Math.max(10, suggestedFontSize * scale)
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
                  style={[styles.text, { fontSize }]}
                  adjustsFontSizeToFit
                  minimumFontScale={0.5}
                  numberOfLines={4}
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
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rotatedTextWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  text: {
    width: '100%',
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
})

export default TranslationOverlay

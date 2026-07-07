import { Platform, StyleSheet, Text, View } from 'react-native'
import { BlurView } from '@react-native-community/blur'
import TranslationOverlayProps from './type'
import { getImageTranslateBlockLayout } from '@/apis/translate/imageToText'
import { getFillBoxFontSize } from '@/utils/estimateOverlayFontSize'
import { getRotatedTextLayoutSize } from '@/utils/mapImageCoordsToView'

const BLUR_AMOUNT = 28
const BLUR_OVERLAY_COLOR = 'rgba(255, 255, 255, 0.78)'
const BLUR_SCRIM_COLOR =
  Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.62)' : 'rgba(255, 255, 255, 0.28)'
const BLUR_FALLBACK_COLOR = 'rgba(255, 255, 255, 0.88)'
const BLUR_TYPE = Platform.OS === 'ios' ? 'light' : 'light'
const BOX_BORDER_RADIUS = 8

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
            <View
              style={[
                styles.blurBackground,
                { borderRadius: Math.min(BOX_BORDER_RADIUS, boxWidth / 4, boxHeight / 4) },
              ]}
              pointerEvents="none"
            >
              <BlurView
                style={StyleSheet.absoluteFill}
                blurType={BLUR_TYPE}
                blurAmount={BLUR_AMOUNT}
                reducedTransparencyFallbackColor={BLUR_FALLBACK_COLOR}
                {...(Platform.OS === 'android'
                  ? { overlayColor: BLUR_OVERLAY_COLOR }
                  : {})}
              />
              <View style={styles.blurScrim} />
            </View>
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
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  blurScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BLUR_SCRIM_COLOR,
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
    color: '#000000',
    fontWeight: '500',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
})

export default TranslationOverlay

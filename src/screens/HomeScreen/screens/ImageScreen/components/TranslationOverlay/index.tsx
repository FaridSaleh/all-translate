import { StyleSheet, Text, View } from 'react-native'
import TranslationOverlayProps from './type'
import { getImageTranslateBlockLayout } from '@/apis/translate/imageToText'

const TranslationOverlay = ({ result, scale }: TranslationOverlayProps) => {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {result.blocks.map((block, index) => {
        const { x, y, width, height, rotation, translatedText, suggestedFontSize } =
          getImageTranslateBlockLayout(block)
        const fontSize = Math.max(10, suggestedFontSize * scale)

        return (
          <View
            key={`${translatedText}-${index}`}
            style={[
              styles.block,
              {
                left: x * scale,
                top: y * scale,
                width: width * scale,
                height: height * scale,
                transform: [{ rotate: `${rotation}deg` }],
              },
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
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  block: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
})

export default TranslationOverlay

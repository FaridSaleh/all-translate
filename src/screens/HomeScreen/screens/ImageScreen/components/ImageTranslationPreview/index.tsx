import { Image, StyleSheet, View } from 'react-native'
import TranslationOverlay from '../TranslationOverlay'
import { PostImageToTextDto } from '@/apis/translate/imageToText'
import { getScaledImageLayout } from '@/utils/mapImageCoordsToView'

interface ImageTranslationPreviewProps {
  imageUri: string
  result: PostImageToTextDto
  viewWidth: number
  viewHeight: number
}

const ImageTranslationPreview = ({
  imageUri,
  result,
  viewWidth,
  viewHeight,
}: ImageTranslationPreviewProps) => {
  const { displayWidth, displayHeight, scale } = getScaledImageLayout(
    viewWidth,
    viewHeight,
    result.imageWidth,
    result.imageHeight,
  )

  if (viewWidth <= 0 || viewHeight <= 0) {
    return null
  }

  return (
    <View style={styles.container}>
      <View style={{ width: displayWidth, height: displayHeight }}>
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="stretch" />
        <TranslationOverlay result={result} scale={scale} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
})

export default ImageTranslationPreview

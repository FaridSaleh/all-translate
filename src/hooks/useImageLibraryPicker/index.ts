import { useCallback, useState } from 'react'
import { Alert, InteractionManager, Platform } from 'react-native'
import { launchImageLibrary } from 'react-native-image-picker'
import UseImageLibraryPickerDto from './type'

const GALLERY_OPTIONS = {
  mediaType: 'photo' as const,
  selectionLimit: 1,
  quality: 1 as const,
  presentationStyle: 'fullScreen' as const,
}

const useImageLibraryPicker = (): UseImageLibraryPickerDto => {
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null)

  const openGallery = useCallback(async () => {
    await new Promise<void>(resolve => {
      InteractionManager.runAfterInteractions(() => {
        setTimeout(resolve, Platform.OS === 'ios' ? 300 : 0)
      })
    })

    try {
      const result = await launchImageLibrary(GALLERY_OPTIONS)

      if (result.didCancel) {
        return
      }

      if (result.errorCode) {
        console.error('Image picker error:', result.errorCode, result.errorMessage)
        Alert.alert('Could not open gallery', result.errorMessage ?? result.errorCode)
        return
      }

      const uri = result.assets?.[0]?.uri

      if (uri) {
        setSelectedImageUri(uri)
      }
    } catch (error) {
      console.error('Failed to open gallery:', error)
      Alert.alert(
        'Could not open gallery',
        'Try rebuilding the app after installing react-native-image-picker.',
      )
    }
  }, [])

  const clearSelectedImage = () => {
    setSelectedImageUri(null)
  }

  return {
    selectedImageUri,
    setSelectedImageUri,
    openGallery,
    clearSelectedImage,
  }
}

export default useImageLibraryPicker

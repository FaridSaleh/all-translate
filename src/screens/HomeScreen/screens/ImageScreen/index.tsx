import { useCallback, useEffect, useRef, useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { useCameraPermission } from 'react-native-vision-camera'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import useImageLibraryPicker from '../../../../hooks/useImageLibraryPicker'
import useImageOcr from '../../../../hooks/useImageOcr'
import LanguageBottomSheet from '../../components/LanguageBottomSheet'
import { HomeTabParamList, LanguageType } from '../../type'
import CameraAccessModal from './components/CameraAccessModal'
import CameraControls from './components/CameraControls'
import CameraPreview, { CameraPreviewRef } from './components/CameraPreview'
import ImageScreenHeader from './components/ImageScreenHeader'
import LanguageSelector from './components/LanguageSelector'

const ImageScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<BottomTabNavigationProp<HomeTabParamList>>()
  const isFocused = useIsFocused()
  const { hasPermission, requestPermission } = useCameraPermission()

  const [openLanguageModal, setOpenLanguageModal] = useState<'source' | 'target' | false>(false)
  const [sourceLanguage, setSourceLanguage] = useState<LanguageType>({
    id: 'en',
    name: 'English',
  })
  const [targetLanguage, setTargetLanguage] = useState<LanguageType>({ id: 'es', name: 'Spanish' })
  const [isCameraAccessOpen, setIsCameraAccessOpen] = useState(false)
  const [isFlashlightOn, setIsFlashlightOn] = useState(false)
  const [hasShownCameraPrompt, setHasShownCameraPrompt] = useState(false)
  const cameraPreviewRef = useRef<CameraPreviewRef>(null)
  const { selectedImageUri, setSelectedImageUri, openGallery } = useImageLibraryPicker()
  const { recognizeTextInImage } = useImageOcr()

  useFocusEffect(
    useCallback(() => {
      if (!hasPermission && !hasShownCameraPrompt) {
        setIsCameraAccessOpen(true)
        setHasShownCameraPrompt(true)
      }

      return () => {
        setIsFlashlightOn(false)
      }
    }, [hasPermission, hasShownCameraPrompt]),
  )

  const handleClose = () => {
    navigation.jumpTo('TranslationsTab')
  }

  const handleSwapLanguages = () => {
    setSourceLanguage(targetLanguage)
    setTargetLanguage(sourceLanguage)
  }

  const handleGalleryPress = () => {
    setIsCameraAccessOpen(false)
    openGallery()
  }

  const handleCapturePress = async () => {
    if (!hasPermission) {
      setIsCameraAccessOpen(true)
      return
    }

    const imageUri = await cameraPreviewRef.current?.takePhoto()

    if (imageUri) {
      setSelectedImageUri(imageUri)
    }
  }

  const handleAllowCamera = async () => {
    return requestPermission()
  }

  const handleDenyCamera = () => {
    setIsCameraAccessOpen(false)
  }

  const handleFlashlightPress = () => {
    if (!hasPermission) {
      return
    }

    setIsFlashlightOn(current => !current)
  }

  const isCameraActive = isFocused && hasPermission

  useEffect(() => {
    if (!selectedImageUri) {
      return
    }

    recognizeTextInImage(selectedImageUri, sourceLanguage.id)
  }, [selectedImageUri, sourceLanguage.id, recognizeTextInImage])

  return (
    <>
      <View className="flex-1 bg-bg-card">
        <ImageScreenHeader title={t('ImageScreen.title')} onClose={handleClose} />

        <View className="flex-1 bg-black overflow-hidden">
          {hasPermission && (
            <CameraPreview
              ref={cameraPreviewRef}
              isFlashlightOn={isFlashlightOn}
              isActive={isCameraActive}
            />
          )}

          {selectedImageUri && (
            <Image
              source={{ uri: selectedImageUri }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
            />
          )}

          <View pointerEvents="box-none" style={StyleSheet.absoluteFill} className="justify-between">
            <View className="pt-4 items-center px-5">
              <LanguageSelector
                sourceLanguage={sourceLanguage}
                targetLanguage={targetLanguage}
                onSourcePress={() => setOpenLanguageModal('source')}
                onTargetPress={() => setOpenLanguageModal('target')}
                onSwapPress={handleSwapLanguages}
              />
            </View>

            <CameraControls
              onGalleryPress={handleGalleryPress}
              onCapturePress={handleCapturePress}
              onFlashlightPress={handleFlashlightPress}
              isFlashlightOn={isFlashlightOn}
            />
          </View>
        </View>
      </View>

      <LanguageBottomSheet
        open={openLanguageModal}
        setOpen={setOpenLanguageModal}
        sourceLanguage={sourceLanguage}
        setSourceLanguage={setSourceLanguage}
        targetLanguage={targetLanguage}
        setTargetLanguage={setTargetLanguage}
      />

      <CameraAccessModal
        isOpen={isCameraAccessOpen}
        setIsOpen={setIsCameraAccessOpen}
        onAllow={handleAllowCamera}
        onDeny={handleDenyCamera}
      />
    </>
  )
}

export default ImageScreen

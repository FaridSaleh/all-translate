import { useCallback, useState } from 'react'
import { View } from 'react-native'
import { useCameraPermission } from 'react-native-vision-camera'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import LanguageBottomSheet from '../../components/LanguageBottomSheet'
import { HomeTabParamList, LanguageType } from '../../type'
import CameraAccessModal from './components/CameraAccessModal'
import CameraControls from './components/CameraControls'
import CameraPreview from './components/CameraPreview'
import ImageScreenHeader from './components/ImageScreenHeader'
import LanguageSelector from './components/LanguageSelector'
import PhotoLibraryAccessModal from './components/PhotoLibraryAccessModal'

const ImageScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<BottomTabNavigationProp<HomeTabParamList>>()
  const { hasPermission, requestPermission } = useCameraPermission()

  const [openLanguageModal, setOpenLanguageModal] = useState<'source' | 'target' | false>(false)
  const [sourceLanguage, setSourceLanguage] = useState<LanguageType>({
    id: 'en',
    name: 'English',
  })
  const [targetLanguage, setTargetLanguage] = useState<LanguageType>({ id: 'es', name: 'Spanish' })
  const [isCameraAccessOpen, setIsCameraAccessOpen] = useState(false)
  const [isPhotoLibraryAccessOpen, setIsPhotoLibraryAccessOpen] = useState(false)
  const [isFlashlightOn, setIsFlashlightOn] = useState(false)
  const [hasShownCameraPrompt, setHasShownCameraPrompt] = useState(false)
  const [isScreenFocused, setIsScreenFocused] = useState(false)

  useFocusEffect(
    useCallback(() => {
      setIsScreenFocused(true)

      if (!hasPermission && !hasShownCameraPrompt) {
        setIsCameraAccessOpen(true)
        setHasShownCameraPrompt(true)
      }

      return () => {
        setIsScreenFocused(false)
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
    setIsPhotoLibraryAccessOpen(true)
  }

  const handleCapturePress = () => {
    if (!hasPermission) {
      setIsCameraAccessOpen(true)
    }
  }

  const handleAllowCamera = async () => {
    await requestPermission()
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

  return (
    <>
      <View className="flex-1 bg-black">
        <View className="absolute inset-0">
          {hasPermission && (
            <CameraPreview
              isFlashlightOn={isFlashlightOn}
              isActive={isScreenFocused && hasPermission}
            />
          )}
        </View>

        <ImageScreenHeader title={t('ImageScreen.title')} onClose={handleClose} />

        <View className="absolute top-[108px] left-5 right-5 z-10 items-center">
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

      <PhotoLibraryAccessModal
        isOpen={isPhotoLibraryAccessOpen}
        setIsOpen={setIsPhotoLibraryAccessOpen}
        onSelectMore={() => {}}
        onKeepCurrent={() => {}}
      />
    </>
  )
}

export default ImageScreen

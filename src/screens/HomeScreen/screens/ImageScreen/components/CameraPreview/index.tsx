import { forwardRef, useImperativeHandle } from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import { launchCamera } from 'react-native-image-picker'
import {
  Camera,
  useCameraDevice,
  useCameraDevices,
  usePhotoOutput,
} from 'react-native-vision-camera'
import CameraPreviewProps, { CameraPreviewRef } from './type'
import normalizeImageUri from '@/utils/normalizeImageUri'

export type { CameraPreviewRef }

const AndroidCameraPreview = forwardRef<CameraPreviewRef, CameraPreviewProps>(
  (_props, ref) => {
    useImperativeHandle(ref, () => ({
      takePhoto: async () => {
        try {
          const result = await launchCamera({
            mediaType: 'photo',
            quality: 1,
            saveToPhotos: false,
            cameraType: 'back',
          })

          if (result.didCancel || result.errorCode) {
            if (result.errorCode) {
              console.error('Camera error:', result.errorCode, result.errorMessage)
            }
            return null
          }

          const uri = result.assets?.[0]?.uri

          if (!uri) {
            return null
          }

          return normalizeImageUri(uri)
        } catch (error) {
          console.error('Failed to capture photo:', error)
          return null
        }
      },
    }))

    // Vision Camera v5 PreviewView crashes on RN 0.81 Android (Fabric JSI prop mismatch).
    return <View className="flex-1 bg-black" style={StyleSheet.absoluteFill} />
  },
)

const IosCameraPreview = forwardRef<CameraPreviewRef, CameraPreviewProps>(
  ({ isFlashlightOn, isActive }, ref) => {
    const photoOutput = usePhotoOutput({ quality: 0.9 })
    const devices = useCameraDevices()
    const backDevice = useCameraDevice('back')
    const frontDevice = useCameraDevice('front')
    const device = backDevice ?? frontDevice ?? devices.at(0)

    useImperativeHandle(ref, () => ({
      takePhoto: async () => {
        try {
          const photoFile = await photoOutput.capturePhotoToFile(
            { flashMode: 'off', enableShutterSound: true },
            {},
          )

          if (!photoFile.filePath) {
            return null
          }

          return normalizeImageUri(photoFile.filePath)
        } catch (error) {
          console.error('Failed to capture photo:', error)
          return null
        }
      },
    }))

    if (!device) {
      return <View className="flex-1 bg-black" />
    }

    return (
      <View className="flex-1">
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isActive}
          outputs={[photoOutput]}
          torchMode={isFlashlightOn ? 'on' : 'off'}
          resizeMode="cover"
        />
      </View>
    )
  },
)

AndroidCameraPreview.displayName = 'AndroidCameraPreview'
IosCameraPreview.displayName = 'IosCameraPreview'

const CameraPreview = forwardRef<CameraPreviewRef, CameraPreviewProps>((props, ref) => {
  if (Platform.OS === 'android') {
    return <AndroidCameraPreview ref={ref} {...props} />
  }

  return <IosCameraPreview ref={ref} {...props} />
})

CameraPreview.displayName = 'CameraPreview'

export default CameraPreview

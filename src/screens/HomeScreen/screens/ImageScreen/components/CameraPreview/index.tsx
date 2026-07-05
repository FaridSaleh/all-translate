import { forwardRef, useImperativeHandle } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  Camera,
  useCameraDevice,
  useCameraDevices,
  usePhotoOutput,
} from 'react-native-vision-camera'
import CameraPreviewProps from './type'
import normalizeImageUri from '@/utils/normalizeImageUri'

export interface CameraPreviewRef {
  takePhoto: () => Promise<string | null>
}

const CameraPreview = forwardRef<CameraPreviewRef, CameraPreviewProps>(
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

CameraPreview.displayName = 'CameraPreview'

export default CameraPreview

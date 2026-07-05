import { StyleSheet } from 'react-native'
import { Camera, useCameraDevice } from 'react-native-vision-camera'
import CameraPreviewProps from './type'

const CameraPreview = ({ isFlashlightOn, isActive }: CameraPreviewProps) => {
  const backDevice = useCameraDevice('back')
  const frontDevice = useCameraDevice('front')
  const device = backDevice ?? frontDevice

  if (!device) {
    return null
  }

  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={isActive}
      torchMode={isFlashlightOn ? 'on' : 'off'}
    />
  )
}

export default CameraPreview

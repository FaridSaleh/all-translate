import { StyleSheet, View } from 'react-native'
import { Camera, useCameraDevice, useCameraDevices } from 'react-native-vision-camera'
import CameraPreviewProps from './type'

const CameraPreview = ({ isFlashlightOn, isActive }: CameraPreviewProps) => {
  const devices = useCameraDevices()
  const backDevice = useCameraDevice('back')
  const frontDevice = useCameraDevice('front')
  const device = backDevice ?? frontDevice ?? devices.at(0)

  if (!device) {
    return <View className="flex-1 bg-black" />
  }

  return (
    <View className="flex-1">
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        torchMode={isFlashlightOn ? 'on' : 'off'}
        resizeMode="cover"
      />
    </View>
  )
}

export default CameraPreview

import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import CameraControlsProps from './type'
import { FlashlightIcon, GalleryIcon } from '@/assets'
import { RipplePressable } from '@/components'

const CameraControls = ({
  onGalleryPress,
  onCapturePress,
  onFlashlightPress,
  isFlashlightOn,
}: CameraControlsProps) => {
  const insets = useSafeAreaInsets()

  return (
    <View
      style={{ paddingBottom: Math.max(insets.bottom, 24) }}
      className="absolute bottom-0 left-0 right-0 flex-row items-center justify-center px-8 pt-4"
    >
      <RipplePressable
        borderless
        className="w-[48px] h-[48px] rounded-full bg-white/90 items-center justify-center overflow-hidden"
        onPress={onGalleryPress}
      >
        <GalleryIcon width={50} height={50} />
      </RipplePressable>

      <View className="flex-1 items-center">
        <RipplePressable
          borderless
          className="w-[60px] h-[60px] rounded-full border-[4px] border-white items-center justify-center overflow-hidden"
          onPress={onCapturePress}
        >
          <View className="w-[50px] h-[50px] rounded-full bg-white" />
        </RipplePressable>
      </View>

      <RipplePressable
        borderless
        className={`w-[48px] h-[48px] rounded-full items-center justify-center overflow-hidden ${isFlashlightOn ? 'bg-primary-main' : 'bg-white/90'}`}
        onPress={onFlashlightPress}
      >
        <FlashlightIcon width={50} height={50} color={isFlashlightOn ? '#FFFFFF' : '#D1D5DB'} />
      </RipplePressable>
    </View>
  )
}

export default CameraControls

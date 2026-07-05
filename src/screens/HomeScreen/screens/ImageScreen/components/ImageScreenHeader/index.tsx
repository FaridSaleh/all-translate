import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ImageScreenHeaderProps from './type'
import { CloseIcon } from '@/assets'
import { RipplePressable } from '@/components'

const ImageScreenHeader = ({ title, onClose }: ImageScreenHeaderProps) => {
  const insets = useSafeAreaInsets()

  return (
    <View
      style={{ paddingTop: insets.top }}
      className="flex-row items-center justify-between px-4 pb-3 bg-bg-card"
    >
      <View className="w-[44px]" />

      <Text className="text-[17px] font-bold text-text-primary">{title}</Text>

      <RipplePressable
        borderless
        className="w-[44px] h-[44px] items-center justify-center overflow-hidden"
        onPress={onClose}
      >
        <CloseIcon width={15} height={15} color="#000" />
      </RipplePressable>
    </View>
  )
}

export default ImageScreenHeader

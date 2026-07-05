import { Text, View } from 'react-native'
import AccessPermissionModalProps from './type'
import { Modal, RipplePressable } from '@/components'

const AccessPermissionModal = ({
  isOpen,
  setIsOpen,
  title,
  description,
  primaryAction,
  secondaryAction,
}: AccessPermissionModalProps) => {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} contentClassName="max-w-[270px]">
      <View className="overflow-hidden rounded-2xl">
        <View className="items-center px-4 pt-5 pb-4">
          <Text className="text-[17px] font-semibold text-text-primary text-center leading-[22px]">
            {title}
          </Text>
          <Text className="text-[13px] font-normal text-text-primary text-center mt-2 leading-[18px]">
            {description}
          </Text>
        </View>

        <View className="h-px bg-border" />

        <RipplePressable
          className="h-[44px] justify-center items-center"
          onPress={primaryAction.onPress}
        >
          <Text className="text-[17px] font-normal text-text-link">{primaryAction.label}</Text>
        </RipplePressable>

        <View className="h-px bg-border" />

        <RipplePressable
          className="h-[44px] justify-center items-center"
          onPress={secondaryAction.onPress}
        >
          <Text className="text-[17px] font-normal text-text-link">{secondaryAction.label}</Text>
        </RipplePressable>
      </View>
    </Modal>
  )
}

export default AccessPermissionModal

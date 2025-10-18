import { Pressable, Text, View } from 'react-native'
import OptionalUpdateModalProps from './type'
import { RetryErrorIcon } from '@/assets'
import { Modal } from '@/components'
import useConfigurationStore from '@/store/configuration'

const OptionalUpdateModal = ({
  isOptionalUpdateOpen,
  setIsOptionalUpdateOpen,
}: OptionalUpdateModalProps) => {
  const { configuration } = useConfigurationStore()

  return (
    <Modal isOpen={isOptionalUpdateOpen} setIsOpen={setIsOptionalUpdateOpen}>
      <View className="items-center px-6 py-8">
        <RetryErrorIcon width={24} height={24} color="#1E4FDB" />
        <Text className="text-[14px] font-bold text-text-primary mb-12 mt-2">
          {configuration?.optionalUpdateTitle}
        </Text>
        <Text className="text-[14px] font-normal text-text-primary text-center mb-10">
          {configuration?.optionalUpdateDescription}
        </Text>
        <Pressable
          className="w-full h-12 justify-center bg-primary-light rounded-xl px-4 py-2 mb-4"
          onPress={() => {
            setIsOptionalUpdateOpen(false)
          }}
        >
          <Text className="text-[16px] font-semibold text-text-onPrimary text-center">
            {configuration?.optionalPositiveTitle}
          </Text>
        </Pressable>
        <Pressable
          className="w-full h-12 justify-center border border-primary-light rounded-xl px-4 py-2"
          onPress={() => {
            setIsOptionalUpdateOpen(false)
          }}
        >
          <Text className="text-[16px] font-semibold text-bg-buttonPrimary text-center">
            {configuration?.optionalNegativeTitle}
          </Text>
        </Pressable>
      </View>
    </Modal>
  )
}

export default OptionalUpdateModal

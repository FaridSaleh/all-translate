import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { ForceUpdateModalProps } from './type'
import { RetryErrorIcon } from '@/assets'
import { Modal } from '@/components'
import { useAppNavigation } from '@/screens/helper'
import useConfigurationStore from '@/store/configuration'

const ForceUpdateModal = ({ isForceUpdateOpen, setIsForceUpdateOpen }: ForceUpdateModalProps) => {
  const navigation = useAppNavigation()

  const { configuration } = useConfigurationStore()

  return (
    <Modal isOpen={isForceUpdateOpen} setIsOpen={setIsForceUpdateOpen}>
      <View className="items-center px-6 py-8">
        <RetryErrorIcon width={24} height={24} color="#F7931E" />
        <Text className="text-[14px] font-bold text-text-primary mb-12 mt-2">
          {configuration?.forceUpdateTitle}
        </Text>
        <Text className="text-[14px] font-normal text-text-primary text-center mb-10">
          {configuration?.forceUpdateDescription}
        </Text>
        <Pressable
          className="w-full h-12 justify-center bg-primary-light rounded-xl px-4 py-2"
          onPress={() => {
            setIsForceUpdateOpen(false)
            navigation.replace('Home')
            // Linking.openURL(configuration?.forceUpdateLink ?? '')
          }}
        >
          <Text className="text-[16px] font-semibold text-text-onPrimary text-center">
            {configuration?.forcePositiveTitle}
          </Text>
        </Pressable>
      </View>
    </Modal>
  )
}

export default ForceUpdateModal

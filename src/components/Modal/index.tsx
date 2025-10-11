import React from 'react'
import { Modal as RNModal, View } from 'react-native'
import ModalProps from './type'

const Modal = ({ children, isOpen, setIsOpen }: ModalProps) => {
  return (
    <RNModal
      animationType="fade"
      transparent={true}
      visible={isOpen}
      onRequestClose={() => setIsOpen(false)}
    >
      <View className="flex-1 bg-[#1B1F26B8] justify-center items-center p-4">
        <View className="bg-bg-card rounded-2xl shadow-lg w-full">{children}</View>
      </View>
    </RNModal>
  )
}

export default Modal

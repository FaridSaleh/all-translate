import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { CheckIcon, FaceToFaceIcon, SideBySideIcon } from '@/assets'

const ConversationView = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <View className="relative">
      <Pressable onPress={() => setIsOpen(prev => !prev)}>
        <Text className="text-primary-main text-[14px] font-semibold">
          {t('ConversationScreen.view.title')}
        </Text>
      </Pressable>

      {isOpen && (
        <View className="absolute top-8 left-0 w-[221px] bg-bg-card rounded-[16px] shadow-md z-10 p-[16px]">
          <View>
            <Pressable
              className="flex-row items-center justify-between"
              onPress={() => setIsOpen(false)}
            >
              <View className="flex-row items-center">
                <View className="opacity-100">
                  <CheckIcon width={25} height={25} color="#2563EB" />
                </View>
                <Text className="text-[14px] font-medium text-text-primary">
                  {t('ConversationScreen.view.side_by_side')}
                </Text>
              </View>
              <View className="flex-1 items-center justify-center">
                <SideBySideIcon width={23} height={13} />
              </View>
            </Pressable>

            <View className="h-[1px] bg-bg-buttonDisabled my-[9px]" />

            <Pressable
              className="flex-row items-center justify-between"
              onPress={() => {
                setIsOpen(false)
                // setConversationView('faceToFace')
              }}
            >
              <View className="flex-row items-center">
                <View className="opacity-0">
                  <CheckIcon width={25} height={25} color="#2563EB" />
                </View>
                <Text className="text-[14px] font-medium text-text-primary">
                  {t('ConversationScreen.view.face_to_face')}
                </Text>
              </View>
              <View className="flex-1 items-center justify-center">
                <FaceToFaceIcon width={14} height={23} />
              </View>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  )
}

export default ConversationView

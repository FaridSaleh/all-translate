import { Pressable, Text, View } from 'react-native'
import { Trans, useTranslation } from 'react-i18next'
import ConversationBottomSheetProps from './type'
import { ArrowRightIcon, LockIcon } from '@/assets'
import { BottomSheet } from '@/components'

const ConversationBottomSheet = ({ open, setOpen }: ConversationBottomSheetProps) => {
  const { t } = useTranslation()

  return (
    <BottomSheet isOpen={open} setIsOpen={setOpen}>
      <View className="px-[34px] py-[16px] gap-[24px]">
        <View className="items-center">
          <LockIcon width={24} height={24} color="#1E4FDB" />
          <Text className="text-[14px] font-bold mt-[14px] w-[100px] text-center">
            {t('ConversationScreen.conversation_not_available.title')}
          </Text>
        </View>
        <View className="px-[24px] py-[16px]">
          <Text className="text-[14px] font-regular">
            <Trans
              i18nKey="ConversationScreen.conversation_not_available.description_1"
              components={{ bold: <Text className="font-medium" /> }}
            />
          </Text>
          <Text className="text-[14px] font-regular">
            <Trans
              i18nKey="ConversationScreen.conversation_not_available.description_2"
              components={{
                bold: <Text className="text-primary-main" />,
              }}
            />
          </Text>
        </View>
        <Pressable
          className="w-full h-[56px] flex-row items-center justify-center gap-[6px] bg-primary-light rounded-xl px-[16px] py-[8px]"
          onPress={() => {
            setOpen(false)
          }}
        >
          <Text className="text-[16px] font-semibold text-text-onPrimary text-center">
            3-day trial, then $4.99/week
          </Text>
          <ArrowRightIcon width={14.5} height={12} color="#FFFFFF" />
        </Pressable>
        <Pressable
          className="w-full h-[56px] justify-center border border-primary-light rounded-xl px-[16px] py-[8px]"
          onPress={() => {
            setOpen(false)
          }}
        >
          <Text className="text-[16px] font-semibold text-bg-buttonPrimary text-center">
            Watch an ad for 5-minute access
          </Text>
        </Pressable>
      </View>
    </BottomSheet>
  )
}

export default ConversationBottomSheet

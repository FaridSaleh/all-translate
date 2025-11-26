import { Pressable, Text, View } from 'react-native'
import { Trans, useTranslation } from 'react-i18next'
import SpeechToTextBottomSheetProps from './type'
import { ArrowRightIcon, LockIcon } from '@/assets'
import { BottomSheet } from '@/components'

const SpeechToTextBottomSheet = ({ open, setOpen, languageName }: SpeechToTextBottomSheetProps) => {
  const { t } = useTranslation()

  return (
    <BottomSheet isOpen={open} setIsOpen={setOpen}>
      <View className="px-[34px] py-[16px] gap-[24px]">
        <View className="items-center">
          <LockIcon width={24} height={24} color="#1E4FDB" />
          <Text className="text-[14px] font-bold mt-[14px] w-[130px] text-center">
            {t('TranslationsScreen.speech_to_text_not_available.title')}
          </Text>
        </View>
        <View className="px-[24px] py-[16px]">
          <Text className="text-[14px] font-regular">
            <Trans
              i18nKey="TranslationsScreen.speech_to_text_not_available.description_1"
              components={{ bold: <Text className="font-semibold" /> }}
            />
          </Text>
          <Text className="text-[14px] font-regular">
            <Trans
              i18nKey="TranslationsScreen.speech_to_text_not_available.description_2"
              values={{ language: languageName }}
              components={{
                bold: <Text className="font-semibold text-primary-main" />,
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
            {t('Common.cancel')}
          </Text>
        </Pressable>
      </View>
    </BottomSheet>
  )
}

export default SpeechToTextBottomSheet

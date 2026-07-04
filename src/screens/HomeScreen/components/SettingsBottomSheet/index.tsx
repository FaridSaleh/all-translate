import { ScrollView, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import SettingsBottomSheetProps from './type'
import { CloseIcon } from '@/assets'
import { BottomSheet, RipplePressable } from '@/components'

const ItemSeparator = () => <View className="h-[1px] w-full bg-[#EDEDED]" />

type SettingsMenuItem = {
  label: string
  onPress: () => void
  textClassName?: string
}

const SettingsBottomSheet = ({ open, setOpen }: SettingsBottomSheetProps) => {
  const { t } = useTranslation()

  const menuSections: Array<{ title: string; items: SettingsMenuItem[] }> = [
    {
      title: t('SettingsBottomSheet.account'),
      items: [
        {
          label: t('SettingsBottomSheet.all_translate_pro'),
          textClassName: 'text-text-link',
          onPress: () => {},
        },
      ],
    },
    {
      title: t('SettingsBottomSheet.support'),
      items: [
        {
          label: t('SettingsBottomSheet.contact_us'),
          onPress: () => {},
        },
        {
          label: t('SettingsBottomSheet.whats_new'),
          onPress: () => {},
        },
      ],
    },
    {
      title: t('SettingsBottomSheet.legal'),
      items: [
        {
          label: t('SettingsBottomSheet.privacy_policy'),
          onPress: () => {},
        },
        {
          label: t('SettingsBottomSheet.terms_of_services'),
          onPress: () => {},
        },
      ],
    },
    {
      title: t('SettingsBottomSheet.our_apps'),
      items: [
        {
          label: t('SettingsBottomSheet.share_all_translate'),
          onPress: () => {},
        },
        {
          label: t('SettingsBottomSheet.our_website'),
          onPress: () => {},
        },
        {
          label: t('SettingsBottomSheet.our_apps_menu'),
          onPress: () => {},
        },
      ],
    },
  ]

  return (
    <BottomSheet isOpen={open} setIsOpen={setOpen} height="90%">
      <View className="px-6 pt-2 pb-4 flex-1">
        <View className="w-full flex-row items-center justify-between mb-6">
          <View className="w-[32px]" />
          <Text className="text-[16px] font-bold text-text-primary">
            {t('SettingsBottomSheet.title')}
          </Text>
          <RipplePressable
            borderless
            className="w-[32px] h-[32px] rounded-full bg-[#EEEEEF] items-center justify-center overflow-hidden"
            onPress={() => setOpen(false)}
          >
            <CloseIcon width={15} height={15} color="#000" />
          </RipplePressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {menuSections.map(section => (
            <View key={section.title} className="mb-4">
              <Text className="text-[14px] font-bold text-text-secondary mb-2 ml-2">
                {section.title}
              </Text>
              <View className="bg-bg-elevated rounded-2xl px-6 py-2">
                {section.items.map((item, index) => (
                  <View key={item.label}>
                    <RipplePressable className="h-[48px] justify-center" onPress={item.onPress}>
                      <Text
                        className={`text-[14px] font-semibold ${item.textClassName ?? 'text-text-primary'}`}
                      >
                        {item.label}
                      </Text>
                    </RipplePressable>
                    {index < section.items.length - 1 && <ItemSeparator />}
                  </View>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </BottomSheet>
  )
}

export default SettingsBottomSheet

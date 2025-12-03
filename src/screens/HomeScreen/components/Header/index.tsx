import { Pressable, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ConversationView from './components/ConversationView'
import { HeaderLeftProps, HeaderProps, HeaderRightProps } from './type'
import { CloseIcon, SettingIcon } from '@/assets'
import { useAppNavigation } from '@/screens/helper'
import useConfigurationStore from '@/store/configuration'

const HeaderLeft = ({ headerLeft, isFree }: HeaderLeftProps) => {
  switch (headerLeft) {
    case 'default':
      return (
        <>
          {isFree && (
            <Text className="text-bg-badgeProBg text-[14px] font-semibold border border-bg-badgeProBg py-1 px-2 rounded-lg">
              PRO
            </Text>
          )}
        </>
      )

    case 'conversationView':
      return <ConversationView />

    case 'none':
    default:
      return null
  }
}

const HeaderRight = ({ headerRight }: HeaderRightProps) => {
  const navigation = useAppNavigation()

  switch (headerRight) {
    case 'default':
      return <SettingIcon width={21.57} height={22} color="#2563EB" />

    case 'close':
      return (
        <Pressable onPress={() => navigation.goBack()}>
          <CloseIcon width={15} height={15} color="#000" />
        </Pressable>
      )

    default:
      return null
  }
}

const Header = ({ title, headerLeft = 'default', headerRight = 'default' }: HeaderProps) => {
  const insets = useSafeAreaInsets()
  const { configuration } = useConfigurationStore()

  return (
    <View
      style={{ paddingTop: insets.top }}
      className="h-[105px] bg-[#F4F8FF] flex-row items-center justify-between px-6 py-4"
    >
      <View className="w-14 items-start">
        <HeaderLeft headerLeft={headerLeft} isFree={configuration?.user.tire === 'Free'} />
      </View>

      <View className="flex-row gap-1.5 items-center">
        <Text className="text-text-primary text-[17px] font-bold">{title}</Text>
        {configuration?.user.tire !== 'Free' && (
          <Text className="text-text-onPrimary text-[14px] font-semibold bg-bg-badgeProBg py-1 px-2 rounded-lg">
            PRO
          </Text>
        )}
      </View>

      <View className="w-14 items-end">
        <HeaderRight headerRight={headerRight} />
      </View>
    </View>
  )
}

export default Header

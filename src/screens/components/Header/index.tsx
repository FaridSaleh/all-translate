import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs'
import useConfigurationStore from '@/store/configuration'

const Header = ({ options }: BottomTabHeaderProps) => {
  const insets = useSafeAreaInsets()
  const { configuration } = useConfigurationStore()

  return (
    <View
      style={{ paddingTop: insets.top }}
      className="bg-[transparent] flex-row items-center justify-between px-6 py-4"
    >
      <View />
      <View className="flex-row gap-1.5 items-center">
        <Text className="text-text-primary text-[17px] font-bold">{options.title}</Text>
        {configuration?.user.tire === 'Free' && (
          <Text className="text-text-onPrimary text-[14px] font-semibold bg-bg-badgeProBg py-1 px-2 rounded-lg">
            PRO
          </Text>
        )}
      </View>
      <View />
    </View>
  )
}

export default Header

import { Text, View } from 'react-native'
import LanguageSelectorProps from './type'
import { ChevronUpAndDownIcon, SwapIcon } from '@/assets'
import { RipplePressable } from '@/components'

const LanguageSelector = ({
  sourceLanguage,
  targetLanguage,
  onSourcePress,
  onTargetPress,
  onSwapPress,
}: LanguageSelectorProps) => {
  return (
    <View className="flex-row items-center self-center w-[256px] rounded-[9px] bg-[#E8E8ED]/90 px-1 py-[6px] shadow-sm">
      <RipplePressable
        className="flex-1 flex-row items-center justify-center gap-[6px] py-2"
        onPress={onSourcePress}
      >
        <Text className="text-[14px] font-medium text-text-primary">{sourceLanguage.name}</Text>
        <ChevronUpAndDownIcon width={9} height={13} color="#000" />
      </RipplePressable>

      <RipplePressable
        borderless
        className="w-[40px] h-[40px] items-center justify-center overflow-hidden"
        onPress={onSwapPress}
      >
        <SwapIcon width={16} height={14} color="#000000" />
      </RipplePressable>

      <RipplePressable
        className="flex-1 flex-row items-center justify-center gap-[6px] py-2"
        onPress={onTargetPress}
      >
        <Text className="text-[14px] font-medium text-text-primary">{targetLanguage.name}</Text>
        <ChevronUpAndDownIcon width={9} height={13} color="#000" />
      </RipplePressable>
    </View>
  )
}

export default LanguageSelector

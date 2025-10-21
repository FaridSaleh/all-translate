import { Text, View } from 'react-native'
import LanguageBottomSheetProps from './type'
import { BottomSheet } from '@/components'

const LanguageBottomSheet = ({ isOpen, setIsOpen }: LanguageBottomSheetProps) => {
  return (
    <BottomSheet isOpen={isOpen} setIsOpen={setIsOpen}>
      <View className="items-center px-6 py-8">
        <Text>Select Language</Text>
      </View>
    </BottomSheet>
  )
}

export default LanguageBottomSheet

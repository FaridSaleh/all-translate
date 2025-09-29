import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

const AppContent = () => {
  const { t } = useTranslation()

  return (
    <LinearGradient
      colors={['#D2E5FF', '#F4F8FF', '#FFFFFF']}
      locations={[0, 0.6, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <View className="w-screen h-screen">
        <View className="flex-1 items-center justify-center">
          <Text className="text-[32px] font-bold text-text-primary">{t('AllTranslate')}</Text>
        </View>
      </View>
    </LinearGradient>
  )
}

export default AppContent

import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Text, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import SplashScreenProps from './type'
import { useGetTokenRequest } from '@/apis/auth/getToken'
import { setTokenSecure } from '@/store/auth'
import { useConfiguration } from '@/apis/configuration'
import useConfigurationStore from '@/store/configuration'

function SplashScreen({ navigation }: SplashScreenProps) {
  const { t } = useTranslation()
  const { mutate: getToken } = useGetTokenRequest()
  const { mutate: getConfiguration } = useConfiguration()
  const { setConfiguration } = useConfigurationStore()

  useEffect(() => {
    getToken(
      { userId: 'b4bcdb29-71cd-4c8d-a461-b34bb48cb23e' },
      {
        onSuccess: async tokenData => {
          await setTokenSecure(tokenData)
          getConfiguration(undefined, {
            onSuccess: configurationData => {
              setConfiguration(configurationData)
              navigation.replace('Home')
            },
          })
        },
      },
    )
  }, [])

  return (
    <LinearGradient
      colors={['#D2E5FF', '#F4F8FF', '#FFFFFF']}
      locations={[0, 0.6, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <View className="w-screen h-screen">
        <View className="flex-1 items-center justify-evenly">
          <View className="items-center gap-4">
            <Text className="text-[32px] font-bold text-text-primary">
              {t('SplashScreen.title')}
            </Text>
            <Text className="text-[20px] font-bold text-text-primary">
              {t('SplashScreen.subtitle')}
            </Text>
          </View>
          <Image
            source={require('@/assets/images/allTranslateLogo.webp')}
            accessibilityLabel="AllTranslate Logo"
            className="w-[185px] h-[178.56px]"
            resizeMode="contain"
          />
          <View className="flex-row items-center justify-center gap-8">
            <View className="w-[42px] h-[42px] rounded-full bg-primary-light" />
            <View className="w-[62px] h-[62px] rounded-full bg-primary-light" />
          </View>
          <Text className="text-[14px] font-medium text-text-primary">
            {t('SplashScreen.description')}
          </Text>
        </View>
      </View>
    </LinearGradient>
  )
}

export default SplashScreen

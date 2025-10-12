import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Text, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { useGetTokenRequest } from '@/apis/auth/getToken'
import { setTokenSecure } from '@/store/auth'
import { useConfiguration } from '@/apis/configuration'
import useConfigurationStore from '@/store/configuration'
import ForceUpdateModal from './components/ForceUpdateModal'
import { useAppNavigation } from '../helper'

function SplashScreen() {
  const navigation = useAppNavigation()
  const { t } = useTranslation()
  const [splashMessage, setSplashMessage] = useState<string>()
  const [isForceUpdateOpen, setIsForceUpdateOpen] = useState<boolean>(false)

  const { mutate: getToken } = useGetTokenRequest()
  const { mutate: getConfiguration } = useConfiguration()
  const { configuration, setConfiguration, nextSplashMessageId, setNextSplashMessageId } =
    useConfigurationStore()

  useEffect(() => {
    getSplashMessage()
    getToken(
      { userId: 'b4bcdb29-71cd-4c8d-a461-b34bb48cb23e' },
      {
        onSuccess: async tokenData => {
          await setTokenSecure(tokenData)
          getConfiguration(undefined, {
            onSuccess: configurationData => {
              setConfiguration(configurationData)
              if (configurationData.forceUpdate) {
                setIsForceUpdateOpen(true)
              } else {
                navigation.replace('Home')
              }
            },
          })
        },
      },
    )
  }, [])

  const getSplashMessage = () => {
    const messageIndex =
      configuration?.splashMessages.findIndex(item => item.id === nextSplashMessageId) ?? 0
    setNextSplashMessageId(
      messageIndex + 1 < (configuration?.splashMessages.length ?? 0)
        ? (configuration?.splashMessages[messageIndex + 1]?.id ?? null)
        : (configuration?.splashMessages[0]?.id ?? null),
    )
    setSplashMessage(
      configuration?.splashMessages[messageIndex]?.message ?? t('SplashScreen.description'),
    )
  }

  return (
    <>
      <LinearGradient
        colors={['#D2E5FF', '#F4F8FF', '#FFFFFF']}
        locations={[0, 0.6, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View className="w-screen h-screen">
          <View className="flex-1 items-center justify-evenly px-4">
            <View className="items-center gap-4">
              <View className="flex-row items-start gap-1.5">
                <Text className="text-[32px] font-bold text-text-primary">
                  {t('SplashScreen.title')}
                </Text>
                <Text>
                  {configuration?.user.tire === 'Premium' && (
                    <View className="bg-bg-badgeProBg rounded-lg px-2 py-1">
                      <Text className="font-bold text-[15px] text-text-onPrimary">PRO</Text>
                    </View>
                  )}
                </Text>
              </View>
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
            <Text className="text-[14px] font-medium text-text-primary text-center">
              {splashMessage}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ForceUpdateModal
        isForceUpdateOpen={isForceUpdateOpen}
        setIsForceUpdateOpen={setIsForceUpdateOpen}
        configuration={configuration}
      />
    </>
  )
}

export default SplashScreen

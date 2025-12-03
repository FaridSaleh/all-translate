/* eslint-disable react/no-unstable-nested-components */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useTranslation } from 'react-i18next'
import Header from './components/Header'
import ConversationFaceToFaceScreen from './screens/ConversationFaceToFaceScreen'
import ConversationScreen from './screens/ConversationScreen'
import ImageScreen from './screens/ImageScreen'
import TranslationsScreen from './screens/TranslationsScreen'
import { TabBarIconComponentProps, TabBarIconProps } from './type'
import { CameraIcon, MicrophoneIcon, ParagraphIcon } from '@/assets'

const makeTabIcon =
  (Icon: TabBarIconProps) =>
  ({ color, width, height }: TabBarIconComponentProps) => (
    <Icon width={width} height={height} color={color} />
  )

const Tab = createBottomTabNavigator()
const HomeStack = createNativeStackNavigator()

const HomeTabs = () => {
  const { t } = useTranslation()

  return (
    <Tab.Navigator
      screenOptions={{
        title: t('HomeScreen.title'),
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: 'medium',
        },
        tabBarStyle: {
          marginHorizontal: 20,
          borderTopWidth: 1,
          borderTopColor: '#4B5563',
          shadowColor: 'transparent',
        },
      }}
    >
      <Tab.Screen
        name="TranslationsTab"
        component={TranslationsScreen}
        options={{
          tabBarLabel: t('HomeScreen.text_and_voice'),
          tabBarIcon: ({ color }) =>
            makeTabIcon(ParagraphIcon)({ color, width: 21.65, height: 20.81 }),
          header: () => <Header title={t('HomeScreen.title')} />,
        }}
      />
      <Tab.Screen
        name="ConversationTab"
        component={ConversationScreen}
        options={{
          tabBarLabel: t('HomeScreen.conversation'),
          tabBarIcon: ({ color }) => makeTabIcon(MicrophoneIcon)({ color, width: 15, height: 20 }),
          header: () => (
            <Header title={t('HomeScreen.conversation')} headerLeft="conversationView" />
          ),
        }}
      />
      <Tab.Screen
        name="ImageTab"
        component={ImageScreen}
        options={{
          tabBarLabel: t('HomeScreen.camera'),
          tabBarIcon: ({ color }) => makeTabIcon(CameraIcon)({ color, width: 22, height: 17 }),
          header: () => <Header title={t('HomeScreen.camera')} />,
        }}
      />
    </Tab.Navigator>
  )
}

function HomeScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ contentStyle: { backgroundColor: '#FFFFFF' } }}>
      <HomeStack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
      <HomeStack.Screen
        name="ConversationFaceToFace"
        component={ConversationFaceToFaceScreen}
        options={{
          header: () => <Header headerLeft="none" headerRight="close" />,
        }}
      />
    </HomeStack.Navigator>
  )
}

export default HomeScreen

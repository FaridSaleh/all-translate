import { BottomTabHeaderProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useTranslation } from 'react-i18next'
import Header from './components/Header'
import ConversationView from './components/Header/components/ConversationView'
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

const HeaderComponent = (props: BottomTabHeaderProps) => <Header {...props} />

const Tab = createBottomTabNavigator()

function HomeScreen() {
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
        header: HeaderComponent,
      }}
    >
      <Tab.Screen
        name="TabOne"
        component={TranslationsScreen}
        options={{
          tabBarLabel: t('HomeScreen.text_and_voice'),
          tabBarIcon: ({ color }) =>
            makeTabIcon(ParagraphIcon)({ color, width: 21.65, height: 20.81 }),
        }}
      />
      <Tab.Screen
        name="TabTwo"
        component={ConversationScreen}
        options={{
          title: t('HomeScreen.conversation'),
          tabBarLabel: t('HomeScreen.conversation'),
          headerLeft: ConversationView,
          tabBarIcon: ({ color }) => makeTabIcon(MicrophoneIcon)({ color, width: 15, height: 20 }),
        }}
      />
      <Tab.Screen
        name="TabThree"
        component={ImageScreen}
        options={{
          tabBarLabel: t('HomeScreen.camera'),
          tabBarIcon: ({ color }) => makeTabIcon(CameraIcon)({ color, width: 22, height: 17 }),
        }}
      />
    </Tab.Navigator>
  )
}

export default HomeScreen

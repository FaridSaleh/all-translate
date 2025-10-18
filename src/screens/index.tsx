import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { navigationRef } from './helper'
import HomeScreen from './HomeScreen'
import SplashScreen from './SplashScreen'
import { RootStackParamList } from './type'

const Stack = createNativeStackNavigator<RootStackParamList>()

function RootNavigator() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ contentStyle: { backgroundColor: '#FFFFFF' } }}>
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default RootNavigator

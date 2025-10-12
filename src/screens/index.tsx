import React from 'react'
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
      <Stack.Navigator>
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'All Translate',
            headerStyle: {
              backgroundColor: '#f8f9fa',
            },
            headerTintColor: '#333',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerRight: undefined,
            headerLeft: undefined,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default RootNavigator

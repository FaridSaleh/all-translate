import { CommonActions, createNavigationContainerRef } from '@react-navigation/native'
import { RootStackParamList } from './type'

export const navigationRef = createNavigationContainerRef<RootStackParamList>()

export function getCurrentRouteName() {
  return navigationRef.getCurrentRoute()?.name
}

export function redirectToSplash() {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Splash' }],
      }),
    )
  }
}

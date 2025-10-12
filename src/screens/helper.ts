import {
  CommonActions,
  createNavigationContainerRef,
  useNavigation,
} from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from './type'

export const navigationRef = createNavigationContainerRef<RootStackParamList>()

export const useAppNavigation = () => {
  return useNavigation<NativeStackNavigationProp<any>>()
}

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

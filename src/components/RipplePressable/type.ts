import { PressableProps } from 'react-native'

type RipplePressableProps = PressableProps & {
  rippleColor?: string
  borderless?: boolean
  /** Tailwind opacity step used with NativeWind `active:` modifier (60, 70, or 80). */
  pressedOpacity?: 60 | 70 | 80
}

export default RipplePressableProps

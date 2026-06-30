import { Pressable } from 'react-native'
import RipplePressableProps from './type'

const DEFAULT_RIPPLE_COLOR = 'rgba(0, 0, 0, 0.2)'

const PRESSED_OPACITY_CLASS = {
  60: 'active:opacity-60',
  70: 'active:opacity-70',
  80: 'active:opacity-80',
} as const

const RipplePressable = ({
  className,
  android_ripple,
  disabled,
  rippleColor = DEFAULT_RIPPLE_COLOR,
  borderless = false,
  pressedOpacity = 70,
  ...props
}: RipplePressableProps) => {
  const pressedClass =
    PRESSED_OPACITY_CLASS[pressedOpacity] ?? PRESSED_OPACITY_CLASS[70]

  const feedbackClass = borderless ? pressedClass : `${pressedClass} active:bg-black/5`
  const mergedClassName = [className, !disabled && feedbackClass].filter(Boolean).join(' ')

  return (
    <Pressable
      disabled={disabled}
      className={mergedClassName}
      android_ripple={
        disabled
          ? undefined
          : (android_ripple ?? {
              color: rippleColor,
              borderless,
              foreground: borderless,
            })
      }
      {...props}
    />
  )
}

export default RipplePressable

import LinearGradient from 'react-native-linear-gradient'
import GradientLayoutProps from './type'

const GradientLayout = ({ children }: GradientLayoutProps) => {
  return (
    <LinearGradient
      style={{ flex: 1 }}
      colors={['#F4F8FF', '#FFFFFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      {children}
    </LinearGradient>
  )
}

export default GradientLayout

import { useColorScheme, View } from 'react-native'
import { Colors } from '../constants/colors'

const ThemedView = ({ 
  style, 
  variant = 'screen', // 'screen' | 'card' | 'transparent'
  ...props 
}) => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light

  const baseStyles = {
    screen: {
      backgroundColor: theme.background,
      flex: 1
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 14,
      marginBottom: 14,
      shadowColor: '#00000008',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 1
    },
    transparent: {
      backgroundColor: 'transparent'
    }
  }

  return (
    <View 
      style={[baseStyles[variant], style]}
      {...props}
    />
  )
}

export default ThemedView
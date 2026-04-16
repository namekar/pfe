import { Text, useColorScheme } from 'react-native'
import { Colors } from '../constants/colors'

const ThemedText = ({
  style,
  variant = 'body', 
  ...props
}) => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light

  const styles = {
    title: {
      color: theme.title,
      fontSize: 22,
      fontWeight: '700'
    },
    subtitle: {
      color: theme.muted,
      fontSize: 14
    },
    body: {
      color: theme.text,
      fontSize: 14
    },
    muted: {
      color: theme.muted,
      fontSize: 13
    },
    primary: {
      color: theme.primary,
      fontWeight: '600'
    },
    danger: {
      color: theme.danger,
      fontWeight: '500'
    }
  }

  return (
    <Text
      style={[styles[variant], style]}
      {...props}
    />
  )
}

export default ThemedText
import { TextInput, useColorScheme } from 'react-native'
import { Colors } from '../constants/colors'

export default function ThemedTextInput({
  style,
  error = false,
  ...props
}) {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light

  return (
    <TextInput
      style={[
        {
          backgroundColor: '#FAFAFA',
          color: theme.text,
          paddingVertical: 12,
          paddingHorizontal: 14,
          borderRadius: 8,
          borderWidth: error ? 1 : 0,
          borderColor: error ? theme.danger : 'transparent',
        },
        style
      ]}
      placeholderTextColor={theme.muted}
      {...props}
    />
  )
}
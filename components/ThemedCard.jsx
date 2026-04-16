import { StyleSheet, useColorScheme, View } from 'react-native'
import { Colors } from '../constants/colors'

const ThemedCard = ({ style, ...props }) => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light

  return (
    <View
      style={[
        {
          backgroundColor: theme.surface,
          borderRadius: 10,
          padding: 14,
          shadowColor: '#00000010',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 6,
          elevation: 2,
        },
        styles.card,
        style
      ]}
      {...props}
    />
  )
}

export default ThemedCard

const styles = StyleSheet.create({
  card: {
    marginBottom: 14
  }
})
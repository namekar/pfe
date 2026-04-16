import { Pressable, StyleSheet } from 'react-native'
import { Colors } from '../constants/colors'

function ThemedButton({ style, variant = "primary", ...props }) {

  const variants = {
    primary: {
      backgroundColor: Colors.primary
    },
    secondary: {
      backgroundColor: "#FFFFFF",
      borderWidth: 1,
      borderColor: "#E6E6E6"
    },
    danger: {
      backgroundColor: Colors.warning
    }
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.btn,
        variants[variant],
        pressed && styles.pressed,
        style
      ]}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8
  },
  pressed: {
    opacity: 0.6
  }
})

export default ThemedButton
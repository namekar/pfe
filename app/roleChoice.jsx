import { Pressable, StyleSheet, Text, View } from "react-native";

export default function ChoiceScreen() {
  return (
    <View style={styles.container}>
      
      <Pressable style={[styles.half, styles.top]}>
        <Text style={styles.text}>Veterinarian</Text>
      </Pressable>

      <Pressable style={[styles.half, styles.bottom]}>
        <Text style={styles.text}>Owner</Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  half: {
    flex: 1, 
    justifyContent: "center",
    alignItems: "center",
  },
  top: {
    backgroundColor: "#2C5364",
  },
  bottom: {
    backgroundColor: "#243B55",
  },
  text: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },
});
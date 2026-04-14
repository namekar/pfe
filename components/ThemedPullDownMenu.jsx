import React, { useState } from "react";
import {
  View,
  Modal,
  Pressable,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import ThemedText from "./ThemedText";

export default function ThemedPullDownMenu({
  label,
  selectedValue,
  onValueChange,
  items = [],
}) {
  const [open, setOpen] = useState(false);

  const selectedLabel =
    items.find((i) => i.value === selectedValue)?.label || "Select...";

  return (
    <View style={styles.container}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}

      {/* Button */}
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setOpen(true)}
      >
        <ThemedText>{selectedLabel}</ThemedText>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.modal}>
            <FlatList
              data={items}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => {
                    onValueChange(item.value);
                    setOpen(false);
                  }}
                >
                  <ThemedText>{item.label}</ThemedText>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
  },
  selector: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 12,
    maxHeight: "60%",
    padding: 10,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
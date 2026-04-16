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
import { Colors } from "../constants/colors";
import { useColorScheme } from "react-native";

export default function ThemedPullDownMenu({
  label,
  selectedValue,
  onValueChange,
  items = [],
}) {
  const [open, setOpen] = useState(false);

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const selectedLabel =
    items.find((i) => i.value === selectedValue)?.label || "Select...";

  return (
    <View style={styles.container}>
      {label && <ThemedText variant="muted" style={styles.label}>{label}</ThemedText>}

      {/* Selector */}
      <TouchableOpacity
        style={[styles.selector, { backgroundColor: theme.inputBackground }]}
        onPress={() => setOpen(true)}
      >
        <ThemedText variant="body">
          {selectedLabel}
        </ThemedText>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={[styles.modal, { backgroundColor: theme.surface }]}>
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
                  <ThemedText variant="body">
                    {item.label}
                  </ThemedText>
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
    marginVertical: 8,
  },

  label: {
    marginBottom: 6,
  },

  selector: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E6E6E6",
  },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    padding: 20,
  },

  modal: {
    borderRadius: 12,
    maxHeight: "60%",
    padding: 10,
  },

  item: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E6E6E6",
  },
});
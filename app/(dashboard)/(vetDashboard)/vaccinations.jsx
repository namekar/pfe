import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, FlatList } from "react-native";

export default function VaccinationsSection() {
  const [vaccinations, setVaccinations] = useState([
    { id: "1", name: "", date: "", expanded: false },
  ]);

  // Toggle collapse
  const toggleExpand = (id) => {
    setVaccinations((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, expanded: !v.expanded } : v
      )
    );
  };

  const updateField = (id, field, value) => {
    setVaccinations((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, [field]: value } : v
      )
    );
  };

  const addVaccination = () => {
    setVaccinations((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: "",
        date: "",
        expanded: true,
      },
    ]);
  };

  const removeVaccination = (id) => {
    setVaccinations((prev) => prev.filter((v) => v.id !== id));
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Header */}
      <TouchableOpacity onPress={() => toggleExpand(item.id)} style={styles.header}>
        <Text style={styles.title}>
          {item.name ? item.name : "New Vaccination"}
        </Text>
        <Text>{item.expanded ? "▲" : "▼"}</Text>
      </TouchableOpacity>

      {item.expanded && (
        <View style={styles.body}>
          <TextInput
            placeholder="Vaccine name"
            value={item.name}
            onChangeText={(text) => updateField(item.id, "name", text)}
            style={styles.input}
          />

          <TextInput
            placeholder="Date (YYYY-MM-DD)"
            value={item.date}
            onChangeText={(text) => updateField(item.id, "date", text)}
            style={styles.input}
          />

          <TouchableOpacity onPress={() => removeVaccination(item.id)}>
            <Text style={styles.delete}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Vaccinations</Text>

      <FlatList
        data={vaccinations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      <TouchableOpacity onPress={addVaccination} style={styles.addBtn}>
        <Text style={styles.addText}>+ Add Vaccination</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },

  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
    overflow: "hidden",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#f5f5f5",
  },

  title: { fontWeight: "600" },

  body: { padding: 12, gap: 10 },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
  },

  delete: {
    color: "red",
    marginTop: 5,
  },

  addBtn: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#32B36A",
    borderRadius: 8,
    alignItems: "center",
  },

  addText: { color: "white", fontWeight: "bold" },
});
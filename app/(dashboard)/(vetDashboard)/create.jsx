import { useRouter } from 'expo-router'
import { useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native'
import { useAnimals } from "../../../hooks/useAnimals"
import ThemedPullDownMenu from "../../../components/ThemedPullDownMenu"

import Spacer from '../../../components/Spacer'
import ThemedButton from '../../../components/ThemedButton'
import ThemedText from "../../../components/ThemedText"
import ThemedTextInput from "../../../components/ThemedTextInput"
import ThemedView from "../../../components/ThemedView"

const Create = () => {
  const [species, setSpecies] = useState("")
  const [name, setName] = useState("")
  const [breed, setBreed] = useState("")
  const [age, setAge] = useState("")
  const [weight, setWeight] = useState("")
  /*const [owner, setOwner] = useState("")*/
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [medical_history, setHistory] = useState("")
  const [vaccinations,setVaccinations] = useState("")
  const [notes, setnotes] = useState("")
  const { createAnimal } = useAnimals("")
  const router = useRouter()



  const SPECIES = [
  { label: "Dog", value: "dog" },
  { label: "Cat", value: "cat" },
  { label: "Bird", value: "bird" },
  { label: "Rabbit", value: "rabbit" },
  ];
  const BREED = [
  { label: "Labrador Retriever", value: "labrador" },
  { label: "German Shepherd", value: "german_shepherd" },
  { label: "Golden Retriever", value: "golden_retriever" },
  { label: "Bulldog", value: "bulldog" },
  { label: "Poodle", value: "poodle" },
  { label: "Rottweiler", value: "rottweiler" },
  { label: "Beagle", value: "beagle" },
  { label: "Siberian Husky", value: "husky" },
  { label: "Chihuahua", value: "chihuahua" },
  { label: "Boxer", value: "boxer" },
];




  async function handleSubmit() {
    if (!name.trim() /*|| !owner.trim()*/ || !description.trim() || !species.trim() || !breed.trim() || !age.trim() || !weight.trim() || !medical_history.trim() || !vaccinations.trim() || !notes.trim()) return

    setLoading(true)
    
    await createAnimal({ name, description, species, breed, medical_history, vaccinations,notes, age: parseInt(age, 10), weight: parseInt(weight, 10) })

    setSpecies("")
    setName("")
    setDescription("")
    setBreed("")
    setWeight("")
    setAge("")
    setHistory("")
    setVaccinations("")
    setnotes("")
    
    
    router.replace("/animals")

    setLoading(false) 
  }

   return (
  <ScrollView contentContainerStyle={styles.scroll}>
    <TouchableWithoutFeedback>
      <ThemedView style={styles.container}>

        {/* Header Card */}
        <View style={styles.card}>
          <ThemedText title={true} style={styles.heading}>
            Add a New Animal
          </ThemedText>
        </View>

        {/* Main Form Card */}
        <View style={styles.card}>
          
          <ThemedText style={styles.label}>Name</ThemedText>
          <ThemedTextInput
            style={styles.input}
            placeholder="name"
            value={name}
            onChangeText={setName}
          />

          <ThemedText style={styles.label}>Species</ThemedText>
          <ThemedPullDownMenu
            label=""
            selectedValue={species}
            onValueChange={setSpecies}
            items={SPECIES}
          />

          <ThemedText style={styles.label}>Breed</ThemedText>
          <ThemedPullDownMenu
            label=""
            selectedValue={breed}
            onValueChange={setBreed}
            items={BREED}
          />

          <View style={styles.row}>
            <View style={styles.half}>
              <ThemedText style={styles.label}>Age</ThemedText>
              <ThemedTextInput
                style={styles.input}
                value={age}
                keyboardType="numeric"
                onChangeText={(text) => {
                  const cleaned = text.replace(/[^0-9]/g, "");
                  setAge(cleaned);
                }}
              />
            </View>

            <View style={styles.half}>
              <ThemedText style={styles.label}>Weight</ThemedText>
              <ThemedTextInput
                style={styles.input}
                value={weight}
                keyboardType="numeric"
                onChangeText={(text) => {
                  const cleaned = text.replace(/[^0-9]/g, "");
                  setWeight(cleaned);
                }}
              />
            </View>
          </View>

          <ThemedText style={styles.label}>Medical History</ThemedText>
          <ThemedTextInput
            style={styles.input}
            value={medical_history}
            onChangeText={setHistory}
          />

          <ThemedText style={styles.label}>Vaccinations</ThemedText>
          <ThemedTextInput
            style={styles.input}
            value={vaccinations}
            onChangeText={setVaccinations}
          />

          <ThemedText style={styles.label}>Notes</ThemedText>
          <ThemedTextInput
            style={styles.input}
            value={notes}
            onChangeText={setnotes}
          />

          <ThemedText style={styles.label}>Description</ThemedText>
          <ThemedTextInput
            style={styles.multiline}
            value={description}
            onChangeText={setDescription}
            multiline={true}
          />

          <Spacer />

          <ThemedButton onPress={handleSubmit} disabled={loading}>
            <Text style={{ color: "#fff" }}>
              {loading ? "Saving..." : "Add animal"}
            </Text>
          </ThemedButton>

        </View>

      </ThemedView>
    </TouchableWithoutFeedback>
  </ScrollView>
);
  
  const COLORS = {
  primary: '#32B36A',
  background: '#F7FBF5',
  text: '#0E2A1F',
  muted: '#6B887A',
};

const styles = StyleSheet.create({
  scroll: {
    padding: 20,
    backgroundColor: COLORS.background,
    alignItems: "center",
  },

  container: {
    width: "100%",
    maxWidth: 600,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#00000010",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  heading: {
    fontWeight: "700",
    fontSize: 18,
    color: COLORS.text,
    textAlign: "center",
  },

  label: {
    marginTop: 12,
    marginBottom: 6,
    color: COLORS.muted,
    fontSize: 13,
  },

  input: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#eee",
  },

  multiline: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#eee",
    minHeight: 100,
  },

  row: {
    flexDirection: "row",
    marginTop: 10,
  },

  half: {
    flex: 1,
    marginRight: 8,
  },
})}
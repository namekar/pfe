import { useRouter } from 'expo-router'
import { useState } from 'react'
import { StyleSheet, Text, TouchableWithoutFeedback } from 'react-native'
import { useAnimals } from "../../../hooks/useAnimals"

import Spacer from '../../../components/Spacer'
import ThemedButton from '../../../components/ThemedButton'
import ThemedText from "../../../components/ThemedText"
import ThemedTextInput from "../../../components/ThemedTextInput"
import ThemedView from "../../../components/ThemedView"

const Create = () => {
  const [species, setSpecies] = useState("")
  const [name, setName] = useState("")
  /*const [owner, setOwner] = useState("")*/
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const { createAnimal } = useAnimals()
  const router = useRouter()

  async function handleSubmit() {
    if (!name.trim() /*|| !owner.trim()*/ || !description.trim() || !species.trim()) return

    setLoading(true)
    
    await createAnimal({ name,description, species })

    setSpecies("")
    setName("")
    /*setOwner("")*/
    setDescription("")
    

    
    router.replace("/animals")

    setLoading(false) 
  }

  return (
    
    <TouchableWithoutFeedback > 
      <ThemedView style={styles.container}>

        <ThemedText title={true} style={styles.heading}>
          Add a New Animal
        </ThemedText>
        <Spacer />

        <ThemedTextInput
          style={styles.input}
          placeholder="name"
          value={name}
          onChangeText={setName}
        />
        <Spacer />

        {/*<ThemedTextInput
          style={styles.input}
          placeholder="owner"
          value={owner}
          onChangeText={setOwner}
        />
        <Spacer />*/}

        <ThemedTextInput
          style={styles.multiline}
          placeholder="species"
          value={species}
          onChangeText={setSpecies}
          multiline={true}
        />
        <Spacer />
        <ThemedTextInput
          style={styles.multiline}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline={true}
        />
        <Spacer />

        <ThemedButton onPress={handleSubmit} disabled={loading}>
          <Text style={{ color: '#fff' }}>
            {loading ? "Saving..." : "Add animal"}
          </Text>
        </ThemedButton>

      </ThemedView>
    </TouchableWithoutFeedback>
  )
}

export default Create

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  input: {
    padding: 20,
    borderRadius: 6,
    alignSelf: 'stretch',
    marginHorizontal: 40,
  },
  multiline: {
    padding: 20,
    borderRadius: 6,
    minHeight: 100,
    alignSelf: 'stretch',
    marginHorizontal: 40,
  },
})
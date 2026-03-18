import { StyleSheet, Text, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { useAnimals } from "../../hooks/useAnimals"
import { useRouter } from 'expo-router'
import { useState } from 'react'

import ThemedView from "../../components/ThemedView"
import ThemedText from "../../components/ThemedText"
import ThemedTextInput from "../../components/ThemedTextInput"
import ThemedButton from '../../components/ThemedButton'
import Spacer from '../../components/Spacer'

const Create = () => {
  const [name, setName] = useState("")
  const [owner, setOwner] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const { createAnimal } = useAnimals()
  const router = useRouter()

  async function handleSubmit() {
    if (!name.trim() || !owner.trim() || !description.trim()) return

    setLoading(true)
    
    await createAnimal({ name, owner, description })

    
    setName("")
    setOwner("")
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

        <ThemedTextInput
          style={styles.input}
          placeholder="owner"
          value={owner}
          onChangeText={setOwner}
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
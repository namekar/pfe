import { StyleSheet, Text, View } from 'react-native'
import { router, useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'

import ThemedView from "../../../components/ThemedView"
import ThemedText from "../../../components/ThemedText"
import ThemedTextInput from "../../../components/ThemedTextInput"
import ThemedButton from '../../../components/ThemedButton'
import Spacer from '../../../components/Spacer'
import { useAnimals } from '../../../hooks/useAnimals'
import ThemedCard from '../../../components/ThemedCard'
import ThemedLoader from '../../../components/ThemedLoader'
import { Colors } from '../../../constants/colors'

const AnimalDetails = () => {
    const [animal, setAnimal] = useState(null)
    const { id } = useLocalSearchParams()
    const {fetchAnimalById, DeleteAnimal} = useAnimals()
    const router = useRouter()
    const handleDelete = async () => {
        await DeleteAnimal(id)
        setAnimal(null)
        router.replace('/animals')
    }

    useEffect(()=>{
        async function loadAnimal(){
            const animalData = await fetchAnimalById(id)
            setAnimal(animalData)
        }
        loadAnimal()
    },[id])

if (!animal){
    return (
        <ThemedView safe={true} style={styles.container}>
            <ThemedLoader/>
        </ThemedView>
    )
}

  return (
    <ThemedView safe={true} style={styles.container}>
        <ThemedCard style={styles.card}>
            <ThemedText style={styles.name}>{animal.name}</ThemedText>
            <ThemedText> The owner is called {animal.owner}</ThemedText>
            <Spacer/>

            <ThemedText title={true}>Animal Description:</ThemedText>
            <Spacer height={10}/>
            <ThemedText>{animal.description}</ThemedText>
            <ThemedButton style={styles.delete} onPress={handleDelete}>
                <Text style={{color: '#fff', textAlign: 'center'}}>
                    delete
                </Text>
            </ThemedButton>
        </ThemedCard>
    </ThemedView>
  )
}

export default AnimalDetails

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: "stretch",
    },
    name: {
        fontSize: 22,
        marginVertical: 10,
    },
    card:{
        margin: 20
    },
    delete: {
        marginTop: 40,
        backgroundColor: Colors.warning,
        width: 200,
        alignSelf: 'center'
    }
})
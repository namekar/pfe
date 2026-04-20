import { StyleSheet, Text } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'

import ThemedView from "../../../../components/ThemedView"
import ThemedText from "../../../../components/ThemedText"
import ThemedButton from '../../../../components/ThemedButton'
import Spacer from '../../../../components/Spacer'
import { useAnimals } from '../../../../hooks/useAnimals'
import ThemedCard from '../../../../components/ThemedCard'
import ThemedLoader from '../../../../components/ThemedLoader'
import { Colors } from '../../../../constants/colors'

const AnimalDetails = () => {
    const [animal, setAnimal] = useState(null)
    const { id } = useLocalSearchParams()
    const { fetchAnimalById, DeleteAnimal, owners } = useAnimals()
    const router = useRouter()

    const getOwnerName = (id) => {
        return owners?.find(o => o.$id === id)?.name || "Unknown"
    }

    const handleDelete = async () => {
        await DeleteAnimal(id)
        setAnimal(null)
        router.replace('/animals')
    }

    useEffect(() => {
        async function loadAnimal() {
            const animalData = await fetchAnimalById(id)
            setAnimal(animalData)
        }
        loadAnimal()
    }, [id])

    if (!animal) {
        return (
            <ThemedView safe={true} style={styles.container}>
                <ThemedLoader />
            </ThemedView>
        )
    }

    return (
        <ThemedView safe={true} style={styles.container}>
            <ThemedCard style={styles.card}>

                {/* NAME */}
                <ThemedText style={styles.name}>{animal.name}</ThemedText>

                {/* OWNER */}
                <ThemedText style={styles.meta}>
                    Owner: {getOwnerName(animal.OwnerId)}
                </ThemedText>

                <Spacer />

                {/* BASIC INFO */}
                <ThemedText title={true}>Basic Info</ThemedText>
                <Spacer height={10} />

                <ThemedText style={styles.meta}>
                    Species: {animal.species || '-'}
                </ThemedText>

                <ThemedText style={styles.meta}>
                    Breed: {animal.breed || '-'}
                </ThemedText>

                <ThemedText style={styles.meta}>
                    Sex: {animal.sex || 'Unknown'}
                </ThemedText>

                <ThemedText style={styles.meta}>
                    Age: {animal.age ? `${animal.age} years` : '-'}
                </ThemedText>

                <ThemedText style={styles.meta}>
                    Weight: {animal.weight ? `${animal.weight} kg` : '-'}
                </ThemedText>

                <Spacer />

                {/* DESCRIPTION */}
                <ThemedText title={true}>Description</ThemedText>
                <Spacer height={10} />
                <ThemedText>{animal.description || '-'}</ThemedText>

                <Spacer />

                {/* MEDICAL */}
                <ThemedText title={true}>Medical</ThemedText>
                <Spacer height={10} />

                <ThemedText style={styles.meta}>
                    History: {animal.medical_history || '-'}
                </ThemedText>

                <ThemedText style={styles.meta}>
                    Vaccinations: {animal.vaccinations || 'None'}
                </ThemedText>

                <Spacer />

                {/* NOTES */}
                <ThemedText title={true}>Notes</ThemedText>
                <Spacer height={10} />
                <ThemedText>{animal.notes || '-'}</ThemedText>

                {/* DELETE */}
                <ThemedButton style={styles.delete} onPress={handleDelete}>
                    <Text style={{ color: '#fff', textAlign: 'center' }}>
                        Delete
                    </Text>
                </ThemedButton>

            </ThemedCard>
        </ThemedView>
    )
}

export default AnimalDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "stretch",
    },
    name: {
        fontSize: 22,
        marginVertical: 10,
        fontWeight: 'bold'
    },
    card: {
        margin: 20
    },
    meta: {
        fontSize: 14,
        color: '#6B887A',
        marginBottom: 6
    },
    delete: {
        marginTop: 40,
        backgroundColor: Colors.warning,
        width: 200,
        alignSelf: 'center'
    }
})
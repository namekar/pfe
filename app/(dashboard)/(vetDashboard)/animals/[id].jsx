import { StyleSheet, Text, View } from 'react-native'
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

                {/* HEADER */}
                <View style={styles.header}>
                    <View>
                        <ThemedText style={styles.name}>{animal.name}</ThemedText>
                        <ThemedText style={styles.meta}>
                            {animal.species || "Unknown"} 
                            {animal.breed ? ` • ${animal.breed}` : ""}
                        </ThemedText>
                    </View>

                    <View style={styles.status}>
                        <ThemedText style={styles.statusText}>
                            Active
                        </ThemedText>
                    </View>
                </View>

                <Spacer />

                {/* OWNER */}
                <ThemedText style={styles.owner}>
                    Owner: {getOwnerName(animal.OwnerId)}
                </ThemedText>

                <Spacer />

                {/* BASIC INFO */}
                <ThemedText title={true}>Basic Info</ThemedText>
                <Spacer height={10} />

                <ThemedText style={styles.meta}>
                    {animal.sex || "Unknown"}
                    {animal.age ? ` • ${animal.age} yrs` : ""}
                    {animal.weight ? ` • ${animal.weight} kg` : ""}
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

    card: {
        margin: 20,
        borderRadius: 12,
        padding: 16,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    name: {
        fontSize: 22,
        fontWeight: 'bold'
    },

    status: {
        backgroundColor: "#DAF6E1",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },

    statusText: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#1F8A47",
    },

    meta: {
        fontSize: 14,
        color: '#6B887A',
        marginBottom: 6
    },

    owner: {
        fontSize: 14,
        fontWeight: "500",
    },

    delete: {
        marginTop: 40,
        backgroundColor: Colors.warning,
        width: 200,
        alignSelf: 'center'
    }
})
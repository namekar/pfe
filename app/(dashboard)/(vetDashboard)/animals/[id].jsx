import { StyleSheet, View, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Feather, FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'

import ThemedView from "../../../../components/ThemedView"
import ThemedText from "../../../../components/ThemedText"
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

    const getSpeciesIcon = (species) => {
        const iconMap = {
            'Dog': '🐕',
            'Cat': '🐈',
            'Bird': '🐦',
            'Rabbit': '🐰',
            'Hamster': '🐹',
            'Guinea Pig': '🐹',
            'Ferret': '🦦',
            'Hedgehog': '🦔',
            'Reptile': '🦎',
            'Snake': '🐍',
            'Turtle': '🐢',
            'Fish': '🐠',
            'Horse': '🐴',
            'Cow': '🐮',
            'Pig': '🐷',
            'Chicken': '🐔',
            'Duck': '🦆',
            'Fox': '🦊',
            'Monkey': '🐒',
            'Dolphin': '🐬',
            'Penguin': '🐧',
            'Other': '🐾'
        }
        return iconMap[species] || '🐾'
    }

    const getSexIcon = (sex) => {
        if (sex === 'Male') return '♂'
        if (sex === 'Female') return '♀'
        return '⚪'
    }

    const handleDelete = () => {
        Alert.alert(
            'Delete Animal',
            `Are you sure you want to delete ${animal?.name}? This action cannot be undone.`,
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Delete', 
                    style: 'destructive',
                    onPress: async () => {
                        await DeleteAnimal(id)
                        router.replace('/animals')
                    }
                }
            ]
        )
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
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header with back button and actions */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Feather name="arrow-left" size={24} color={Colors.primary} />
                    </TouchableOpacity>
                    <View style={styles.headerActions}>
                        <TouchableOpacity onPress={() => router.push(`/animals/edit/${animal.$id}`)} style={styles.actionButton}>
                            <Feather name="edit-2" size={20} color={Colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
                            <Feather name="trash-2" size={20} color="#FF3B30" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <View style={styles.heroIconContainer}>
                        <ThemedText style={styles.heroIcon}>
                            {getSpeciesIcon(animal.species)}
                        </ThemedText>
                    </View>
                    <ThemedText style={styles.heroName}>{animal.name}</ThemedText>
                    <View style={styles.statusBadge}>
                        <View style={styles.statusDot} />
                        <ThemedText style={styles.statusText}>Active</ThemedText>
                    </View>
                </View>

                <Spacer />

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <ThemedCard style={styles.statCard}>
                        <View style={styles.statIconContainer}>
                            <Ionicons name="paw" size={22} color={Colors.primary} />
                        </View>
                        <ThemedText style={styles.statValue}>{animal.species || 'Unknown'}</ThemedText>
                        <ThemedText style={styles.statLabel}>Species</ThemedText>
                    </ThemedCard>

                    <ThemedCard style={styles.statCard}>
                        <View style={styles.statIconContainer}>
                            <Feather name="activity" size={22} color={Colors.primary} />
                        </View>
                        <ThemedText style={styles.statValue}>{animal.age ? `${animal.age} yrs` : '—'}</ThemedText>
                        <ThemedText style={styles.statLabel}>Age</ThemedText>
                    </ThemedCard>

                    <ThemedCard style={styles.statCard}>
                        <View style={styles.statIconContainer}>
                            <Feather name="scale" size={22} color={Colors.primary} />
                        </View>
                        <ThemedText style={styles.statValue}>{animal.weight ? `${animal.weight} kg` : '—'}</ThemedText>
                        <ThemedText style={styles.statLabel}>Weight</ThemedText>
                    </ThemedCard>
                </View>

                <Spacer />

                {/* Basic Information Card */}
                <ThemedCard style={styles.infoCard}>
                    <View style={styles.cardHeader}>
                        <Feather name="info" size={20} color={Colors.primary} />
                        <ThemedText style={styles.cardTitle}>Basic Information</ThemedText>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <View style={styles.infoIcon}>
                            <Feather name="user" size={16} color="#6B887A" />
                        </View>
                        <View style={styles.infoContent}>
                            <ThemedText style={styles.infoLabel}>Owner</ThemedText>
                            <ThemedText style={styles.infoValue}>{getOwnerName(animal.OwnerId)}</ThemedText>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoIcon}>
                            <Feather name="heart" size={16} color="#6B887A" />
                        </View>
                        <View style={styles.infoContent}>
                            <ThemedText style={styles.infoLabel}>Sex</ThemedText>
                            <ThemedText style={styles.infoValue}>{getSexIcon(animal.sex)} {animal.sex || 'Unknown'}</ThemedText>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoIcon}>
                            <Feather name="grid" size={16} color="#6B887A" />
                        </View>
                        <View style={styles.infoContent}>
                            <ThemedText style={styles.infoLabel}>Breed</ThemedText>
                            <ThemedText style={styles.infoValue}>{animal.breed || 'Unknown'}</ThemedText>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoIcon}>
                            <Feather name="droplet" size={16} color="#6B887A" />
                        </View>
                        <View style={styles.infoContent}>
                            <ThemedText style={styles.infoLabel}>Color / Markings</ThemedText>
                            <ThemedText style={styles.infoValue}>{animal.color || 'Unknown'}</ThemedText>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoIcon}>
                            <Feather name="cpu" size={16} color="#6B887A" />
                        </View>
                        <View style={styles.infoContent}>
                            <ThemedText style={styles.infoLabel}>Microchip ID</ThemedText>
                            <ThemedText style={styles.infoValue}>{animal.microchip || 'Not registered'}</ThemedText>
                        </View>
                    </View>

                    {animal.dob && (
                        <View style={styles.infoRow}>
                            <View style={styles.infoIcon}>
                                <Feather name="calendar" size={16} color="#6B887A" />
                            </View>
                            <View style={styles.infoContent}>
                                <ThemedText style={styles.infoLabel}>Date of Birth</ThemedText>
                                <ThemedText style={styles.infoValue}>{animal.dob}</ThemedText>
                            </View>
                        </View>
                    )}
                </ThemedCard>

                {/* Medical Information Card */}
                {(animal.medical_history || animal.vaccinations) && (
                    <>
                        <Spacer />
                        <ThemedCard style={styles.infoCard}>
                            <View style={styles.cardHeader}>
                                <FontAwesome5 name="stethoscope" size={18} color={Colors.primary} />
                                <ThemedText style={styles.cardTitle}>Medical Information</ThemedText>
                            </View>

                            {animal.medical_history && (
                                <View style={styles.infoRow}>
                                    <View style={styles.infoIcon}>
                                        <Feather name="file-text" size={16} color="#6B887A" />
                                    </View>
                                    <View style={styles.infoContent}>
                                        <ThemedText style={styles.infoLabel}>Medical History</ThemedText>
                                        <ThemedText style={styles.infoValue}>{animal.medical_history}</ThemedText>
                                    </View>
                                </View>
                            )}

                            {animal.vaccinations && animal.vaccinations !== 'None' && (
                                <View style={styles.infoRow}>
                                    <View style={styles.infoIcon}>
                                        <Feather name="shield" size={16} color="#6B887A" />
                                    </View>
                                    <View style={styles.infoContent}>
                                        <ThemedText style={styles.infoLabel}>Vaccinations</ThemedText>
                                        <ThemedText style={styles.infoValue}>{animal.vaccinations}</ThemedText>
                                    </View>
                                </View>
                            )}
                        </ThemedCard>
                    </>
                )}

                {/* Description Card */}
                {animal.description && (
                    <>
                        <Spacer />
                        <ThemedCard style={styles.infoCard}>
                            <View style={styles.cardHeader}>
                                <Feather name="align-left" size={20} color={Colors.primary} />
                                <ThemedText style={styles.cardTitle}>Description</ThemedText>
                            </View>
                            <ThemedText style={styles.descriptionText}>{animal.description}</ThemedText>
                        </ThemedCard>
                    </>
                )}

                {/* Notes Card */}
                {animal.notes && (
                    <>
                        <Spacer />
                        <ThemedCard style={styles.infoCard}>
                            <View style={styles.cardHeader}>
                                <Feather name="edit-2" size={20} color={Colors.primary} />
                                <ThemedText style={styles.cardTitle}>Notes</ThemedText>
                            </View>
                            <ThemedText style={styles.descriptionText}>{animal.notes}</ThemedText>
                        </ThemedCard>
                    </>
                )}

                <Spacer height={40} />
            </ScrollView>
        </ThemedView>
    )
}

export default AnimalDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "stretch",
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
    },
    backButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: Colors.primary + '10',
    },
    headerActions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#F5F5F5',
    },
    heroSection: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    heroIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.primary + '15',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    heroIcon: {
        fontSize: 50,
    },
    heroName: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#DAF6E1',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#1F8A47',
        marginRight: 8,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F8A47',
    },
    statsGrid: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 12,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
    },
    statIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.primary + '10',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        textAlign: 'center',
    },
    statLabel: {
        fontSize: 11,
        color: '#6B887A',
        textAlign: 'center',
    },
    infoCard: {
        marginHorizontal: 16,
        padding: 16,
        borderRadius: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    infoIcon: {
        width: 32,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: '#6B887A',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '500',
    },
    descriptionText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#4A5B52',
    },
})
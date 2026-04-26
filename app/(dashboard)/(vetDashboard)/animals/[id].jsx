import { StyleSheet, View, ScrollView, TouchableOpacity, Platform } from 'react-native'
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
import CreateAnimalModal from '../createAnimalModal'
import { formatDate, formatDateForInput } from '../utils/formatDate'

const AnimalDetails = () => {
    const [animal, setAnimal] = useState(null)
    const [editModalVisible, setEditModalVisible] = useState(false)
    const { id } = useLocalSearchParams()
    const { fetchAnimalById, DeleteAnimal, owners } = useAnimals()
    const router = useRouter()

    const getOwnerName = (id) => {
        return owners?.find(o => o.$id === id)?.name || "Unknown"
    }

    const getOwnerPhone = (id) => {
        return owners?.find(o => o.$id === id)?.phone || ""
    }

    const getOwnerEmail = (id) => {
        return owners?.find(o => o.$id === id)?.email || ""
    }

    const getOwnerAddress = (id) => {
        return owners?.find(o => o.$id === id)?.address || ""
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
        if (window.confirm(`Are you sure you want to delete ${animal?.name}? This action cannot be undone.`)) {
            DeleteAnimal(id)
            router.replace('/animals')
        }
    }

    const generateHTMLContent = () => {
        const ownerName = getOwnerName(animal?.OwnerId);
        const ownerPhone = getOwnerPhone(animal?.OwnerId);
        const ownerEmail = getOwnerEmail(animal?.OwnerId);
        const ownerAddress = getOwnerAddress(animal?.OwnerId);
        
        const vetInfo = {
            clinicName: 'Veterinary Clinic',
            phone: '+216 XX XXX XXX',
            email: 'clinic@example.com',
            address: '123 Veterinary Street, Tunis, Tunisia'
        };
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carnet de Santé - ${animal?.name}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #f5f5f5; padding: 40px; }
        .booklet { max-width: 900px; margin: 0 auto; background: white; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #32B36A 0%, #1F8A47 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { font-size: 28px; margin-bottom: 5px; }
        .header p { opacity: 0.9; font-size: 14px; }
        .content { padding: 30px; }
        .section { margin-bottom: 30px; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; }
        .section-title { background: #F7FBF5; padding: 12px 20px; font-size: 18px; font-weight: bold; color: #32B36A; border-left: 4px solid #32B36A; }
        .section-content { padding: 20px; }
        .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
        .info-item { display: flex; flex-direction: column; }
        .info-label { font-size: 12px; color: #6B887A; margin-bottom: 4px; text-transform: uppercase; }
        .info-value { font-size: 16px; font-weight: 500; color: #0E2A1F; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
        th { background: #F7FBF5; color: #32B36A; font-weight: 600; }
        .medical-box, .notes-box { background: #F7FBF5; padding: 15px; border-radius: 8px; line-height: 1.6; color: #4A5B52; }
        .stamp-area { margin-top: 40px; padding: 30px; border: 2px dashed #32B36A; border-radius: 12px; text-align: center; background: #F7FBF5; }
        .stamp-area h3 { color: #32B36A; margin-bottom: 15px; }
        .footer { background: #F7FBF5; padding: 20px; text-align: center; font-size: 12px; color: #6B887A; border-top: 1px solid #e0e0e0; }
        @media print { body { background: white; padding: 0; } .booklet { box-shadow: none; } .header { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    </style>
</head>
<body>
    <div class="booklet">
        <div class="header">
            <h1>📋 CARNET DE SANTÉ</h1>
            <p>Health Booklet</p>
        </div>
        <div class="content">
            <div class="section">
                <div class="section-title">🐾 Animal Information</div>
                <div class="section-content">
                    <div class="info-grid">
                        <div class="info-item"><div class="info-label">Name</div><div class="info-value">${animal?.name || '—'}</div></div>
                        <div class="info-item"><div class="info-label">Species</div><div class="info-value">${animal?.species || '—'}</div></div>
                        <div class="info-item"><div class="info-label">Breed</div><div class="info-value">${animal?.breed || '—'}</div></div>
                        <div class="info-item"><div class="info-label">Sex</div><div class="info-value">${getSexIcon(animal?.sex)} ${animal?.sex || '—'}</div></div>
                        <div class="info-item"><div class="info-label">Age</div><div class="info-value">${animal?.age ? `${animal?.age} years` : '—'}</div></div>
                        <div class="info-item"><div class="info-label">Weight</div><div class="info-value">${animal?.weight ? `${animal?.weight} kg` : '—'}</div></div>
                        <div class="info-item"><div class="info-label">Color</div><div class="info-value">${animal?.color || '—'}</div></div>
                        <div class="info-item"><div class="info-label">Microchip</div><div class="info-value">${animal?.microchip || '—'}</div></div>
                        ${animal?.dob ? `<div class="info-item"><div class="info-label">Date of Birth</div><div class="info-value">${formatDate(animal.dob)}</div></div>` : ''}
                    </div>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">👤 Owner Information</div>
                <div class="section-content">
                    <div class="info-grid">
                        <div class="info-item"><div class="info-label">Owner Name</div><div class="info-value">${ownerName || '—'}</div></div>
                        <div class="info-item"><div class="info-label">Phone</div><div class="info-value">${ownerPhone || '—'}</div></div>
                        <div class="info-item"><div class="info-label">Email</div><div class="info-value">${ownerEmail || '—'}</div></div>
                        <div class="info-item"><div class="info-label">Address</div><div class="info-value">${ownerAddress || '—'}</div></div>
                    </div>
                </div>
            </div>
            
            ${animal?.vaccinations && animal?.vaccinations !== 'None' ? `
            <div class="section">
                <div class="section-title">💉 Vaccination Record</div>
                <div class="section-content">
                    <table>
                        <thead>
                            <tr><th>Vaccine</th><th>Date Given</th><th>Next Due</th></tr>
                        </thead>
                        <tbody>
                            ${animal.vaccinations.split('; ').map(vacc => {
                                const nameMatch = vacc.match(/^([^(]+)/);
                                const dateMatch = vacc.match(/\(([^)]+)\)/);
                                const dueMatch = vacc.match(/due:\s*([^\s\[]+)/);
                                return `<tr><td>${nameMatch ? nameMatch[0].trim() : vacc}</td><td>${dateMatch ? dateMatch[1] : '—'}</td><td>${dueMatch ? dueMatch[1] : '—'}</td></tr>`;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            ` : ''}
            
            ${animal?.medical_history ? `
            <div class="section">
                <div class="section-title">📋 Medical History</div>
                <div class="section-content"><div class="medical-box">${animal.medical_history}</div></div>
            </div>
            ` : ''}
            
            ${animal?.notes ? `
            <div class="section">
                <div class="section-title">📝 Notes</div>
                <div class="section-content"><div class="notes-box">${animal.notes}</div></div>
            </div>
            ` : ''}
            
            <div class="stamp-area">
                <h3>🏥 Veterinary Stamp & Signature</h3>
                <p style="margin-top: 10px;">Date: ${new Date().toLocaleDateString()}</p>
                <p style="margin-top: 20px;">_______________________________</p>
            </div>
        </div>
        <div class="footer">
            <p>${vetInfo.clinicName} | ${vetInfo.phone} | ${vetInfo.email}</p>
            <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
    </div>
</body>
</html>`;
    };

    const handleDownloadHTML = () => {
        const htmlContent = generateHTMLContent();
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Carnet_Sante_${animal?.name?.replace(/[^a-z0-9]/gi, '_') || 'animal'}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('✅ Health booklet downloaded! Open the file in your browser, then press Ctrl+P (or Cmd+P) to save as PDF.');
    };

    const handleCopyToClipboard = () => {
        const ownerName = getOwnerName(animal?.OwnerId);
        const message = `🐾 *CARNET DE SANTÉ - ${animal?.name}* 🐾\n\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `🐕 ANIMAL INFORMATION\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `Name: ${animal?.name}\n` +
            `Species: ${animal?.species || '—'}\n` +
            `Breed: ${animal?.breed || '—'}\n` +
            `Sex: ${animal?.sex || '—'}\n` +
            `Age: ${animal?.age || '—'} years\n` +
            `Weight: ${animal?.weight || '—'} kg\n` +
            `Color: ${animal?.color || '—'}\n` +
            `Microchip: ${animal?.microchip || '—'}\n` +
            `DOB: ${formatDate(animal?.dob)}\n\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `👤 OWNER INFORMATION\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `Owner: ${ownerName}\n\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `💉 VACCINATIONS\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `${animal?.vaccinations?.split('; ').map(v => `• ${v}`).join('\n') || 'None'}\n\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `📋 MEDICAL HISTORY\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `${animal?.medical_history || 'None'}\n\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `📝 NOTES\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `${animal?.notes || 'None'}\n\n` +
            `Generated on: ${new Date().toLocaleString()}`;
        
        navigator.clipboard.writeText(message);
        alert('✅ Health information copied to clipboard!\n\nYou can now paste it into WhatsApp or any messaging app.');
    };

    const handleEmailPDF = () => {
        const htmlContent = generateHTMLContent();
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        alert(`📧 To email the health booklet:\n\n1. The file will now download\n2. Attach it to an email\n3. Send to the owner\n\nAlternatively, you can save the file and share it via any method.`);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `Carnet_Sante_${animal?.name?.replace(/[^a-z0-9]/gi, '_') || 'animal'}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const showShareOptions = () => {
        const choice = window.confirm(
            `Share ${animal?.name}'s Health Booklet:\n\n` +
            `OK - Download HTML File (can print to PDF)\n` +
            `Cancel - Other sharing options`
        );
        
        if (choice) {
            handleDownloadHTML();
        } else {
            const secondChoice = window.confirm(
                `Choose sharing method:\n\n` +
                `OK - Copy Text to Clipboard (for WhatsApp)\n` +
                `Cancel - Email the booklet`
            );
            if (secondChoice) {
                handleCopyToClipboard();
            } else {
                handleEmailPDF();
            }
        }
    };

    const loadAnimal = async () => {
        const animalData = await fetchAnimalById(id)
        setAnimal(animalData)
    }

    useEffect(() => {
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
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Feather name="arrow-left" size={24} color={Colors.primary} />
                    </TouchableOpacity>
                    <View style={styles.headerActions}>
                        <TouchableOpacity onPress={showShareOptions} style={styles.actionButton}>
                            <Feather name="share-2" size={20} color={Colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setEditModalVisible(true)} style={styles.actionButton}>
                            <Feather name="edit-2" size={20} color={Colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
                            <Feather name="trash-2" size={20} color="#FF3B30" />
                        </TouchableOpacity>
                    </View>
                </View>

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
                            <Feather name="bar-chart-2" size={22} color={Colors.primary} />
                        </View>
                        <ThemedText style={styles.statValue}>{animal.weight ? `${animal.weight} kg` : '—'}</ThemedText>
                        <ThemedText style={styles.statLabel}>Weight</ThemedText>
                    </ThemedCard>
                </View>

                <Spacer />

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
                                <ThemedText style={styles.infoValue}>{formatDate(animal.dob)}</ThemedText>
                            </View>
                        </View>
                    )}
                </ThemedCard>

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

            <CreateAnimalModal
                visible={editModalVisible}
                onClose={() => setEditModalVisible(false)}
                editingAnimal={animal}
                onSuccess={() => {
                    setEditModalVisible(false)
                    loadAnimal()
                }}
            />
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
        padding: 10,
        borderRadius: 8,
        backgroundColor: Colors.primary + '10',
        minWidth: 40,
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
    },
    headerActions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#F5F5F5',
        minWidth: 40,
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
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
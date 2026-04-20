import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'

import ThemedText from "../../../components/ThemedText"
import ThemedTextInput from "../../../components/ThemedTextInput"
import { useAnimals } from "../../../hooks/useAnimals"

// Theme tokens matching first design
const COLORS = {
  primary: '#32B36A',
  primaryDark: '#1F8A47',
  background: '#F7FBF5',
  card: '#E6F7EA',
  cardSelected: '#DAF6E1',
  text: '#0E2A1F',
  muted: '#6B887A',
  danger: '#D9534F'
}

const SEX_OPTIONS = ['Male', 'Female', 'Unknown']
const SPECIES_OPTIONS = ['Dog', 'Cat', 'Other']

const uid = () => Math.random().toString(36).slice(2, 9)

const Create = () => {
  useEffect(() => {
    fetchOwners()
  }, [])
  // Identity
  const [photo, setPhoto] = useState(null)
  const [name, setName] = useState("")
  const [species, setSpecies] = useState("")
  const [breed, setBreed] = useState("")
  const [sex, setSex] = useState("Unknown")
  const [dob, setDob] = useState(null)
  const [microchip, setMicrochip] = useState("")
  const [colorText, setColorText] = useState("")
  const [description, setDescription] = useState("")
  const BREEDS = {
  Dog: [
    "Labrador Retriever",
    "German Shepherd",
    "Golden Retriever",
    "Bulldog",
    "Poodle"
  ],
  Cat: [
    "Persian",
    "Maine Coon",
    "Siamese",
    "Bengal",
    "Sphynx"
  ]
}
  
  // Physical
  const [age, setAge] = useState("")
  const [weight, setWeight] = useState("")
  
  // Medical
  const [medical_history, setHistory] = useState("")
  const [vaccinations, setVaccinations] = useState([])
  const [showVaccinations, setShowVaccinations] = useState(false)
  const [vaccEditorVisible, setVaccEditorVisible] = useState(false)
  const [vaccEditorItem, setVaccEditorItem] = useState({ name: '', date: '', nextDue: '' })
  const [notes, setnotes] = useState("")
  
  // Owner
  
  const [selectedOwnerId, setSelectedOwnerId] = useState(null)
  const [ownerModalVisible, setOwnerModalVisible] = useState(false)
  const [newOwner, setNewOwner] = useState({ name: '', email: '', phone: '' })
  
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const { createAnimal, owners, fetchOwners, createOwner } = useAnimals()
  const router = useRouter()

  const isSaveEnabled = name.trim() && species && selectedOwnerId

  // Helper to format date
  const formatDate = (date) => {
    if (!date) return ''
    return date.toISOString().split('T')[0]
  }

  // Owner functions
  const addOwnerInline = async () => {
    if (!newOwner.name || !newOwner.email || !newOwner.phone) {
      Alert.alert('Missing info', 'Please fill name, email and phone.')
      return
    }

    const owner = await createOwner(newOwner)

    setSelectedOwnerId(owner.$id)
    setNewOwner({ name: '', email: '', phone: '' })
    setOwnerModalVisible(false)
  }

  // Vaccination functions
  const openVaccEditor = () => {
    setVaccEditorItem({ name: '', date: '', nextDue: '' })
    setVaccEditorVisible(true)
  }
  
  const saveVaccination = () => {
    if (!vaccEditorItem.name) {
      Alert.alert('Validation', 'Vaccine name is required.')
      return
    }
    setVaccinations((s) => [{ id: uid(), ...vaccEditorItem }, ...s])
    setVaccEditorVisible(false)
    setShowVaccinations(true)
  }

  // Format vaccinations for backend
  const formatVaccinationsForBackend = () => {
    return vaccinations.map(v => `${v.name}${v.date ? ` (${v.date})` : ''}${v.nextDue ? ` - due: ${v.nextDue}` : ''}`).join('; ')
  }

  async function handleSubmit() {
    const e = {}
    if (!name.trim()) e.name = 'Pet name is required'
    if (!species) e.species = 'Species is required'
    if (!selectedOwnerId) e.owner = 'Owner is required'
    setErrors(e)
    
    if (Object.keys(e).length > 0) {
      Alert.alert('Validation', 'Please fill required fields.')
      return
    }

    setLoading(true)

    await createAnimal({
      name,
      description,
      species,
      breed,
      medical_history,
      vaccinations: formatVaccinationsForBackend(),
      notes,
      sex: sex.toLowerCase(),
      age: parseInt(age, 10) || 0,
      weight: parseInt(weight, 10) || 0,
      microchip,
      color: colorText,
      dob: dob ? formatDate(dob) : '',
      OwnerId: selectedOwnerId
    })

    // Reset form
    setSpecies("")
    setName("")
    setDescription("")
    setBreed("")
    setWeight("")
    setAge("")
    setHistory("")
    setVaccinations([])
    setnotes("")
    setSex("Unknown")
    setMicrochip("")
    setColorText("")
    setDob(null)
    setSelectedOwnerId(null)
    setPhoto(null)

    router.replace("/animals")
    setLoading(false)
  }

  // Stub for image picker
  const pickImage = () => {
    Alert.alert('Image Picker', 'Photo upload would be implemented with expo-image-picker')
    setPhoto({ uri: 'https://placekitten.com/400/400', name: 'pet.jpg' })
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container}>
          <ThemedText style={styles.pageTitle}>Create Animal</ThemedText>
          <ThemedText style={styles.subtitle}>Enter the animal identity details. Required fields: Pet name, Species, Owner.</ThemedText>

          {/* Identity card */}
          <View style={styles.card}>
            <View style={styles.row}>
              <TouchableOpacity style={styles.photoUpload} onPress={pickImage} activeOpacity={0.8}>
                {photo ? (
                  <Image source={{ uri: photo.uri }} style={styles.photoPreview} />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <ThemedText style={{ color: COLORS.primary, fontWeight: '700' }}>Upload photo</ThemedText>
                  </View>
                )}
              </TouchableOpacity>

              <View style={{ flex: 1, marginLeft: 16 }}>
                <ThemedText style={styles.label}>Pet name *</ThemedText>
                <ThemedTextInput 
                  value={name} 
                  onChangeText={setName} 
                  placeholder="e.g., Bella" 
                  style={[styles.input, errors.name && styles.inputError]} 
                />
                {errors.name ? <ThemedText style={styles.errorText}>{errors.name}</ThemedText> : null}

                <View style={styles.formRow}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <ThemedText style={styles.label}>Species *</ThemedText>
                    <View style={styles.segment}>
                      {SPECIES_OPTIONS.map((s) => (
                        <TouchableOpacity 
                          key={s} 
                          onPress={() => setSpecies(s)} 
                          style={[styles.segmentItem, species === s && { backgroundColor: COLORS.cardSelected }]}
                        >
                          <ThemedText style={{ color: species === s ? COLORS.primaryDark : COLORS.text }}>{s}</ThemedText>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={{ flex: 1 }}>
                    <ThemedText style={styles.label}>Breed</ThemedText>
                    {species && BREEDS[species] ? (
                      <View style={styles.segment}>
                        {BREEDS[species].map((b) => (
                          <TouchableOpacity
                            key={b}
                            onPress={() => setBreed(b)}
                            style={[
                              styles.segmentItem,
                              breed === b && { backgroundColor: COLORS.cardSelected }
                            ]}
                          >
                            <ThemedText>{b}</ThemedText>
                          </TouchableOpacity>
                        ))}
                      </View>
                    ) : (
                      <ThemedTextInput
                        value={breed}
                        onChangeText={setBreed}
                        placeholder="Breed"
                        style={styles.input}
                      />
                    )}
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <ThemedText style={styles.label}>Sex</ThemedText>
                    <View style={styles.segment}>
                      {SEX_OPTIONS.map((s) => (
                        <TouchableOpacity 
                          key={s} 
                          onPress={() => setSex(s)} 
                          style={[styles.segmentItem, sex === s && { backgroundColor: COLORS.cardSelected }]}
                        >
                          <ThemedText style={{ color: sex === s ? COLORS.primaryDark : COLORS.text }}>{s}</ThemedText>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={{ flex: 1 }}>
                    <ThemedText style={styles.label}>Date of birth</ThemedText>
                    <Pressable onPress={() => setDob(new Date())}>
                      <ThemedTextInput 
                        style={styles.input} 
                        value={dob ? formatDate(dob) : ''} 
                        placeholder="YYYY-MM-DD"
                        editable={false}
                      />
                    </Pressable>
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <ThemedText style={styles.label}>Microchip ID</ThemedText>
                    <ThemedTextInput value={microchip} onChangeText={setMicrochip} placeholder="Microchip number" style={styles.input} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <ThemedText style={styles.label}>Color / Markings</ThemedText>
                    <ThemedTextInput value={colorText} onChangeText={setColorText} placeholder="e.g., brown & white" style={styles.input} />
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Physical card */}
          <View style={styles.card}>
            <ThemedText style={styles.sectionTitle}>Physical</ThemedText>
            <View style={styles.formRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <ThemedText style={styles.label}>Age (years)</ThemedText>
                <ThemedTextInput value={age} onChangeText={setAge} placeholder="Age" style={styles.input} keyboardType="numeric" />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.label}>Weight (lbs)</ThemedText>
                <ThemedTextInput value={weight} onChangeText={setWeight} placeholder="Weight" style={styles.input} keyboardType="numeric" />
              </View>
            </View>
          </View>

          {/* Owner assignment */}
          <View style={styles.card}>
            <ThemedText style={styles.sectionTitle}>Owner assignment *</ThemedText>
            <View style={{ marginTop: 8 }}>
              <FlatList
                data={owners}
                keyExtractor={(o) => o.$id}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => {
                  const isSelected = item.$id === selectedOwnerId
                  return (
                    <TouchableOpacity 
                      onPress={() => setSelectedOwnerId(item.$id)} 
                      style={[styles.ownerChip, isSelected && { borderColor: COLORS.primary, backgroundColor: COLORS.cardSelected }]}
                    >
                      <ThemedText style={{ fontWeight: '600', color: isSelected ? COLORS.primaryDark : COLORS.text }}>{item.name}</ThemedText>
                      <ThemedText style={styles.mutedText}>{item.email}</ThemedText>
                    </TouchableOpacity>
                  )
                }}
              />
              <View style={{ flexDirection: 'row', marginTop: 12 }}>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => setOwnerModalVisible(true)}>
                  <ThemedText style={{ color: COLORS.primary }}>+ Add Owner</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.secondaryButton, { marginLeft: 8 }]} onPress={() => Alert.alert('Search', 'Open owner search (stub)')}>
                  <ThemedText style={{ color: COLORS.primary }}>Search owners</ThemedText>
                </TouchableOpacity>
              </View>
              {errors.owner ? <ThemedText style={styles.errorText}>{errors.owner}</ThemedText> : null}
            </View>
          </View>

          {/* Medical card */}
          <View style={styles.card}>
            <ThemedText style={styles.sectionTitle}>Medical</ThemedText>
            <ThemedText style={styles.label}>History</ThemedText>
            <ThemedTextInput value={medical_history} onChangeText={setHistory} placeholder="Medical history" style={styles.input} multiline />
          </View>

          {/* Compact Vaccinations */}
          <View style={styles.card}>
            <View style={styles.sectionHeaderRow}>
              <ThemedText style={styles.sectionTitle}>Vaccinations (optional)</ThemedText>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={openVaccEditor}>
                  <ThemedText style={{ color: COLORS.primary }}>+ Add</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowVaccinations((s) => !s)} style={{ marginLeft: 12 }}>
                  <ThemedText style={{ color: COLORS.primary }}>{showVaccinations ? 'Collapse' : 'Expand'}</ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            {showVaccinations ? (
              <View style={{ marginTop: 12 }}>
                {vaccinations.length === 0 ? 
                  <ThemedText style={styles.mutedText}>No vaccinations added.</ThemedText> : 
                  vaccinations.map((v) => (
                    <View key={v.id} style={styles.listItem}>
                      <View style={{ flex: 1 }}>
                        <ThemedText style={{ fontWeight: '600' }}>{v.name}</ThemedText>
                        <ThemedText style={styles.mutedText}>{v.date}{v.nextDue ? ` • next: ${v.nextDue}` : ''}</ThemedText>
                      </View>
                      <TouchableOpacity onPress={() => setVaccinations((s) => s.filter((i) => i.id !== v.id))}>
                        <ThemedText style={{ color: COLORS.danger }}>Delete</ThemedText>
                      </TouchableOpacity>
                    </View>
                  ))
                }
              </View>
            ) : (
              <ThemedText style={styles.mutedText}>{vaccinations.length} item{vaccinations.length !== 1 ? 's' : ''}</ThemedText>
            )}
          </View>

          {/* Notes card */}
          <View style={styles.card}>
            <ThemedText style={styles.sectionTitle}>Notes</ThemedText>
            <ThemedTextInput
              value={notes}
              onChangeText={setnotes}
              placeholder="Additional notes..."
              style={styles.multiline}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Vaccination editor modal */}
          <Modal visible={vaccEditorVisible} transparent animationType="slide" onRequestClose={() => setVaccEditorVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalCard}>
                <ThemedText style={styles.sectionTitle}>Add Vaccination</ThemedText>
                <ThemedText style={styles.label}>Vaccine name *</ThemedText>
                <ThemedTextInput value={vaccEditorItem.name} onChangeText={(t) => setVaccEditorItem((s) => ({ ...s, name: t }))} style={styles.input} />
                <ThemedText style={[styles.label, { marginTop: 12 }]}>Date</ThemedText>
                <ThemedTextInput value={vaccEditorItem.date} onChangeText={(t) => setVaccEditorItem((s) => ({ ...s, date: t }))} placeholder="YYYY-MM-DD" style={styles.input} />
                <ThemedText style={[styles.label, { marginTop: 12 }]}>Next due (optional)</ThemedText>
                <ThemedTextInput value={vaccEditorItem.nextDue} onChangeText={(t) => setVaccEditorItem((s) => ({ ...s, nextDue: t }))} placeholder="YYYY-MM-DD" style={styles.input} />

                <View style={{ flexDirection: 'row', marginTop: 16 }}>
                  <TouchableOpacity style={styles.primaryButton} onPress={saveVaccination}>
                    <ThemedText style={styles.primaryButtonText}>Save</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.secondaryButton, { marginLeft: 12 }]} onPress={() => setVaccEditorVisible(false)}>
                    <ThemedText style={{ color: COLORS.primary }}>Cancel</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Owner add modal */}
          <Modal visible={ownerModalVisible} transparent animationType="slide" onRequestClose={() => setOwnerModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalCard}>
                <ThemedText style={styles.sectionTitle}>Add Owner</ThemedText>
                <ThemedText style={styles.label}>Full name *</ThemedText>
                <ThemedTextInput value={newOwner.name} onChangeText={(t) => setNewOwner((s) => ({ ...s, name: t }))} style={styles.input} />
                <ThemedText style={[styles.label, { marginTop: 12 }]}>Email *</ThemedText>
                <ThemedTextInput value={newOwner.email} onChangeText={(t) => setNewOwner((s) => ({ ...s, email: t }))} style={styles.input} keyboardType="email-address" />
                <ThemedText style={[styles.label, { marginTop: 12 }]}>Phone *</ThemedText>
                <ThemedTextInput value={newOwner.phone} onChangeText={(t) => setNewOwner((s) => ({ ...s, phone: t }))} style={styles.input} keyboardType="phone-pad" />

                <View style={{ flexDirection: 'row', marginTop: 16 }}>
                  <TouchableOpacity style={styles.primaryButton} onPress={addOwnerInline}>
                    <ThemedText style={styles.primaryButtonText}>Add Owner</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.secondaryButton, { marginLeft: 12 }]} onPress={() => setOwnerModalVisible(false)}>
                    <ThemedText style={{ color: COLORS.primary }}>Cancel</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <View style={{ height: 80 }} />
        </ScrollView>

        {/* Sticky CTA */}
        <View style={styles.stickyBar}>
          <TouchableOpacity 
            style={[styles.primaryButton, !isSaveEnabled && { opacity: 0.5 }]} 
            disabled={!isSaveEnabled || loading} 
            onPress={handleSubmit}
          >
            <ThemedText style={styles.primaryButtonText}>
              {loading ? "Saving..." : "Save"}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 20, paddingBottom: 40 },
  
  pageTitle: { fontSize: 22, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  subtitle: { color: COLORS.muted, marginBottom: 16, fontSize: 14 },
  
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#00000008',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1
  },
  
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  
  photoUpload: {
    width: 120,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center'
  },
  photoPreview: { width: '100%', height: '100%', resizeMode: 'cover' },
  photoPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  
  label: { fontSize: 13, color: COLORS.muted, marginBottom: 6 },
  input: {
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 14
  },
  inputError: {
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 11,
    marginTop: 4,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  segment: {
    flexDirection: 'row',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  ownerChip: {
    padding: 12,
    marginRight: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minWidth: 120,
  },
  mutedText: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
  },
  stickyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  multiline: {
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
  }
})

export default Create
import { Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'

// Only import these on native platforms
import * as ImagePicker from 'expo-image-picker'

import { useAnimals } from "../../../hooks/useAnimals"
import { COLORS, styles as globalStyles } from './CreateAnimalForm.styles'

// Native-only imports
let DateTimePicker = null
if (Platform.OS !== 'web') {
  DateTimePicker = require('@react-native-community/datetimepicker').default
}

const SEX_OPTIONS = ['Male', 'Female', 'Unknown']
const SPECIES_OPTIONS = ['Dog', 'Cat', 'Other']

// Extended list of domestic animals for "Other" category
const OTHER_SPECIES_OPTIONS = [
  "Rabbit",
  "Guinea Pig",
  "Hamster",
  "Gerbil",
  "Rat",
  "Mouse",
  "Ferret",
  "Chinchilla",
  "Hedgehog",
  "Bird - Parrot",
  "Bird - Cockatiel",
  "Bird - Budgie",
  "Bird - Canary",
  "Bird - Finch",
  "Bird - Macaw",
  "Bird - African Grey",
  "Bird - Cockatoo",
  "Bird - Lovebird",
  "Reptile - Bearded Dragon",
  "Reptile - Leopard Gecko",
  "Reptile - Ball Python",
  "Reptile - Corn Snake",
  "Reptile - Iguana",
  "Reptile - Turtle",
  "Reptile - Tortoise",
  "Reptile - Chameleon",
  "Amphibian - Frog",
  "Amphibian - Toad",
  "Amphibian - Salamander",
  "Amphibian - Newt",
  "Fish - Goldfish",
  "Fish - Betta",
  "Fish - Guppy",
  "Fish - Koi",
  "Farm Animal - Horse",
  "Farm Animal - Pony",
  "Farm Animal - Donkey",
  "Farm Animal - Cow",
  "Farm Animal - Goat",
  "Farm Animal - Sheep",
  "Farm Animal - Pig",
  "Farm Animal - Chicken",
  "Farm Animal - Duck",
  "Farm Animal - Goose",
  "Farm Animal - Llama",
  "Farm Animal - Alpaca",
  "Exotic - Sugar Glider",
  "Exotic - Wallaby",
  "Exotic - Kangaroo",
  "Exotic - Fox",
  "Exotic - Raccoon",
  "Exotic - Skunk",
  "Exotic - Monkey",
  "Exotic - Sloth",
  "Exotic - Anteater",
  "Exotic - Armadillo",
  "Marine - Dolphin",
  "Marine - Seal",
  "Marine - Sea Lion",
  "Marine - Penguin",
  "Marine - Sea Turtle",
  "Other - Please specify"
]

const uid = () => Math.random().toString(36).slice(2, 9)

export default function CreateAnimalForm() {
  useEffect(() => {
    fetchOwners()
    if (Platform.OS !== 'web') {
      requestMediaPermissions()
    }
  }, [])
  
  // Identity
  const [photo, setPhoto] = useState(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [name, setName] = useState("")
  const [species, setSpecies] = useState("")
  const [breed, setBreed] = useState("")
  const [sex, setSex] = useState("Unknown")
  const [dob, setDob] = useState(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [microchip, setMicrochip] = useState("")
  const [colorText, setColorText] = useState("")
  const [description, setDescription] = useState("")
  
  // Other species modal
  const [showOtherSpeciesModal, setShowOtherSpeciesModal] = useState(false)
  const [customSpecies, setCustomSpecies] = useState("")
  
  const BREEDS = {
    Dog: [
      "Labrador Retriever",
      "German Shepherd",
      "Golden Retriever",
      "Bulldog",
      "Poodle",
      "Beagle",
      "Rottweiler",
      "Yorkshire Terrier",
      "Boxer",
      "Dachshund",
      "Siberian Husky",
      "Great Dane"
    ],
    Cat: [
      "Persian",
      "Maine Coon",
      "Siamese",
      "Bengal",
      "Sphynx",
      "Ragdoll",
      "British Shorthair",
      "Abyssinian",
      "Scottish Fold",
      "Birman"
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

  // Request permissions for camera roll (native only)
  const requestMediaPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission Needed', 'Please grant camera roll permissions to upload photos.')
      }
    }
  }

  // Helper to format date
  const formatDate = (date) => {
    if (!date) return ''
    return date.toISOString().split('T')[0]
  }

  // Format date for display (YYYY-MM-DD)
  const formatDateForDisplay = (date) => {
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Handle date change (native)
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false)
    if (selectedDate) {
      setDob(selectedDate)
    }
  }

  // Format microchip - only numbers, max 15 digits
  const handleMicrochipChange = (text) => {
    const numbersOnly = text.replace(/[^0-9]/g, '')
    const truncated = numbersOnly.slice(0, 15)
    setMicrochip(truncated)
  }

  // Format age - only numbers, max 3 digits
  const handleAgeChange = (text) => {
    const numbersOnly = text.replace(/[^0-9]/g, '')
    const truncated = numbersOnly.slice(0, 3)
    setAge(truncated)
  }

  // Format weight - only numbers with optional decimal, max 2 decimal places
  const handleWeightChange = (text) => {
    let formatted = text.replace(/[^0-9.]/g, '')
    const parts = formatted.split('.')
    if (parts.length > 2) {
      formatted = parts[0] + '.' + parts.slice(1).join('')
    }
    if (parts[1] && parts[1].length > 2) {
      formatted = parts[0] + '.' + parts[1].slice(0, 2)
    }
    setWeight(formatted)
  }

  // Photo picker function
  const pickImage = async () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = (e) => {
        const file = e.target.files[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (event) => {
            setPhoto({ uri: event.target.result, name: file.name, type: file.type })
          }
          reader.readAsDataURL(file)
        }
      }
      input.click()
      return
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      })

      if (!result.canceled) {
        setUploadingPhoto(true)
        setTimeout(() => {
          setPhoto(result.assets[0])
          setUploadingPhoto(false)
        }, 500)
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image')
      setUploadingPhoto(false)
    }
  }

  // Take photo with camera (native only)
  const takePhoto = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'Camera is not available on web. Please upload a photo instead.')
      return
    }

    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission Needed', 'Please grant camera permissions to take photos.')
        return
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      if (!result.canceled) {
        setUploadingPhoto(true)
        setTimeout(() => {
          setPhoto(result.assets[0])
          setUploadingPhoto(false)
        }, 500)
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo')
      setUploadingPhoto(false)
    }
  }

  // Show photo options
  const showPhotoOptions = () => {
    if (Platform.OS === 'web') {
      pickImage()
      return
    }

    Alert.alert(
      'Upload Photo',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' }
      ],
      { cancelable: true }
    )
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

  // Handle species selection
  const handleSpeciesSelect = (selectedSpecies) => {
    if (selectedSpecies === 'Other') {
      setShowOtherSpeciesModal(true)
    } else {
      setSpecies(selectedSpecies)
      setBreed("")
      setCustomSpecies("")
    }
  }

  const handleOtherSpeciesSelect = (selectedOtherSpecies) => {
    setSpecies(selectedOtherSpecies)
    setBreed("")
    setShowOtherSpeciesModal(false)
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
      weight: parseFloat(weight) || 0,
      microchip,
      color: colorText,
      dob: dob ? formatDate(dob) : '',
      OwnerId: selectedOwnerId,
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
    setCustomSpecies("")

    router.replace("/animals")
    setLoading(false)
  }

  return (
    <SafeAreaView style={globalStyles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView 
          contentContainerStyle={globalStyles.container} 
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          removeClippedSubviews={false}
          nestedScrollEnabled={true}
        >
          
          {/* Page Title */}
          <Text style={globalStyles.pageTitle}>Create Animal</Text>
          <Text style={globalStyles.subtitle}>Enter the animal identity details. Required fields: Pet name, Species, Owner.</Text>

          {/* Two Column Layout */}
          <View style={styles.twoColumnLayout}>
            
            {/* LEFT COLUMN (70%) */}
            <View style={styles.leftColumn}>
              
              {/* Identity Card */}
              <View style={globalStyles.card}>
                <View style={globalStyles.row}>
                  {/* Photo Upload */}
                  <TouchableOpacity 
                    style={globalStyles.photoUpload} 
                    onPress={showPhotoOptions}
                    disabled={uploadingPhoto}
                  >
                    {uploadingPhoto ? (
                      <ActivityIndicator size="large" color={COLORS.primary} />
                    ) : photo ? (
                      <Image source={{ uri: photo.uri }} style={globalStyles.photoPreview} />
                    ) : (
                      <View style={globalStyles.photoPlaceholder}>
                        <Feather name="camera" size={32} color={COLORS.primary} />
                        <Text style={globalStyles.photoPlaceholderText}>Upload photo</Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  <View style={{ flex: 1, marginLeft: 16 }}>
                    <Text style={globalStyles.label}>Pet name *</Text>
                    <TextInput 
                      value={name} 
                      onChangeText={setName} 
                      placeholder="e.g., Bella" 
                      style={[globalStyles.input, errors.name && globalStyles.inputError]} 
                    />
                    {errors.name ? <Text style={globalStyles.errorText}>{errors.name}</Text> : null}
                  </View>
                </View>

                <View style={globalStyles.formRow}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={globalStyles.label}>Species *</Text>
                    
                    {/* Species Buttons with Icons */}
                    <View style={styles.speciesButtonGroup}>
                      <TouchableOpacity
                        style={[
                          styles.speciesButton,
                          species === 'Dog' && styles.speciesButtonActive
                        ]}
                        onPress={() => handleSpeciesSelect('Dog')}
                      >
                        <FontAwesome5 name="dog" size={20} color={species === 'Dog' ? COLORS.primary : COLORS.text} />
                        <Text style={[
                          styles.speciesButtonText,
                          species === 'Dog' && styles.speciesButtonTextActive
                        ]}>
                          Dog
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.speciesButton,
                          species === 'Cat' && styles.speciesButtonActive
                        ]}
                        onPress={() => handleSpeciesSelect('Cat')}
                      >
                        <FontAwesome5 name="cat" size={20} color={species === 'Cat' ? COLORS.primary : COLORS.text} />
                        <Text style={[
                          styles.speciesButtonText,
                          species === 'Cat' && styles.speciesButtonTextActive
                        ]}>
                          Cat
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.speciesButton,
                          species === 'Other' && styles.speciesButtonActive
                        ]}
                        onPress={() => handleSpeciesSelect('Other')}
                      >
                        <MaterialCommunityIcons name="paw" size={20} color={species === 'Other' ? COLORS.primary : COLORS.text} />
                        <Text style={[
                          styles.speciesButtonText,
                          species === 'Other' && styles.speciesButtonTextActive
                        ]}>
                          Other
                        </Text>
                      </TouchableOpacity>
                    </View>
                    
                    {/* Show selected custom species */}
                    {species && !SPECIES_OPTIONS.includes(species) && (
                      <View style={styles.customSpeciesBadge}>
                        <MaterialCommunityIcons name="paw" size={16} color={COLORS.primary} />
                        <Text style={styles.customSpeciesText}>Selected: {species}</Text>
                        <TouchableOpacity onPress={() => handleSpeciesSelect('Other')}>
                          <Text style={styles.changeLink}>Change</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    
                    {errors.species && <Text style={globalStyles.errorText}>{errors.species}</Text>}
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={globalStyles.label}>Breed</Text>
                    {species && BREEDS[species] ? (
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.breedScroll}>
                        {BREEDS[species].map((b) => (
                          <TouchableOpacity
                            key={b}
                            onPress={() => setBreed(b)}
                            style={[
                              styles.breedChip,
                              breed === b && styles.breedChipActive
                            ]}
                          >
                            <Text style={[styles.breedChipText, breed === b && styles.breedChipTextActive]}>
                              {b}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    ) : (
                      <TextInput
                        value={breed}
                        onChangeText={setBreed}
                        placeholder={species && !SPECIES_OPTIONS.includes(species) ? "Enter breed or type" : "Breed"}
                        style={globalStyles.input}
                      />
                    )}
                  </View>
                </View>

                <View style={globalStyles.formRow}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={globalStyles.label}>Sex</Text>
                    <View style={globalStyles.segment}>
                      {SEX_OPTIONS.map((s) => {
                        let icon
                        if (s === 'Male') icon = '♂️'
                        else if (s === 'Female') icon = '♀️'
                        else icon = '❓'
                        return (
                          <TouchableOpacity 
                            key={s} 
                            onPress={() => setSex(s)} 
                            style={[
                              globalStyles.segmentItem, 
                              sex === s && { backgroundColor: COLORS.cardSelected }
                            ]}
                          >
                            <Text style={{ fontSize: 14, marginRight: 4 }}>{icon}</Text>
                            <Text style={{ color: sex === s ? COLORS.primaryDark : COLORS.text }}>{s}</Text>
                          </TouchableOpacity>
                        )
                      })}
                    </View>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={globalStyles.label}>Microchip ID</Text>
                    <TextInput 
                      value={microchip} 
                      onChangeText={handleMicrochipChange} 
                      placeholder="15-digit number" 
                      style={globalStyles.input}
                      keyboardType="numeric"
                      maxLength={15}
                    />
                  </View>
                </View>

                <View style={globalStyles.formRow}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={globalStyles.label}>Date of birth</Text>
                    
                    {/* Platform-specific date picker */}
                    {Platform.OS === 'web' ? (
                      <input
                        type="date"
                        value={dob ? formatDateForDisplay(dob) : ''}
                        onChange={(e) => {
                          const dateValue = e.target.value
                          if (dateValue) {
                            setDob(new Date(dateValue))
                          } else {
                            setDob(null)
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid #F0F0F0',
                          backgroundColor: '#FAFAFA',
                          fontSize: '14px',
                          fontFamily: 'system-ui',
                          color: dob ? COLORS.text : '#999',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                        max={formatDateForDisplay(new Date())}
                      />
                    ) : (
                      <>
                        <TouchableOpacity 
                          style={globalStyles.dateButton}
                          onPress={() => setShowDatePicker(true)}
                          activeOpacity={0.7}
                        >
                          <Feather name="calendar" size={16} color={COLORS.muted} style={{ marginRight: 8 }} />
                          <Text style={dob ? globalStyles.dateButtonText : globalStyles.dateButtonPlaceholder}>
                            {dob ? formatDateForDisplay(dob) : "Select date"}
                          </Text>
                        </TouchableOpacity>
                        {showDatePicker && DateTimePicker && (
                          <DateTimePicker
                            value={dob || new Date()}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={onDateChange}
                            maximumDate={new Date()}
                          />
                        )}
                      </>
                    )}
                  </View>

                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={globalStyles.label}>Color / Markings</Text>
                    <TextInput 
                      value={colorText} 
                      onChangeText={setColorText} 
                      placeholder="e.g., brown & white" 
                      style={globalStyles.input} 
                    />
                  </View>
                </View>

                <View style={globalStyles.formRow}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={globalStyles.label}>Age (years)</Text>
                    <TextInput 
                      value={age} 
                      onChangeText={handleAgeChange} 
                      placeholder="Age" 
                      style={globalStyles.input} 
                      keyboardType="numeric"
                      maxLength={3}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={globalStyles.label}>Weight (lbs)</Text>
                    <TextInput 
                      value={weight} 
                      onChangeText={handleWeightChange} 
                      placeholder="Weight" 
                      style={globalStyles.input} 
                      keyboardType="decimal-pad"
                    />
                  </View>
                </View>
              </View>

              {/* Medical Card */}
              <View style={globalStyles.card}>
                <View style={globalStyles.sectionHeaderRow}>
                  <Text style={globalStyles.sectionTitle}>Medical</Text>
                  <FontAwesome5 name="stethoscope" size={18} color={COLORS.primary} />
                </View>
                <Text style={globalStyles.label}>History</Text>
                <TextInput 
                  value={medical_history} 
                  onChangeText={setHistory} 
                  placeholder="Medical history" 
                  style={globalStyles.input} 
                  multiline 
                />
              </View>

              {/* Vaccinations Card */}
              <View style={globalStyles.card}>
                <View style={globalStyles.sectionHeaderRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <FontAwesome5 name="syringe" size={18} color={COLORS.primary} />
                    <Text style={globalStyles.sectionTitle}>Vaccinations (optional)</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={openVaccEditor}>
                      <Text style={{ color: COLORS.primary }}>+ Add</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowVaccinations((s) => !s)} style={{ marginLeft: 12 }}>
                      <Text style={{ color: COLORS.primary }}>{showVaccinations ? 'Collapse' : 'Expand'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {showVaccinations ? (
                  <View style={{ marginTop: 12 }}>
                    {vaccinations.length === 0 ? 
                      <Text style={globalStyles.mutedText}>No vaccinations added.</Text> : 
                      vaccinations.map((v) => (
                        <View key={v.id} style={globalStyles.listItem}>
                          <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: '600' }}>💉 {v.name}</Text>
                            <Text style={globalStyles.mutedText}>{v.date}{v.nextDue ? ` • next: ${v.nextDue}` : ''}</Text>
                          </View>
                          <TouchableOpacity onPress={() => setVaccinations((s) => s.filter((i) => i.id !== v.id))}>
                            <Text style={{ color: COLORS.danger }}>Delete</Text>
                          </TouchableOpacity>
                        </View>
                      ))
                    }
                  </View>
                ) : (
                  <Text style={globalStyles.mutedText}>{vaccinations.length} item{vaccinations.length !== 1 ? 's' : ''}</Text>
                )}
              </View>

              {/* Notes Card */}
              <View style={globalStyles.card}>
                <View style={globalStyles.sectionHeaderRow}>
                  <Text style={globalStyles.sectionTitle}>Notes</Text>
                  <Feather name="edit-2" size={18} color={COLORS.primary} />
                </View>
                <TextInput
                  value={notes}
                  onChangeText={setnotes}
                  placeholder="Additional notes..."
                  style={[globalStyles.input, { minHeight: 100, textAlignVertical: 'top' }]}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>

            {/* RIGHT COLUMN (30%) - Owner Section */}
            <View style={styles.rightColumn}>
              <View style={globalStyles.card}>
                <View style={globalStyles.sectionHeaderRow}>
                  <Text style={globalStyles.sectionTitle}>Owner assignment *</Text>
                  <Feather name="users" size={18} color={COLORS.primary} />
                </View>
                
                {/* Owner Chips - Horizontal scroll */}
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
                        style={[globalStyles.ownerChip, isSelected && { borderColor: COLORS.primary, backgroundColor: COLORS.cardSelected }]}
                      >
                        <Feather name="user" size={14} color={isSelected ? COLORS.primary : COLORS.muted} />
                        <Text style={{ fontWeight: '600', color: isSelected ? COLORS.primaryDark : COLORS.text, marginLeft: 6 }}>{item.name}</Text>
                        <Text style={globalStyles.mutedText}>{item.email}</Text>
                      </TouchableOpacity>
                    )
                  }}
                />
                
                <View style={{ flexDirection: 'row', marginTop: 12, gap: 8 }}>
                  <TouchableOpacity style={globalStyles.secondaryButton} onPress={() => setOwnerModalVisible(true)}>
                    <Feather name="user-plus" size={14} color={COLORS.primary} />
                    <Text style={{ color: COLORS.primary, marginLeft: 6 }}>Add Owner</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={globalStyles.secondaryButton} onPress={() => Alert.alert('Search', 'Open owner search (stub)')}>
                    <Feather name="search" size={14} color={COLORS.primary} />
                    <Text style={{ color: COLORS.primary, marginLeft: 6 }}>Search</Text>
                  </TouchableOpacity>
                </View>
                
                {errors.owner ? <Text style={globalStyles.errorText}>{errors.owner}</Text> : null}

                {/* Selected Owner Details Placeholder */}
                {selectedOwnerId && (
                  <View style={{ marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0' }}>
                    <Text style={[globalStyles.mutedText, { fontSize: 11 }]}>Selected owner ID: {selectedOwnerId}</Text>
                  </View>
                )}
              </View>

              {/* Vet Tip Card */}
              <View style={[globalStyles.card, { backgroundColor: COLORS.card, marginTop: 0 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ fontSize: 20 }}>💡</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[globalStyles.sectionTitle, { fontSize: 13 }]}>VET TIP</Text>
                    <Text style={[globalStyles.mutedText, { fontSize: 11, marginTop: 2 }]}>
                      Completing the Microchip ID and DOB ensures accurate reminders for automated vaccination cycles.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Bottom spacer for scroll */}
          <View style={{ height: 20 }} />
        </ScrollView>

        {/* Other Species Modal */}
        <Modal
          visible={showOtherSpeciesModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowOtherSpeciesModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Animal Species</Text>
                <TouchableOpacity onPress={() => setShowOtherSpeciesModal(false)}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search species..."
                  placeholderTextColor="#999"
                  value={customSpecies}
                  onChangeText={setCustomSpecies}
                />
              </View>
              
              <ScrollView style={styles.modalList}>
                {OTHER_SPECIES_OPTIONS.filter(item => 
                  customSpecies === "" || 
                  item.toLowerCase().includes(customSpecies.toLowerCase())
                ).map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.modalItem}
                    onPress={() => handleOtherSpeciesSelect(item)}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <View style={styles.modalFooter}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setShowOtherSpeciesModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Vaccination Editor Modal */}
        <Modal visible={vaccEditorVisible} transparent animationType="slide" onRequestClose={() => setVaccEditorVisible(false)}>
          <View style={globalStyles.modalOverlay}>
            <View style={globalStyles.modalCard}>
              <Text style={globalStyles.sectionTitle}>Add Vaccination</Text>
              <Text style={globalStyles.label}>Vaccine name *</Text>
              <TextInput 
                value={vaccEditorItem.name} 
                onChangeText={(t) => setVaccEditorItem((s) => ({ ...s, name: t }))} 
                style={globalStyles.input} 
              />
              <Text style={[globalStyles.label, { marginTop: 12 }]}>Date</Text>
              <TextInput 
                value={vaccEditorItem.date} 
                onChangeText={(t) => setVaccEditorItem((s) => ({ ...s, date: t }))} 
                placeholder="YYYY-MM-DD" 
                style={globalStyles.input} 
              />
              <Text style={[globalStyles.label, { marginTop: 12 }]}>Next due (optional)</Text>
              <TextInput 
                value={vaccEditorItem.nextDue} 
                onChangeText={(t) => setVaccEditorItem((s) => ({ ...s, nextDue: t }))} 
                placeholder="YYYY-MM-DD" 
                style={globalStyles.input} 
              />

              <View style={{ flexDirection: 'row', marginTop: 16, gap: 12 }}>
                <TouchableOpacity style={[globalStyles.primaryButton, { flex: 1 }]} onPress={saveVaccination}>
                  <Text style={globalStyles.primaryButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[globalStyles.secondaryButton, { flex: 1 }]} onPress={() => setVaccEditorVisible(false)}>
                  <Text style={{ color: COLORS.primary }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Owner Modal */}
        <Modal visible={ownerModalVisible} transparent animationType="slide" onRequestClose={() => setOwnerModalVisible(false)}>
          <View style={globalStyles.modalOverlay}>
            <View style={globalStyles.modalCard}>
              <Text style={globalStyles.sectionTitle}>Add Owner</Text>
              <Text style={globalStyles.label}>Full name *</Text>
              <TextInput 
                value={newOwner.name} 
                onChangeText={(t) => setNewOwner((s) => ({ ...s, name: t }))} 
                style={globalStyles.input} 
              />
              <Text style={[globalStyles.label, { marginTop: 12 }]}>Email *</Text>
              <TextInput 
                value={newOwner.email} 
                onChangeText={(t) => setNewOwner((s) => ({ ...s, email: t }))} 
                style={globalStyles.input} 
                keyboardType="email-address" 
              />
              <Text style={[globalStyles.label, { marginTop: 12 }]}>Phone *</Text>
              <TextInput 
                value={newOwner.phone} 
                onChangeText={(t) => setNewOwner((s) => ({ ...s, phone: t }))} 
                style={globalStyles.input} 
                keyboardType="phone-pad" 
              />

              <View style={{ flexDirection: 'row', marginTop: 16, gap: 12 }}>
                <TouchableOpacity style={[globalStyles.primaryButton, { flex: 1 }]} onPress={addOwnerInline}>
                  <Text style={globalStyles.primaryButtonText}>Add Owner</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[globalStyles.secondaryButton, { flex: 1 }]} onPress={() => setOwnerModalVisible(false)}>
                  <Text style={{ color: COLORS.primary }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Sticky Bottom Bar */}
        <View style={globalStyles.stickyBar}>
          <TouchableOpacity 
            style={[globalStyles.primaryButton, { width: '100%', opacity: !isSaveEnabled || loading ? 0.5 : 1 }]} 
            disabled={!isSaveEnabled || loading} 
            onPress={handleSubmit}
          >
            <Text style={globalStyles.primaryButtonText}>
              {loading ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  twoColumnLayout: {
    flexDirection: 'row',
    gap: 16,
  },
  leftColumn: {
    flex: 7,
    gap: 14,
  },
  rightColumn: {
    flex: 3,
    gap: 14,
  },
  // Species buttons
  speciesButtonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  speciesButton: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  speciesButtonActive: {
    backgroundColor: COLORS.cardSelected,
    borderColor: COLORS.primary,
  },
  speciesButtonText: {
    fontSize: 14,
    color: COLORS.text,
  },
  speciesButtonTextActive: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  customSpeciesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    padding: 8,
    backgroundColor: COLORS.card,
    borderRadius: 6,
  },
  customSpeciesText: {
    fontSize: 13,
    color: COLORS.text,
    marginLeft: 8,
    flex: 1,
  },
  changeLink: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
  // Breed chips
  breedScroll: {
    flexDirection: 'row',
  },
  breedChip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginRight: 8,
    backgroundColor: '#FAFAFA',
  },
  breedChipActive: {
    backgroundColor: COLORS.cardSelected,
    borderColor: COLORS.primary,
  },
  breedChipText: {
    fontSize: 14,
    color: COLORS.text,
  },
  breedChipTextActive: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  modalClose: {
    fontSize: 20,
    color: COLORS.muted,
    padding: 4,
  },
  searchContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  searchInput: {
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    fontSize: 14,
  },
  modalList: {
    maxHeight: 400,
  },
  modalItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalItemText: {
    fontSize: 14,
    color: COLORS.text,
  },
  modalFooter: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  cancelButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  cancelButtonText: {
    fontSize: 14,
    color: COLORS.text,
  },
})
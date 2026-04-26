import { Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, FlatList, Image, KeyboardAvoidingView, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useAnimals } from "../../../hooks/useAnimals"
import { COLORS, styles as globalStyles } from './CreateAnimalForm.styles'

let DateTimePicker = null
if (Platform.OS !== 'web') {
  DateTimePicker = require('@react-native-community/datetimepicker').default
}

const SEX_OPTIONS = ['Male', 'Female', 'Unknown']
const SPECIES_OPTIONS = ['Dog', 'Cat', 'Other']

const OTHER_SPECIES_OPTIONS = [
  { name: "Rabbit", icon: "🐰" },
  { name: "Guinea Pig", icon: "🐹" },
  { name: "Hamster", icon: "🐹" },
  { name: "Gerbil", icon: "🐭" },
  { name: "Rat", icon: "🐭" },
  { name: "Mouse", icon: "🐭" },
  { name: "Ferret", icon: "🦦" },
  { name: "Chinchilla", icon: "🐭" },
  { name: "Hedgehog", icon: "🦔" },
  { name: "Bird - Parrot", icon: "🦜" },
  { name: "Bird - Cockatiel", icon: "🐦" },
  { name: "Bird - Budgie", icon: "🐦" },
  { name: "Bird - Canary", icon: "🐦" },
  { name: "Bird - Finch", icon: "🐦" },
  { name: "Bird - Macaw", icon: "🦜" },
  { name: "Bird - African Grey", icon: "🦜" },
  { name: "Bird - Cockatoo", icon: "🦜" },
  { name: "Bird - Lovebird", icon: "🦜" },
  { name: "Reptile - Bearded Dragon", icon: "🦎" },
  { name: "Reptile - Leopard Gecko", icon: "🦎" },
  { name: "Reptile - Ball Python", icon: "🐍" },
  { name: "Reptile - Corn Snake", icon: "🐍" },
  { name: "Reptile - Iguana", icon: "🦎" },
  { name: "Reptile - Turtle", icon: "🐢" },
  { name: "Reptile - Tortoise", icon: "🐢" },
  { name: "Reptile - Chameleon", icon: "🦎" },
  { name: "Amphibian - Frog", icon: "🐸" },
  { name: "Amphibian - Toad", icon: "🐸" },
  { name: "Amphibian - Salamander", icon: "🦎" },
  { name: "Amphibian - Newt", icon: "🦎" },
  { name: "Fish - Goldfish", icon: "🐠" },
  { name: "Fish - Betta", icon: "🐠" },
  { name: "Fish - Guppy", icon: "🐠" },
  { name: "Fish - Koi", icon: "🐠" },
  { name: "Farm Animal - Horse", icon: "🐴" },
  { name: "Farm Animal - Pony", icon: "🐴" },
  { name: "Farm Animal - Donkey", icon: "🫏" },
  { name: "Farm Animal - Cow", icon: "🐮" },
  { name: "Farm Animal - Goat", icon: "🐐" },
  { name: "Farm Animal - Sheep", icon: "🐑" },
  { name: "Farm Animal - Pig", icon: "🐷" },
  { name: "Farm Animal - Chicken", icon: "🐔" },
  { name: "Farm Animal - Duck", icon: "🦆" },
  { name: "Farm Animal - Goose", icon: "🦢" },
  { name: "Farm Animal - Llama", icon: "🦙" },
  { name: "Farm Animal - Alpaca", icon: "🦙" },
  { name: "Exotic - Sugar Glider", icon: "🦘" },
  { name: "Exotic - Wallaby", icon: "🦘" },
  { name: "Exotic - Kangaroo", icon: "🦘" },
  { name: "Exotic - Fox", icon: "🦊" },
  { name: "Exotic - Raccoon", icon: "🦝" },
  { name: "Exotic - Skunk", icon: "🦨" },
  { name: "Exotic - Monkey", icon: "🐒" },
  { name: "Exotic - Sloth", icon: "🦥" },
  { name: "Exotic - Anteater", icon: "🐜" },
  { name: "Exotic - Armadillo", icon: "🦉" },
  { name: "Marine - Dolphin", icon: "🐬" },
  { name: "Marine - Seal", icon: "🦭" },
  { name: "Marine - Sea Lion", icon: "🦭" },
  { name: "Marine - Penguin", icon: "🐧" },
  { name: "Marine - Sea Turtle", icon: "🐢" },
  { name: "Other - Please specify", icon: "🐾" }
]

const FREQUENCY_OPTIONS = [
  { label: 'One-time', value: 'one-time', days: null },
  { label: 'Monthly', value: 'monthly', days: 30 },
  { label: 'Yearly', value: 'yearly', days: 365 },
  { label: 'Every 2 years', value: 'every-2-years', days: 730 },
  { label: 'Every 3 years', value: 'every-3-years', days: 1095 },
  { label: 'Custom', value: 'custom', days: null }
]

const uid = () => Math.random().toString(36).slice(2, 9)

// Helper function to calculate age from date of birth
const calculateAgeFromDOB = (dobDate) => {
  if (!dobDate) return '';
  
  const today = new Date();
  const birthDate = new Date(dobDate);
  
  if (isNaN(birthDate.getTime())) return '';
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age.toString();
};

export default function CreateAnimalForm({ onSuccess, editingAnimal }) {
  useEffect(() => {
    fetchOwners()
    if (Platform.OS !== 'web') {
      requestMediaPermissions()
    }
  }, [])
  
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
  
  const [age, setAge] = useState("")
  const [weight, setWeight] = useState("")
  
  const [medical_history, setHistory] = useState("")
  const [vaccinations, setVaccinations] = useState([])
  const [showVaccinations, setShowVaccinations] = useState(false)
  const [vaccEditorVisible, setVaccEditorVisible] = useState(false)
  const [vaccEditorItem, setVaccEditorItem] = useState({ name: '', date: '', nextDue: '', frequency: 'one-time', notes: '' })
  const [showVaccineDatePicker, setShowVaccineDatePicker] = useState(false)
  const [showVaccineDuePicker, setShowVaccineDuePicker] = useState(false)
  const [selectedFrequency, setSelectedFrequency] = useState('one-time')
  const [notes, setnotes] = useState("")
  
  const [selectedOwnerId, setSelectedOwnerId] = useState(null)
  const [ownerModalVisible, setOwnerModalVisible] = useState(false)
  const [newOwner, setNewOwner] = useState({ name: '', email: '', phone: '', address: '' })
  
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const { createAnimal, updateAnimal, owners, fetchOwners, createOwner } = useAnimals()
  const router = useRouter()

  const isSaveEnabled = name.trim() && species && selectedOwnerId

  // Populate form when editing
  useEffect(() => {
    if (editingAnimal) {
      setName(editingAnimal.name || '')
      setSpecies(editingAnimal.species || '')
      setBreed(editingAnimal.breed || '')
      setSex(editingAnimal.sex || 'Unknown')
      setAge(editingAnimal.age?.toString() || '')
      setWeight(editingAnimal.weight?.toString() || '')
      setMicrochip(editingAnimal.microchip || '')
      setColorText(editingAnimal.color || '')
      setDescription(editingAnimal.description || '')
      setHistory(editingAnimal.medical_history || '')
      setnotes(editingAnimal.notes || '')
      setSelectedOwnerId(editingAnimal.OwnerId || null)
      
      if (editingAnimal.dob) {
        setDob(new Date(editingAnimal.dob))
      }
      
      if (editingAnimal.vaccinations && typeof editingAnimal.vaccinations === 'string') {
        const parsedVaccinations = parseVaccinationsFromString(editingAnimal.vaccinations)
        setVaccinations(parsedVaccinations)
      }
    }
  }, [editingAnimal])

  // Calculate age when DOB changes
  useEffect(() => {
    if (dob) {
      const calculatedAge = calculateAgeFromDOB(dob);
      if (calculatedAge) {
        setAge(calculatedAge);
      }
    } else if (!editingAnimal) {
      setAge('');
    }
  }, [dob]);

  const parseVaccinationsFromString = (vaccStr) => {
    if (!vaccStr) return []
    
    const vaccines = vaccStr.split('; ').map(v => {
      const nameMatch = v.match(/^([^(]+)/)
      const dateMatch = v.match(/\(([^)]+)\)/)
      const dueMatch = v.match(/due:\s*([^\s\[]+)/)
      const freqMatch = v.match(/\[([^\]]+)\]/)
      const notesMatch = v.match(/notes:\s*(.+)$/)
      
      return {
        id: uid(),
        name: nameMatch ? nameMatch[0].trim() : '',
        date: dateMatch ? dateMatch[1] : '',
        nextDue: dueMatch ? dueMatch[1] : '',
        frequency: freqMatch ? getFrequencyValue(freqMatch[1]) : 'one-time',
        notes: notesMatch ? notesMatch[1] : ''
      }
    })
    
    return vaccines
  }

  const getFrequencyValue = (label) => {
    const freq = FREQUENCY_OPTIONS.find(f => f.label === label)
    return freq ? freq.value : 'one-time'
  }

  const requestMediaPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission Needed', 'Please grant camera roll permissions to upload photos.')
      }
    }
  }

  const formatDate = (date) => {
    if (!date) return ''
    return date.toISOString().split('T')[0]
  }

  const formatDateForDisplay = (date) => {
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const calculateDueDate = (givenDate, frequency) => {
    if (!givenDate || frequency === 'one-time') return ''
    
    const frequencyObj = FREQUENCY_OPTIONS.find(f => f.value === frequency)
    if (!frequencyObj || !frequencyObj.days) return ''
    
    const date = new Date(givenDate)
    date.setDate(date.getDate() + frequencyObj.days)
    return formatDateForDisplay(date)
  }

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false)
    if (selectedDate) {
      setDob(selectedDate)
    }
  }

  const onVaccineDateChange = (event, selectedDate) => {
    setShowVaccineDatePicker(false)
    if (selectedDate) {
      const formattedDate = formatDateForDisplay(selectedDate)
      setVaccEditorItem((s) => ({ ...s, date: formattedDate }))
      
      if (selectedFrequency !== 'one-time' && selectedFrequency !== 'custom') {
        const dueDate = calculateDueDate(formattedDate, selectedFrequency)
        setVaccEditorItem((s) => ({ ...s, nextDue: dueDate }))
      }
    }
  }

  const onVaccineDueChange = (event, selectedDate) => {
    setShowVaccineDuePicker(false)
    if (selectedDate) {
      setVaccEditorItem((s) => ({ ...s, nextDue: formatDateForDisplay(selectedDate) }))
    }
  }

  const handleFrequencyChange = (frequency) => {
    setSelectedFrequency(frequency)
    setVaccEditorItem((s) => ({ ...s, frequency }))
    
    if (vaccEditorItem.date && frequency !== 'one-time' && frequency !== 'custom') {
      const dueDate = calculateDueDate(vaccEditorItem.date, frequency)
      setVaccEditorItem((s) => ({ ...s, nextDue: dueDate }))
    } else if (frequency === 'one-time') {
      setVaccEditorItem((s) => ({ ...s, nextDue: '' }))
    }
  }

  const handleMicrochipChange = (text) => {
    const numbersOnly = text.replace(/[^0-9]/g, '')
    const truncated = numbersOnly.slice(0, 15)
    setMicrochip(truncated)
  }

  const handleAgeChange = (text) => {
    const numbersOnly = text.replace(/[^0-9]/g, '')
    const truncated = numbersOnly.slice(0, 3)
    setAge(truncated)
  }

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

  const addOwnerInline = async () => {
    if (!newOwner.name || !newOwner.email || !newOwner.phone) {
      Alert.alert('Missing info', 'Please fill name, email and phone.')
      return
    }

    const owner = await createOwner(newOwner)

    setSelectedOwnerId(owner.$id)
    setNewOwner({ name: '', email: '', phone: '', address: '' })
    setOwnerModalVisible(false)
  }

  const openVaccEditor = () => {
    setVaccEditorItem({ name: '', date: '', nextDue: '', frequency: 'one-time', notes: '' })
    setSelectedFrequency('one-time')
    setVaccEditorVisible(true)
  }
  
  const saveVaccination = () => {
    if (!vaccEditorItem.name) {
      Alert.alert('Validation', 'Vaccine name is required.')
      return
    }
    if (!vaccEditorItem.date) {
      Alert.alert('Validation', 'Date given is required.')
      return
    }
    
    setVaccinations((s) => [{ 
      id: uid(), 
      name: vaccEditorItem.name,
      date: vaccEditorItem.date,
      nextDue: vaccEditorItem.nextDue,
      frequency: vaccEditorItem.frequency,
      notes: vaccEditorItem.notes
    }, ...s])
    setVaccEditorVisible(false)
    setShowVaccinations(true)
  }

  const formatVaccinationsForBackend = () => {
    return vaccinations.map(v => {
      let vaccineStr = v.name + ' (' + v.date + ')'
      if (v.nextDue) vaccineStr += ' - due: ' + v.nextDue
      if (v.frequency && v.frequency !== 'one-time') {
        const frequencyLabel = FREQUENCY_OPTIONS.find(f => f.value === v.frequency)?.label
        if (frequencyLabel) vaccineStr += ' [' + frequencyLabel + ']'
      }
      if (v.notes) vaccineStr += ' - notes: ' + v.notes
      return vaccineStr
    }).join('; ')
  }

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
    setSpecies(selectedOtherSpecies.name)
    setBreed("")
    setShowOtherSpeciesModal(false)
  }

  const resetForm = () => {
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

    const animalData = {
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
    }

    if (editingAnimal) {
      await updateAnimal(editingAnimal.$id, animalData)
    } else {
      await createAnimal(animalData)
    }

    resetForm()

    if (onSuccess) {
      onSuccess()
    } else {
      router.replace("/animals")
    }
    
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
          
          <Text style={globalStyles.pageTitle}>{editingAnimal ? 'Edit Animal' : 'Create Animal'}</Text>
          <Text style={globalStyles.subtitle}>Enter the animal identity details. Required fields: Pet name, Species, Owner.</Text>

          <View style={styles.twoColumnLayout}>
            
            <View style={styles.leftColumn}>
              
              <View style={globalStyles.card}>
                <View style={globalStyles.row}>
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
                      placeholder="Age (auto-calculated from DOB)" 
                      style={globalStyles.input} 
                      keyboardType="numeric"
                      maxLength={3}
                    />
                    {dob && (
                      <Text style={{ fontSize: 11, color: '#6B887A', marginTop: 4 }}>
                        ⚡ Auto-calculated from date of birth
                      </Text>
                    )}
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
                      vaccinations.map((v) => {
                        const frequencyLabel = FREQUENCY_OPTIONS.find(f => f.value === v.frequency)?.label
                        return (
                          <View key={v.id} style={globalStyles.listItem}>
                            <View style={{ flex: 1 }}>
                              <Text style={{ fontWeight: '600' }}>💉 {v.name}</Text>
                              <Text style={globalStyles.mutedText}>
                                Given: {v.date}
                                {v.nextDue && ` • Due: ${v.nextDue}`}
                                {frequencyLabel && frequencyLabel !== 'One-time' && ` • ${frequencyLabel}`}
                              </Text>
                              {v.notes ? <Text style={globalStyles.mutedText}>📝 {v.notes}</Text> : null}
                            </View>
                            <TouchableOpacity onPress={() => setVaccinations((s) => s.filter((i) => i.id !== v.id))}>
                              <Text style={{ color: COLORS.danger }}>Delete</Text>
                            </TouchableOpacity>
                          </View>
                        )
                      })
                    }
                  </View>
                ) : (
                  <Text style={globalStyles.mutedText}>{vaccinations.length} item{vaccinations.length !== 1 ? 's' : ''}</Text>
                )}
              </View>

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

            <View style={styles.rightColumn}>
              <View style={globalStyles.card}>
                <View style={globalStyles.sectionHeaderRow}>
                  <Text style={globalStyles.sectionTitle}>Owner assignment *</Text>
                  <Feather name="users" size={18} color={COLORS.primary} />
                </View>
                
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

                {selectedOwnerId && (
                  <View style={{ marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0' }}>
                    <Text style={[globalStyles.mutedText, { fontSize: 11 }]}>Selected owner ID: {selectedOwnerId}</Text>
                  </View>
                )}
              </View>

              <View style={[globalStyles.card, { backgroundColor: COLORS.card, marginTop: 0 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ fontSize: 20 }}>💡</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[globalStyles.sectionTitle, { fontSize: 13 }]}>VET TIP</Text>
                    <Text style={[globalStyles.mutedText, { fontSize: 11, marginTop: 2 }]}>
                      Age is automatically calculated when you enter the Date of Birth. You can also manually adjust it if needed.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>

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
                  item.name.toLowerCase().includes(customSpecies.toLowerCase())
                ).map((item) => (
                  <TouchableOpacity
                    key={item.name}
                    style={styles.modalItem}
                    onPress={() => handleOtherSpeciesSelect(item)}
                  >
                    <Text style={styles.modalItemIcon}>{item.icon}</Text>
                    <Text style={styles.modalItemText}>{item.name}</Text>
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

        <Modal visible={vaccEditorVisible} transparent animationType="slide" onRequestClose={() => setVaccEditorVisible(false)}>
          <View style={globalStyles.modalOverlay}>
            <View style={globalStyles.modalCard}>
              <Text style={globalStyles.sectionTitle}>Add Vaccination</Text>
              
              <Text style={globalStyles.label}>Vaccine name *</Text>
              <TextInput 
                value={vaccEditorItem.name} 
                onChangeText={(t) => setVaccEditorItem((s) => ({ ...s, name: t }))} 
                style={globalStyles.input} 
                placeholder="e.g., Rabies, DHPP, Bordetella"
              />
              
              <Text style={[globalStyles.label, { marginTop: 12 }]}>Date given *</Text>
              {Platform.OS === 'web' ? (
                <input
                  type="date"
                  value={vaccEditorItem.date}
                  onChange={(e) => {
                    const dateValue = e.target.value
                    setVaccEditorItem((s) => ({ ...s, date: dateValue }))
                    if (selectedFrequency !== 'one-time' && selectedFrequency !== 'custom' && dateValue) {
                      const dueDate = calculateDueDate(dateValue, selectedFrequency)
                      setVaccEditorItem((s) => ({ ...s, nextDue: dueDate }))
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
                    color: vaccEditorItem.date ? COLORS.text : '#999',
                    outline: 'none',
                    boxSizing: 'border-box',
                    marginTop: 4,
                  }}
                />
              ) : (
                <>
                  <TouchableOpacity 
                    style={globalStyles.dateButton}
                    onPress={() => setShowVaccineDatePicker(true)}
                    activeOpacity={0.7}
                  >
                    <Feather name="calendar" size={16} color={COLORS.muted} style={{ marginRight: 8 }} />
                    <Text style={vaccEditorItem.date ? globalStyles.dateButtonText : globalStyles.dateButtonPlaceholder}>
                      {vaccEditorItem.date || "Select date"}
                    </Text>
                  </TouchableOpacity>
                  {showVaccineDatePicker && DateTimePicker && (
                    <DateTimePicker
                      value={vaccEditorItem.date ? new Date(vaccEditorItem.date) : new Date()}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={onVaccineDateChange}
                      maximumDate={new Date()}
                    />
                  )}
                </>
              )}
              
              <Text style={[globalStyles.label, { marginTop: 12 }]}>Frequency</Text>
              <View style={styles.frequencyGroup}>
                {FREQUENCY_OPTIONS.map((freq) => (
                  <TouchableOpacity
                    key={freq.value}
                    style={[
                      styles.frequencyButton,
                      selectedFrequency === freq.value && styles.frequencyButtonActive
                    ]}
                    onPress={() => handleFrequencyChange(freq.value)}
                  >
                    <Text style={[
                      styles.frequencyButtonText,
                      selectedFrequency === freq.value && styles.frequencyButtonTextActive
                    ]}>
                      {freq.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              {selectedFrequency !== 'one-time' && selectedFrequency !== 'custom' && vaccEditorItem.date && vaccEditorItem.nextDue && (
                <View style={styles.calculatedDueDate}>
                  <MaterialCommunityIcons name="calendar-clock" size={16} color={COLORS.primary} />
                  <Text style={styles.calculatedDueDateText}>
                    Next due date: {vaccEditorItem.nextDue}
                  </Text>
                </View>
              )}
              
              <Text style={[globalStyles.label, { marginTop: 12 }]}>
                Due date {selectedFrequency === 'custom' ? '*' : '(optional override)'}
              </Text>
              {Platform.OS === 'web' ? (
                <input
                  type="date"
                  value={vaccEditorItem.nextDue}
                  onChange={(e) => setVaccEditorItem((s) => ({ ...s, nextDue: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #F0F0F0',
                    backgroundColor: '#FAFAFA',
                    fontSize: '14px',
                    fontFamily: 'system-ui',
                    color: vaccEditorItem.nextDue ? COLORS.text : '#999',
                    outline: 'none',
                    boxSizing: 'border-box',
                    marginTop: 4,
                  }}
                />
              ) : (
                <>
                  <TouchableOpacity 
                    style={globalStyles.dateButton}
                    onPress={() => setShowVaccineDuePicker(true)}
                    activeOpacity={0.7}
                  >
                    <Feather name="calendar" size={16} color={COLORS.muted} style={{ marginRight: 8 }} />
                    <Text style={vaccEditorItem.nextDue ? globalStyles.dateButtonText : globalStyles.dateButtonPlaceholder}>
                      {vaccEditorItem.nextDue || "Select due date"}
                    </Text>
                  </TouchableOpacity>
                  {showVaccineDuePicker && DateTimePicker && (
                    <DateTimePicker
                      value={vaccEditorItem.nextDue ? new Date(vaccEditorItem.nextDue) : (vaccEditorItem.date ? new Date(vaccEditorItem.date) : new Date())}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={onVaccineDueChange}
                    />
                  )}
                </>
              )}
              
              <Text style={[globalStyles.label, { marginTop: 12 }]}>Notes (optional)</Text>
              <TextInput 
                value={vaccEditorItem.notes} 
                onChangeText={(t) => setVaccEditorItem((s) => ({ ...s, notes: t }))} 
                placeholder="Lot number, administration site, reactions, etc." 
                style={[globalStyles.input, { minHeight: 60 }]} 
                multiline
              />

              <View style={{ flexDirection: 'row', marginTop: 16, gap: 12 }}>
                <TouchableOpacity style={[globalStyles.primaryButton, { flex: 1 }]} onPress={saveVaccination}>
                  <Text style={globalStyles.primaryButtonText}>Save Vaccination</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[globalStyles.secondaryButton, { flex: 1 }]} onPress={() => setVaccEditorVisible(false)}>
                  <Text style={{ color: COLORS.primary }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

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
              <Text style={[globalStyles.label, { marginTop: 12 }]}>Address (optional)</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Feather name="map-pin" size={18} color={COLORS.muted} />
                <TextInput 
                  value={newOwner.address} 
                  onChangeText={(t) => setNewOwner((s) => ({ ...s, address: t }))} 
                  placeholder="Street address, city, postal code..." 
                  style={[globalStyles.input, { flex: 1 }]} 
                />
              </View>

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

        <View style={globalStyles.stickyBar}>
          <TouchableOpacity 
            style={[globalStyles.primaryButton, { width: '100%', opacity: !isSaveEnabled || loading ? 0.5 : 1 }]} 
            disabled={!isSaveEnabled || loading} 
            onPress={handleSubmit}
          >
            <Text style={globalStyles.primaryButtonText}>
              {loading ? "Saving..." : (editingAnimal ? "Update Animal" : "Save Animal")}
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
  frequencyGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  frequencyButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  frequencyButtonActive: {
    backgroundColor: COLORS.cardSelected,
    borderColor: COLORS.primary,
  },
  frequencyButtonText: {
    fontSize: 12,
    color: COLORS.text,
  },
  frequencyButtonTextActive: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  calculatedDueDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    padding: 8,
    backgroundColor: COLORS.cardSelected,
    borderRadius: 6,
  },
  calculatedDueDateText: {
    fontSize: 13,
    color: COLORS.primaryDark,
    fontWeight: '500',
  },
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalItemIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  modalItemText: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
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
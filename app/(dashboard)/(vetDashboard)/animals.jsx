import { FlatList, Pressable, StyleSheet, View, TouchableOpacity, Dimensions, Platform, TextInput, Image } from 'react-native'
import { router } from 'expo-router'
import { useState, useMemo } from 'react'

import Spacer from "../../../components/Spacer"
import ThemedCard from "../../../components/ThemedCard"
import ThemedText from "../../../components/ThemedText"
import ThemedView from "../../../components/ThemedView"
import { Colors } from '../../../constants/colors'
import { useAnimals } from '../../../hooks/useAnimals'
import CreateAnimalModal from './createAnimalModal'

const { width } = Dimensions.get('window')
const isWeb = Platform.OS === 'web'
const CARD_WIDTH = isWeb ? (width - 400) / 4 : (width - 48) / 2

// Map species to emoji icons (fallback when no photo)
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

// Get sex symbol
const getSexSymbol = (sex) => {
  if (sex === 'Male') return '♂'
  if (sex === 'Female') return '♀'
  return '⚪'
}

const Animals = () => {
  const { animals } = useAnimals()
  const [modalVisible, setModalVisible] = useState(false)
  const [showFilters, setShowFilters] = useState(!isWeb)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Filter states
  const [selectedSpecies, setSelectedSpecies] = useState([])
  const [selectedStatus, setSelectedStatus] = useState([])
  const [selectedAgeRange, setSelectedAgeRange] = useState([])

  // Get unique species from animals
  const availableSpecies = useMemo(() => {
    const species = new Set()
    animals.forEach(animal => {
      if (animal.species) species.add(animal.species)
    })
    return Array.from(species).sort()
  }, [animals])

  // Filter and search animals
  const filteredAnimals = useMemo(() => {
    let filtered = [...animals]
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(animal => 
        animal.name?.toLowerCase().includes(query) ||
        animal.species?.toLowerCase().includes(query) ||
        animal.breed?.toLowerCase().includes(query) ||
        animal.OwnerId?.toLowerCase().includes(query)
      )
    }
    
    if (selectedSpecies.length > 0) {
      filtered = filtered.filter(animal => 
        selectedSpecies.includes(animal.species)
      )
    }
    
    if (selectedStatus.length > 0) {
      filtered = filtered.filter(animal => 
        selectedStatus.includes('Active')
      )
    }
    
    if (selectedAgeRange.length > 0) {
      filtered = filtered.filter(animal => {
        const age = animal.age || 0
        if (selectedAgeRange.includes('<1 yr') && age < 1) return true
        if (selectedAgeRange.includes('1-3 yr') && age >= 1 && age <= 3) return true
        if (selectedAgeRange.includes('4-7 yr') && age >= 4 && age <= 7) return true
        if (selectedAgeRange.includes('8+ yr') && age >= 8) return true
        return false
      })
    }
    
    return filtered
  }, [animals, searchQuery, selectedSpecies, selectedStatus, selectedAgeRange])

  const toggleFilter = (filterType, value) => {
    if (filterType === 'species') {
      setSelectedSpecies(prev => 
        prev.includes(value) 
          ? prev.filter(v => v !== value)
          : [...prev, value]
      )
    } else if (filterType === 'status') {
      setSelectedStatus(prev => 
        prev.includes(value) 
          ? prev.filter(v => v !== value)
          : [...prev, value]
      )
    } else if (filterType === 'age') {
      setSelectedAgeRange(prev => 
        prev.includes(value) 
          ? prev.filter(v => v !== value)
          : [...prev, value]
      )
    }
  }

  const resetFilters = () => {
    setSelectedSpecies([])
    setSelectedStatus([])
    setSelectedAgeRange([])
    setSearchQuery('')
  }

  const FilterSection = ({ title, options, selectedValues, onToggle, color }) => (
    <View style={styles.filterSection}>
      <ThemedText style={styles.filterTitle}>{title}</ThemedText>
      {options.map(option => (
        <TouchableOpacity
          key={option}
          onPress={() => onToggle(option)}
          style={styles.filterOption}
        >
          <View style={[
            styles.checkbox,
            selectedValues.includes(option) && { backgroundColor: color || Colors.primary }
          ]}>
            {selectedValues.includes(option) && (
              <ThemedText style={styles.checkmark}>✓</ThemedText>
            )}
          </View>
          <ThemedText style={styles.filterLabel}>{option}</ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  )

  const renderAnimalCard = ({ item }) => (
    <Pressable 
      onPress={() => router.push(`/animals/${item.$id}`)}
      style={({ pressed }) => ({
        opacity: pressed ? 0.9 : 1,
        width: CARD_WIDTH,
        marginBottom: 16,
      })}
    >
      <ThemedCard style={styles.card}>
        {/* Species Icon or Photo */}
        <View style={styles.iconContainer}>
          {item.localPhotoUri ? (
            <Image source={{ uri: item.localPhotoUri }} style={styles.thumbnailImage} />
          ) : (
            <ThemedText style={styles.speciesIcon}>
              {getSpeciesIcon(item.species)}
            </ThemedText>
          )}
        </View>

        <ThemedText style={styles.name} numberOfLines={1}>
          {item.name}
        </ThemedText>

        <View style={styles.ageContainer}>
          <ThemedText style={styles.ageValue}>
            {item.age ? `${item.age}y` : '—'}
          </ThemedText>
        </View>

        <View style={styles.infoRow}>
          <ThemedText style={styles.infoText}>
            {getSexSymbol(item.sex)} {item.sex === 'Male' ? 'M' : item.sex === 'Female' ? 'F' : '?'}
          </ThemedText>
          <View style={styles.infoDivider} />
          <ThemedText style={styles.infoText}>
            {item.weight ? `${item.weight}kg` : '—'}
          </ThemedText>
        </View>

        <View style={styles.statusContainer}>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <ThemedText style={styles.statusText}>Active</ThemedText>
          </View>
        </View>
      </ThemedCard>
    </Pressable>
  )

  const AddAnimalCard = () => (
    <Pressable 
      onPress={() => setModalVisible(true)}
      style={({ pressed }) => ({
        opacity: pressed ? 0.9 : 1,
        width: CARD_WIDTH,
        marginBottom: 16,
      })}
    >
      <ThemedCard style={[styles.card, styles.addCard]}>
        <View style={[styles.iconContainer, styles.addIconContainer]}>
          <ThemedText style={styles.addIcon}>➕</ThemedText>
        </View>
        <ThemedText style={styles.addCardTitle}>Add Animal</ThemedText>
        <View style={styles.addCardSubtitle}>
          <ThemedText style={styles.addCardText}>New patient</ThemedText>
        </View>
        <View style={styles.addCardDecoration}>
          <ThemedText style={styles.addCardEmoji}>✨</ThemedText>
        </View>
      </ThemedCard>
    </Pressable>
  )

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <ThemedText style={styles.emptyEmoji}>🐾</ThemedText>
      <ThemedText style={styles.emptyTitle}>No animals yet</ThemedText>
      <ThemedText style={styles.emptyText}>
        Tap the "+ Add Animal" button to add your first patient
      </ThemedText>
    </View>
  )

  const EmptyFilterState = () => (
    <View style={styles.emptyContainer}>
      <ThemedText style={styles.emptyEmoji}>🔍</ThemedText>
      <ThemedText style={styles.emptyTitle}>No matching animals</ThemedText>
      <ThemedText style={styles.emptyText}>
        Try adjusting your filters or search query to see more results
      </ThemedText>
      <TouchableOpacity onPress={resetFilters} style={styles.resetButton}>
        <ThemedText style={styles.resetButtonText}>Reset Filters</ThemedText>
      </TouchableOpacity>
    </View>
  )

  const FiltersSidebar = () => (
    <View style={[styles.filtersSidebar, isWeb && styles.filtersSidebarWeb]}>
      <View style={styles.filtersHeader}>
        <ThemedText style={styles.filtersHeading}>Filters</ThemedText>
        {(selectedSpecies.length > 0 || selectedStatus.length > 0 || selectedAgeRange.length > 0 || searchQuery) && (
          <TouchableOpacity onPress={resetFilters}>
            <ThemedText style={styles.resetLink}>Reset all</ThemedText>
          </TouchableOpacity>
        )}
      </View>

      <FilterSection
        title="Species"
        options={availableSpecies}
        selectedValues={selectedSpecies}
        onToggle={(value) => toggleFilter('species', value)}
        color={Colors.primary}
      />

      <FilterSection
        title="Status"
        options={['Active']}
        selectedValues={selectedStatus}
        onToggle={(value) => toggleFilter('status', value)}
        color={Colors.primary}
      />

      <FilterSection
        title="Age Range"
        options={['<1 yr', '1-3 yr', '4-7 yr', '8+ yr']}
        selectedValues={selectedAgeRange}
        onToggle={(value) => toggleFilter('age', value)}
        color={Colors.primary}
      />

      {(selectedSpecies.length > 0 || selectedStatus.length > 0 || selectedAgeRange.length > 0 || searchQuery) && (
        <TouchableOpacity onPress={resetFilters} style={styles.resetButtonFull}>
          <ThemedText style={styles.resetButtonFullText}>Reset All Filters</ThemedText>
        </TouchableOpacity>
      )}
    </View>
  )

  const displayData = useMemo(() => {
    return [...filteredAnimals, { isAddButton: true, id: 'add-button' }]
  }, [filteredAnimals])

  const renderItem = ({ item }) => {
    if (item.isAddButton) {
      return <AddAnimalCard />
    }
    return renderAnimalCard({ item })
  }

  return (
    <ThemedView style={styles.container} safe={true}>
      <Spacer />
      
      <View style={styles.headerContainer}>
        <ThemedText title={true} style={styles.heading}>
          Your Animal List
        </ThemedText>
        
        <View style={styles.headerRight}>
          <View style={styles.searchContainer}>
            <ThemedText style={styles.searchIcon}>🔍</ThemedText>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, species, breed..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <ThemedText style={styles.clearIcon}>✕</ThemedText>
              </TouchableOpacity>
            )}
          </View>
          
          {!isWeb && (
            <TouchableOpacity 
              onPress={() => setShowFilters(!showFilters)} 
              style={styles.filterToggle}
            >
              <ThemedText style={styles.filterToggleText}>
                {showFilters ? 'Hide' : 'Filter'}
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Spacer />

      <View style={styles.mainContent}>
        {(isWeb || showFilters) && <FiltersSidebar />}
        
        <View style={[styles.gridContainer, !isWeb && showFilters && styles.gridWithFilters]}>
          <FlatList
            key={isWeb ? 'web-grid' : (showFilters ? 'filtered-grid' : 'full-grid')}
            data={displayData}
            keyExtractor={(item) => item.id || item.$id}
            numColumns={isWeb ? 4 : 2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.list}
            renderItem={renderItem}
            ListEmptyComponent={filteredAnimals.length === 0 && animals.length > 0 ? EmptyFilterState : EmptyState}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>

      <CreateAnimalModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={() => {
          setModalVisible(false)
        }}
      />
    </ThemedView>
  )
}

export default Animals

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    flexWrap: 'wrap',
    gap: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heading: {
    fontWeight: "bold",
    fontSize: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    minWidth: isWeb ? 250 : 180,
    height: 40,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#999',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 0,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  clearIcon: {
    fontSize: 16,
    color: '#999',
    padding: 4,
  },
  filterToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.primary + '15',
    borderRadius: 8,
  },
  filterToggleText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    gap: 16,
  },
  filtersSidebar: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginLeft: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  filtersSidebarWeb: {
    width: 240,
    position: 'sticky',
    top: 20,
    alignSelf: 'flex-start',
    maxHeight: 'calc(100vh - 100px)',
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  filtersHeading: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetLink: {
    fontSize: 12,
    color: Colors.primary,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#6B887A',
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  filterLabel: {
    fontSize: 14,
  },
  resetButtonFull: {
    marginTop: 16,
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonFullText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  gridContainer: {
    flex: 1,
  },
  gridWithFilters: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 12,
    paddingBottom: 40,
    flexGrow: 1,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
    gap: 12,
  },
  card: {
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 160,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  addCard: {
    backgroundColor: Colors.primary + '08',
    borderWidth: 2,
    borderColor: Colors.primary + '30',
    borderStyle: 'dashed',
    justifyContent: 'center',
  },
  addIconContainer: {
    backgroundColor: Colors.primary + '20',
  },
  addIcon: {
    fontSize: 28,
  },
  addCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
    color: Colors.primary,
  },
  addCardSubtitle: {
    marginBottom: 8,
  },
  addCardText: {
    fontSize: 10,
    color: '#6B887A',
  },
  addCardDecoration: {
    marginTop: 4,
  },
  addCardEmoji: {
    fontSize: 20,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  speciesIcon: {
    fontSize: 22,
  },
  name: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: 'center',
    marginBottom: 6,
  },
  ageContainer: {
    marginBottom: 4,
  },
  ageValue: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    gap: 4,
  },
  infoText: {
    fontSize: 10,
    color: '#6B887A',
  },
  infoDivider: {
    width: 1,
    height: 10,
    backgroundColor: '#E5E5E5',
  },
  statusContainer: {
    marginTop: 4,
    width: '100%',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DAF6E1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1F8A47',
    marginRight: 4,
  },
  statusText: {
    fontSize: 9,
    fontWeight: "600",
    color: "#1F8A47",
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6B887A',
  },
  resetButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
})
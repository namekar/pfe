// PocketWatch/components/VetIntelAI/CategoryFilter.jsx

import { ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import ThemedText from '../ThemedText';
import { Colors } from '../../constants/colors';
import { CATEGORIES } from '../../lib/newsSources';

const CategoryFilter = ({ selectedCategory, onSelectCategory }) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {CATEGORIES.map(category => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryChip,
            selectedCategory === category.id && styles.categoryChipActive
          ]}
          onPress={() => onSelectCategory(category.id)}
        >
          <ThemedText style={styles.categoryChipIcon}>{category.icon}</ThemedText>
          <ThemedText style={[
            styles.categoryChipText,
            selectedCategory === category.id && styles.categoryChipTextActive
          ]}>
            {category.name}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 10,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary + '20',
  },
  categoryChipIcon: {
    fontSize: 14,
  },
  categoryChipText: {
    fontSize: 13,
    color: Colors.text,
  },
  categoryChipTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
});

export default CategoryFilter;
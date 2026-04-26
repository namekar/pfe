// PocketWatch/app/(dashboard)/(vetDashboard)/VetIntelAI.jsx

import { View, StyleSheet, ScrollView, RefreshControl, TextInput, Platform } from 'react-native';
import { useState } from 'react';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../../constants/colors';
import ThemedView from '../../../components/ThemedView';
import ThemedText from '../../../components/ThemedText';
import Spacer from '../../../components/Spacer';
import NewsCard from '../../../components/VetIntelAI/NewsCard';
import CategoryFilter from '../../../components/VetIntelAI/CategoryFilter';
import AIInsightCard from '../../../components/VetIntelAI/AIInsightCard';
import { useVetNews } from '../../../hooks/useVetNews';

const VetIntelAI = () => {
  const {
    news,
    loading,
    refreshing,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    savedArticles,
    saveArticle,
    shareArticle,
    onRefresh
  } = useVetNews();

  const [insightKey, setInsightKey] = useState(0);

  const refreshInsight = () => {
    setInsightKey(prev => prev + 1);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons name="robot-brain" size={28} color={Colors.primary} />
          <ThemedText style={styles.title}>Vet News</ThemedText>
        </View>
      </View>

      <Spacer />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color={Colors.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search news, research, or topics..."
          placeholderTextColor={Colors.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Feather name="x" size={20} color={Colors.muted} />
          </TouchableOpacity>
        )}
      </View>

      <Spacer />

      {/* Categories */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <Spacer />

      {/* AI Insight Card */}
      <AIInsightCard key={insightKey} onRefresh={refreshInsight} />

      <Spacer />

      {/* News Feed */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.newsList}
      >
        {news.map(article => (
          <NewsCard
            key={article.id}
            article={article}
            isSaved={savedArticles.includes(article.id)}
            onSave={saveArticle}
            onShare={shareArticle}
          />
        ))}
        
        {news.length === 0 && !loading && (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyEmoji}>📭</ThemedText>
            <ThemedText style={styles.emptyTitle}>No news found</ThemedText>
            <ThemedText style={styles.emptyText}>
              Try changing your search or category filters
            </ThemedText>
          </View>
        )}
        
        <Spacer height={40} />
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  newsList: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.muted,
    textAlign: 'center',
  },
});

export default VetIntelAI;
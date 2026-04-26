// PocketWatch/components/VetIntelAI/NewsCard.jsx

import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ThemedCard from '../ThemedCard';
import ThemedText from '../ThemedText';
import { Colors } from '../../constants/colors';

const NewsCard = ({ article, isSaved, onSave, onShare }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const getCategoryColor = (category) => {
    const colors = {
      research: '#32B36A',
      drugs: '#FF6B6B',
      outbreak: '#FFA500',
      practice: '#4A90E2',
      events: '#9B59B6'
    };
    return colors[category] || '#6B887A';
  };

  const openArticle = () => {
    if (article.url) {
      Linking.openURL(article.url);
    }
  };

  return (
    <ThemedCard style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.sourceContainer}>
          <ThemedText style={styles.sourceIcon}>{article.sourceIcon || '📄'}</ThemedText>
          <ThemedText style={styles.sourceName}>{article.source}</ThemedText>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(article.category) + '20' }]}>
            <ThemedText style={[styles.categoryText, { color: getCategoryColor(article.category) }]}>
              {article.category}
            </ThemedText>
          </View>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={() => onSave(article.id)} style={styles.actionButton}>
            <Feather 
              name={isSaved ? 'bookmark' : 'bookmark'} 
              size={18} 
              color={isSaved ? Colors.primary : Colors.muted} 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onShare(article)} style={styles.actionButton}>
            <Feather name="share-2" size={18} color={Colors.muted} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={openArticle} activeOpacity={0.7}>
        <ThemedText style={styles.newsTitle}>{article.title}</ThemedText>
        <ThemedText style={styles.newsSummary} numberOfLines={3}>
          {article.summary}
        </ThemedText>
      </TouchableOpacity>
      
      <View style={styles.cardFooter}>
        <View style={styles.dateContainer}>
          <Feather name="clock" size={12} color={Colors.muted} />
          <ThemedText style={styles.dateText}>{formatDate(article.publishedAt)}</ThemedText>
        </View>
        
        <TouchableOpacity onPress={openArticle} style={styles.readMoreButton}>
          <ThemedText style={styles.readMoreText}>Read more</ThemedText>
          <Feather name="arrow-right" size={12} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </ThemedCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  sourceIcon: {
    fontSize: 14,
  },
  sourceName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 22,
  },
  newsSummary: {
    fontSize: 13,
    color: Colors.muted,
    lineHeight: 18,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 11,
    color: Colors.muted,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readMoreText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
});

export default NewsCard;
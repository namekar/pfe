// PocketWatch/components/VetIntelAI/AIInsightCard.jsx

import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import ThemedCard from '../ThemedCard';
import ThemedText from '../ThemedText';
import { Colors } from '../../constants/colors';

const AIInsightCard = ({ insight, onRefresh }) => {
  // Generate dynamic insights based on user's data or recent news
  const getInsightMessage = () => {
    const insights = [
      {
        icon: '🦠',
        title: 'Regional Alert',
        message: 'Canine influenza cases are rising in your area. Consider updating vaccines for at-risk patients.',
        action: 'View Details'
      },
      {
        icon: '💊',
        title: 'Drug Update',
        message: 'New FDA-approved treatment for feline diabetes available. Bexagliflozin shows promising results.',
        action: 'Learn More'
      },
      {
        icon: '📚',
        title: 'CME Opportunity',
        message: 'Upcoming webinar on advanced dentistry: "Managing Periodontal Disease in Senior Pets" - Tomorrow at 2 PM.',
        action: 'Register Now'
      },
      {
        icon: '🔬',
        title: 'Research Highlight',
        message: 'New study links early spay/neuter to increased cancer risk in Golden Retrievers. Review the findings.',
        action: 'Read Study'
      }
    ];
    
    return insights[Math.floor(Math.random() * insights.length)];
  };
  
  const currentInsight = insight || getInsightMessage();

  return (
    <ThemedCard style={styles.aiCard}>
      <View style={styles.aiHeader}>
        <View style={styles.aiIconContainer}>
          <MaterialCommunityIcons name="robot-brain" size={24} color={Colors.primary} />
        </View>
        <View style={styles.aiContent}>
          <View style={styles.aiTitleRow}>
            <ThemedText style={styles.aiTitle}>AI Insight</ThemedText>
            <TouchableOpacity onPress={onRefresh}>
              <Feather name="refresh-cw" size={14} color={Colors.muted} />
            </TouchableOpacity>
          </View>
          <ThemedText style={styles.aiText}>{currentInsight.message}</ThemedText>
          <TouchableOpacity style={styles.aiAction}>
            <ThemedText style={styles.aiActionText}>{currentInsight.action}</ThemedText>
            <Feather name="chevron-right" size={14} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </ThemedCard>
  );
};

const styles = StyleSheet.create({
  aiCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.primary + '08',
    marginBottom: 12,
  },
  aiHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  aiIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiContent: {
    flex: 1,
  },
  aiTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  aiTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  aiText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
    color: Colors.text,
  },
  aiAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  aiActionText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
});

export default AIInsightCard;
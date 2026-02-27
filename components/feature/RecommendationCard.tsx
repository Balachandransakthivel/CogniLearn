import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { Recommendation } from '@/types/learning';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onPress?: () => void;
}

export function RecommendationCard({ recommendation, onPress }: RecommendationCardProps) {
  const getPriorityColor = () => {
    switch (recommendation.priority) {
      case 'high': return theme.colors.danger;
      case 'medium': return theme.colors.warning;
      case 'low': return theme.colors.info;
      default: return theme.colors.textSecondary;
    }
  };

  const getCategoryIcon = (): keyof typeof MaterialIcons.glyphMap => {
    switch (recommendation.category) {
      case 'study-strategy': return 'school';
      case 'content': return 'library-books';
      case 'timing': return 'schedule';
      case 'approach': return 'explore';
      default: return 'lightbulb';
    }
  };

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed
      ]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <MaterialIcons name={getCategoryIcon()} size={24} color={theme.colors.primary} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{recommendation.title}</Text>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() + '20' }]}>
            <Text style={[styles.priorityText, { color: getPriorityColor() }]}>
              {recommendation.priority.toUpperCase()}
            </Text>
          </View>
        </View>
        <Text style={styles.description}>{recommendation.description}</Text>
        <Text style={styles.category}>{recommendation.category.replace('-', ' ')}</Text>
      </View>
      
      <MaterialIcons name="chevron-right" size={24} color={theme.colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  cardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  priorityText: {
    ...theme.typography.caption,
    fontWeight: '600',
    fontSize: 10,
  },
  description: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  category: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    textTransform: 'capitalize',
  },
});

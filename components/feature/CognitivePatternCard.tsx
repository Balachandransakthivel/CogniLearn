import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { CognitivePattern } from '@/types/learning';

interface CognitivePatternCardProps {
  pattern: CognitivePattern;
  onViewDetails?: () => void;
}

export function CognitivePatternCard({ pattern, onViewDetails }: CognitivePatternCardProps) {
  const getPatternIcon = (): keyof typeof MaterialIcons.glyphMap => {
    switch (pattern.type) {
      case 'analytical': return 'psychology';
      case 'creative': return 'lightbulb';
      case 'kinesthetic': return 'touch-app';
      case 'visual': return 'visibility';
      default: return 'school';
    }
  };

  const getPatternColor = () => {
    switch (pattern.type) {
      case 'analytical': return theme.colors.primary;
      case 'creative': return theme.colors.secondary;
      case 'kinesthetic': return theme.colors.success;
      case 'visual': return theme.colors.warning;
      default: return theme.colors.primary;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.iconContainer, { backgroundColor: getPatternColor() + '20' }]}>
            <MaterialIcons name={getPatternIcon()} size={28} color={getPatternColor()} />
          </View>
          <View style={styles.titleContent}>
            <Text style={styles.title}>Learning Pattern Detected</Text>
            <Text style={styles.patternType}>{pattern.type.toUpperCase()} LEARNER</Text>
          </View>
        </View>
        <View style={styles.confidenceContainer}>
          <Text style={styles.confidenceLabel}>Confidence</Text>
          <Text style={[styles.confidenceValue, { color: getPatternColor() }]}>
            {Math.round(pattern.confidence * 100)}%
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Characteristics</Text>
        {pattern.characteristics.slice(0, 3).map((char, index) => (
          <View key={index} style={styles.listItem}>
            <MaterialIcons name="check-circle" size={16} color={getPatternColor()} />
            <Text style={styles.listText}>{char}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Strengths</Text>
        {pattern.strengths.slice(0, 2).map((strength, index) => (
          <View key={index} style={styles.listItem}>
            <MaterialIcons name="star" size={16} color={theme.colors.warning} />
            <Text style={styles.listText}>{strength}</Text>
          </View>
        ))}
      </View>

      {onViewDetails && (
        <Pressable 
          style={({ pressed }) => [
            styles.detailButton,
            { backgroundColor: getPatternColor() },
            pressed && styles.detailButtonPressed
          ]}
          onPress={onViewDetails}
        >
          <Text style={styles.detailButtonText}>View Detailed Analysis</Text>
          <MaterialIcons name="arrow-forward" size={18} color={theme.colors.textPrimary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContent: {
    flex: 1,
  },
  title: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  patternType: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  confidenceContainer: {
    alignItems: 'flex-end',
  },
  confidenceLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  confidenceValue: {
    ...theme.typography.h4,
    fontWeight: '700',
  },
  section: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  listText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
  },
  detailButtonPressed: {
    opacity: 0.8,
  },
  detailButtonText: {
    ...theme.typography.button,
    color: theme.colors.textPrimary,
    fontSize: 14,
  },
});

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { useLearningAnalytics } from '@/hooks/useLearningAnalytics';

export default function PatternDetailsScreen() {
  const { cognitivePattern } = useLearningAnalytics();

  if (!cognitivePattern) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No pattern data available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Cognitive Pattern Analysis</Text>
        <Text style={styles.subtitle}>AI-powered learning style insights</Text>
      </View>

      <View style={styles.patternCard}>
        <Text style={styles.patternType}>{cognitivePattern.type.toUpperCase()} LEARNER</Text>
        <Text style={styles.confidence}>
          {Math.round(cognitivePattern.confidence * 100)}% confidence
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Characteristics</Text>
        {cognitivePattern.characteristics.map((char, index) => (
          <View key={index} style={styles.listItem}>
            <MaterialIcons name="check-circle" size={20} color={theme.colors.primary} />
            <Text style={styles.listText}>{char}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Strengths</Text>
        {cognitivePattern.strengths.map((strength, index) => (
          <View key={index} style={styles.listItem}>
            <MaterialIcons name="star" size={20} color={theme.colors.warning} />
            <Text style={styles.listText}>{strength}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Areas for Improvement</Text>
        {cognitivePattern.improvements.map((improvement, index) => (
          <View key={index} style={styles.listItem}>
            <MaterialIcons name="trending-up" size={20} color={theme.colors.success} />
            <Text style={styles.listText}>{improvement}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  patternCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  patternType: {
    ...theme.typography.h2,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  confidence: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  listText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xxl,
  },
});

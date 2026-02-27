import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { LearningSession } from '@/types/learning';

interface SessionHistoryCardProps {
  session: LearningSession;
}

export function SessionHistoryCard({ session }: SessionHistoryCardProps) {
  const accuracy = Math.round((session.correctAnswers / session.totalQuestions) * 100);
  const duration = Math.round((session.endTime - session.startTime) / 60000);
  const date = new Date(session.startTime);
  
  const getAccuracyColor = () => {
    if (accuracy >= 80) return theme.colors.success;
    if (accuracy >= 60) return theme.colors.warning;
    return theme.colors.danger;
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.subjectContainer}>
          <MaterialIcons name="book" size={20} color={theme.colors.primary} />
          <View>
            <Text style={styles.subject}>{session.subject}</Text>
            <Text style={styles.topic}>{session.topic}</Text>
          </View>
        </View>
        <Text style={styles.date}>
          {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </Text>
      </View>

      <View style={styles.metrics}>
        <View style={styles.metric}>
          <MaterialIcons name="assignment" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.metricValue}>{session.totalQuestions}</Text>
          <Text style={styles.metricLabel}>Questions</Text>
        </View>

        <View style={styles.metric}>
          <MaterialIcons name="check-circle" size={18} color={getAccuracyColor()} />
          <Text style={[styles.metricValue, { color: getAccuracyColor() }]}>{accuracy}%</Text>
          <Text style={styles.metricLabel}>Accuracy</Text>
        </View>

        <View style={styles.metric}>
          <MaterialIcons name="schedule" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.metricValue}>{duration}m</Text>
          <Text style={styles.metricLabel}>Duration</Text>
        </View>

        <View style={styles.metric}>
          <MaterialIcons name="stars" size={18} color={theme.colors.warning} />
          <Text style={styles.metricValue}>{session.behavioralData.focusScore}</Text>
          <Text style={styles.metricLabel}>Focus</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  subjectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
  },
  subject: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  topic: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  date: {
    ...theme.typography.bodySmall,
    color: theme.colors.textTertiary,
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  metric: {
    alignItems: 'center',
    gap: 4,
  },
  metricValue: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  metricLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
});

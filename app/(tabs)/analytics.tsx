import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';
import { useLearningAnalytics } from '@/hooks/useLearningAnalytics';
import { aiPatternService } from '@/services/aiPatternService';

const timeRanges = ['Week', 'Month', 'All Time'];

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const { sessions, metrics } = useLearningAnalytics();
  const [selectedRange, setSelectedRange] = useState('Week');

  const riskAnalysis = metrics ? aiPatternService.predictRisk(metrics) : null;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Detailed Analytics</Text>
          <Text style={styles.subtitle}>AI-powered insights & predictions</Text>
        </View>

        {/* Time Range Selector */}
        <View style={styles.timeRangeContainer}>
          {timeRanges.map((range) => (
            <Pressable
              key={range}
              style={({ pressed }) => [
                styles.timeRangeButton,
                selectedRange === range && styles.timeRangeButtonActive,
                pressed && styles.timeRangeButtonPressed,
              ]}
              onPress={() => setSelectedRange(range)}
            >
              <Text style={[
                styles.timeRangeText,
                selectedRange === range && styles.timeRangeTextActive,
              ]}>
                {range}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Study Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Study Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <MaterialIcons name="school" size={32} color={theme.colors.primary} />
              <Text style={styles.statValue}>{sessions.length}</Text>
              <Text style={styles.statLabel}>Total Sessions</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="access-time" size={32} color={theme.colors.secondary} />
              <Text style={styles.statValue}>
                {Math.round(sessions.reduce((sum, s) => sum + (s.endTime - s.startTime), 0) / 60000)}m
              </Text>
              <Text style={styles.statLabel}>Study Time</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="question-answer" size={32} color={theme.colors.success} />
              <Text style={styles.statValue}>
                {sessions.reduce((sum, s) => sum + s.totalQuestions, 0)}
              </Text>
              <Text style={styles.statLabel}>Questions</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="local-fire-department" size={32} color={theme.colors.warning} />
              <Text style={styles.statValue}>7</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>
        </View>

        {/* Risk Prediction */}
        {riskAnalysis && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Early Risk Detection</Text>
            <View style={styles.riskCard}>
              <View style={styles.riskHeader}>
                <View style={styles.riskIconContainer}>
                  <MaterialIcons 
                    name="warning" 
                    size={28} 
                    color={
                      riskAnalysis.level === 'high' ? theme.colors.danger :
                      riskAnalysis.level === 'medium' ? theme.colors.warning :
                      theme.colors.success
                    } 
                  />
                </View>
                <View style={styles.riskContent}>
                  <Text style={styles.riskLevel}>
                    {riskAnalysis.level.toUpperCase()} RISK
                  </Text>
                  <Text style={styles.riskDescription}>
                    {riskAnalysis.level === 'low' 
                      ? 'Learning progress is on track'
                      : 'Attention needed in some areas'
                    }
                  </Text>
                </View>
              </View>

              <View style={styles.riskSection}>
                <Text style={styles.riskSectionTitle}>Risk Factors</Text>
                {riskAnalysis.factors.map((factor, index) => (
                  <View key={index} style={styles.riskItem}>
                    <MaterialIcons name="fiber-manual-record" size={8} color={theme.colors.textSecondary} />
                    <Text style={styles.riskItemText}>{factor}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.riskSection}>
                <Text style={styles.riskSectionTitle}>Recommended Interventions</Text>
                {riskAnalysis.interventions.map((intervention, index) => (
                  <View key={index} style={styles.riskItem}>
                    <MaterialIcons name="check-circle" size={16} color={theme.colors.success} />
                    <Text style={styles.riskItemText}>{intervention}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Subject Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subject Performance</Text>
          {['Mathematics', 'Science', 'English', 'History'].map((subject) => {
            const subjectSessions = sessions.filter(s => s.subject === subject);
            const accuracy = subjectSessions.length > 0
              ? Math.round((subjectSessions.reduce((sum, s) => sum + s.correctAnswers, 0) / 
                  subjectSessions.reduce((sum, s) => sum + s.totalQuestions, 0)) * 100)
              : 0;
            
            return (
              <View key={subject} style={styles.subjectCard}>
                <View style={styles.subjectHeader}>
                  <Text style={styles.subjectName}>{subject}</Text>
                  <Text style={styles.subjectSessions}>{subjectSessions.length} sessions</Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${accuracy}%`,
                        backgroundColor: accuracy >= 70 ? theme.colors.success : theme.colors.warning
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.accuracyText}>{accuracy}% accuracy</Text>
              </View>
            );
          })}
        </View>

        {/* Weekly Report */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Growth Report</Text>
          <View style={styles.reportCard}>
            <View style={styles.reportItem}>
              <MaterialIcons name="trending-up" size={24} color={theme.colors.success} />
              <View style={styles.reportContent}>
                <Text style={styles.reportValue}>+{metrics?.weeklyGrowth || 0}%</Text>
                <Text style={styles.reportLabel}>Performance Improvement</Text>
              </View>
            </View>
            <View style={styles.reportItem}>
              <MaterialIcons name="stars" size={24} color={theme.colors.warning} />
              <View style={styles.reportContent}>
                <Text style={styles.reportValue}>{metrics?.focusScore || 0}</Text>
                <Text style={styles.reportLabel}>Average Focus Score</Text>
              </View>
            </View>
            <View style={styles.reportItem}>
              <MaterialIcons name="psychology" size={24} color={theme.colors.primary} />
              <View style={styles.reportContent}>
                <Text style={styles.reportValue}>{metrics?.engagementScore || 0}%</Text>
                <Text style={styles.reportLabel}>Engagement Level</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
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
  timeRangeContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  timeRangeButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  timeRangeButtonPressed: {
    opacity: 0.7,
  },
  timeRangeText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  timeRangeTextActive: {
    color: '#FFF',
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statValue: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.sm,
  },
  statLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  riskCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  riskHeader: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  riskIconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  riskContent: {
    flex: 1,
  },
  riskLevel: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  riskDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  riskSection: {
    marginBottom: theme.spacing.md,
  },
  riskSectionTitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  riskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  riskItemText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  subjectCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  subjectName: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  subjectSessions: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: 4,
    marginBottom: theme.spacing.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  accuracyText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  reportCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  reportItem: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
  reportContent: {
    flex: 1,
  },
  reportValue: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  reportLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
});

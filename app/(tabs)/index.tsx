import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';
import { useLearningAnalytics } from '@/hooks/useLearningAnalytics';
import { MetricCard } from '@/components/ui/MetricCard';
import { CognitivePatternCard } from '@/components/feature/CognitivePatternCard';
import { RecommendationCard } from '@/components/feature/RecommendationCard';
import { SessionHistoryCard } from '@/components/feature/SessionHistoryCard';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { sessions, metrics, recommendations, cognitivePattern, loading, refresh } = useLearningAnalytics();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const getRiskColor = () => {
    if (!metrics) return theme.colors.textSecondary;
    switch (metrics.riskLevel) {
      case 'high': return theme.colors.danger;
      case 'medium': return theme.colors.warning;
      case 'low': return theme.colors.success;
      default: return theme.colors.textSecondary;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Learning Analytics</Text>
            <Text style={styles.subtitle}>Cognitive Pattern Insights</Text>
          </View>
          <Pressable 
            style={({ pressed }) => [
              styles.profileButton,
              pressed && styles.profileButtonPressed
            ]}
            onPress={() => router.push('/profile')}
          >
            <MaterialIcons name="account-circle" size={40} color={theme.colors.primary} />
          </Pressable>
        </View>

        {/* Key Metrics Grid */}
        {metrics && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance Overview</Text>
            <View style={styles.metricsGrid}>
              <MetricCard
                title="Focus Score"
                value={metrics.focusScore}
                icon="center-focus-strong"
                color={theme.colors.primary}
                trend={metrics.focusScore >= 70 ? 'up' : 'down'}
                trendValue={`${metrics.focusScore >= 70 ? '+' : ''}${Math.abs(metrics.focusScore - 70)}`}
              />
              <MetricCard
                title="Engagement"
                value={metrics.engagementScore}
                icon="psychology"
                color={theme.colors.secondary}
                trend={metrics.engagementScore >= 70 ? 'up' : 'neutral'}
                trendValue={`${metrics.engagementScore}%`}
              />
            </View>
            <View style={styles.metricsGrid}>
              <MetricCard
                title="Accuracy Trend"
                value={`${metrics.accuracyTrend}%`}
                subtitle="Recent performance"
                icon="trending-up"
                color={theme.colors.success}
              />
              <MetricCard
                title="Learning Speed"
                value={metrics.learningSpeed}
                subtitle="Questions/min"
                icon="speed"
                color={theme.colors.warning}
              />
            </View>
            <View style={styles.metricsGrid}>
              <MetricCard
                title="Weekly Growth"
                value={`${metrics.weeklyGrowth > 0 ? '+' : ''}${metrics.weeklyGrowth}%`}
                icon="insights"
                color={metrics.weeklyGrowth >= 0 ? theme.colors.success : theme.colors.danger}
                trend={metrics.weeklyGrowth >= 0 ? 'up' : 'down'}
              />
              <MetricCard
                title="Risk Level"
                value={metrics.riskLevel.toUpperCase()}
                icon="warning"
                color={getRiskColor()}
              />
            </View>
          </View>
        )}

        {/* Cognitive Pattern */}
        {cognitivePattern && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AI Pattern Analysis</Text>
            <CognitivePatternCard 
              pattern={cognitivePattern}
              onViewDetails={() => router.push('/pattern-details')}
            />
          </View>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Personalized Recommendations</Text>
              <Text style={styles.sectionCount}>{recommendations.length}</Text>
            </View>
            {recommendations.map((rec) => (
              <RecommendationCard
                key={rec.id}
                recommendation={rec}
                onPress={() => {}}
              />
            ))}
          </View>
        )}

        {/* Recent Sessions */}
        {sessions.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Learning Sessions</Text>
              <Pressable onPress={() => router.push('/history')}>
                <Text style={styles.viewAllText}>View All</Text>
              </Pressable>
            </View>
            {sessions.slice(-5).reverse().map((session) => (
              <SessionHistoryCard key={session.id} session={session} />
            ))}
          </View>
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  greeting: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  profileButton: {
    borderRadius: theme.borderRadius.round,
  },
  profileButtonPressed: {
    opacity: 0.7,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  sectionCount: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  viewAllText: {
    ...theme.typography.bodySmall,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
});
